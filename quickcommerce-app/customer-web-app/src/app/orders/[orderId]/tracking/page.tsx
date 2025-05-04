"use client";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

const minimalMapStyle = [
  { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#eaeaea" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e6ff" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] }
];

const deliveryAddress = { lat: 28.6139, lng: 77.2090 };
const initialPartnerLocation = { lat: 28.7041, lng: 77.1025 };

async function fetchDistanceAndETA(origin: { lat: number; lng: number }, dest: { lat: number; lng: number }) {
  const res = await fetch(
    `/api/distance?origins=${origin.lat},${origin.lng}&destinations=${dest.lat},${dest.lng}`
  );
  const data = await res.json();
  if (
    data.rows &&
    data.rows[0] &&
    data.rows[0].elements &&
    data.rows[0].elements[0].status === "OK"
  ) {
    return {
      distance: data.rows[0].elements[0].distance.text,
      duration: data.rows[0].elements[0].duration.text,
    };
  }
  return { distance: "N/A", duration: "N/A" };
}

async function fetchRoutePolyline(origin: { lat: number; lng: number }, dest: { lat: number; lng: number }) {
  const res = await fetch(
    `/api/directions?origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}`
  );
  const data = await res.json();
  if (
    data.routes &&
    data.routes[0] &&
    data.routes[0].overview_polyline &&
    data.routes[0].overview_polyline.points
  ) {
    // Decode polyline to array of [lat, lng]
    return polyline.decode(data.routes[0].overview_polyline.points).map(([lat, lng]: [number, number]) => ({ lat, lng }));
  }
  return [];
}

export default function OrderTrackingPage() {
  const [partnerLoc, setPartnerLoc] = useState(initialPartnerLocation);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerLoc((prev) => {
        const step = 0.001;
        const latDiff = deliveryAddress.lat - prev.lat;
        const lngDiff = deliveryAddress.lng - prev.lng;
        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        if (dist < 0.0005) return prev;
        return {
          ...prev,
          lat: prev.lat + (latDiff / dist) * step,
          lng: prev.lng + (lngDiff / dist) * step,
        };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function updateDistanceAndRoute() {
      const [distanceResult, route] = await Promise.all([
        fetchDistanceAndETA(partnerLoc, deliveryAddress),
        fetchRoutePolyline(partnerLoc, deliveryAddress),
      ]);
      setDistance(distanceResult.distance);
      setDuration(distanceResult.duration);
      setRoutePath(route);
    }
    updateDistanceAndRoute();
  }, [partnerLoc]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      <div className="mb-4">
        <div className="text-gray-700">Order #123456</div>
        <div className="text-gray-700">Status: Out for Delivery</div>
        <div className="text-gray-700">
          Distance to delivery: <span className="font-semibold">{distance}</span>
        </div>
        <div className="text-gray-700">
          Estimated time: <span className="font-semibold">{duration}</span>
        </div>
      </div>
      <div className="h-96 w-full rounded shadow overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={deliveryAddress}
          zoom={12}
          options={{
            styles: minimalMapStyle,
            disableDefaultUI: true,
            clickableIcons: false,
          }}
        >
          <Marker position={deliveryAddress} />
          {/* Rider marker with custom icon. Ensure /public/rider.png exists. */}
          <Marker position={partnerLoc} icon="/rider.png" />
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{ strokeColor: "#4285F4", strokeWeight: 4 }}
            />
          )}
        </GoogleMap>
      </div>
      <div className="mt-4 text-gray-600 text-sm">
        The delivery partner's location is updated in real time (mocked for demo). Distance, ETA, and route are powered by Google APIs.
      </div>
    </div>
  );
} 