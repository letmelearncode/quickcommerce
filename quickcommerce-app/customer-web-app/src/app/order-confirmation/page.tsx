"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/orders/${orderId}`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch order confirmation");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to fetch order confirmation");
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="text-lg text-[#6B778C]">Loading order confirmation...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-[#FF5630] mb-4">Error</h1>
          <p className="text-[#6B778C] mb-6">{error}</p>
          <button
            className="px-6 py-2 bg-[#0052CC] text-white rounded-lg font-semibold hover:bg-[#00368F]"
            onClick={() => router.push("/products")}
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="bg-white rounded-lg shadow p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-[#172B4D] mb-4">Thank you for your order!</h1>
        <p className="text-[#36B37E] text-lg font-semibold mb-2">Order #{order.id || orderId} confirmed</p>
        <p className="text-[#6B778C] mb-6">Status: <span className="font-medium text-[#0052CC]">{order.status}</span></p>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#172B4D] mb-2">Order Details</h2>
          {order.items && order.items.length > 0 ? (
            <ul className="divide-y divide-[#DFE1E6]">
              {order.items.map((item: any) => (
                <li key={item.productId} className="py-3 flex justify-between items-center">
                  <span className="text-[#172B4D]">{item.productName}</span>
                  <span className="text-[#6B778C]">x{item.quantity}</span>
                  <span className="text-[#172B4D] font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#6B778C]">No items found in this order.</p>
          )}
        </div>
        {order.deliveryAddress && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#172B4D] mb-2">Delivery Address</h2>
            <div className="text-[#6B778C]">
              <div>{order.deliveryAddress.fullName}</div>
              <div>{order.deliveryAddress.street}</div>
              <div>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</div>
              <div>{order.deliveryAddress.country}</div>
              <div>{order.deliveryAddress.phone}</div>
            </div>
          </div>
        )}
        <button
          className="px-6 py-2 bg-[#0052CC] text-white rounded-lg font-semibold hover:bg-[#00368F] mt-4"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </main>
  );
} 