"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const CHECKOUT_STEPS = ["address", "payment", "summary"] as const;
type CheckoutStep = typeof CHECKOUT_STEPS[number];

interface Address {
  id: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  additionalInfo?: string;
  isDefault?: boolean;
}

// Address Form as a separate memoized component
interface AddressFormProps {
  newAddress: Partial<Address>;
  addressErrors: Record<string, string>;
  savingAddress: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const AddressForm = React.memo(function AddressForm({
  newAddress,
  addressErrors,
  savingAddress,
  onChange,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  return (
    <div className="bg-white rounded-[12px] shadow-lg p-6 max-w-xl mx-auto max-h-[80vh] overflow-y-auto sm:p-6 p-3">
      <form onSubmit={onSubmit} className="space-y-6 flex flex-col h-full">
        <div>
          <label className="block text-sm font-medium text-[#172B4D] mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={newAddress.fullName || ""}
            onChange={onChange}
            autoFocus
            className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.fullName ? "border-[#FF5630]" : ""}`}
            placeholder="Enter your full name"
          />
          {addressErrors.fullName && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#172B4D] mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={newAddress.street || ""}
            onChange={onChange}
            className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.street ? "border-[#FF5630]" : ""}`}
            placeholder="Street address"
          />
          {addressErrors.street && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.street}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">City</label>
            <input
              type="text"
              name="city"
              value={newAddress.city || ""}
              onChange={onChange}
              className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.city ? "border-[#FF5630]" : ""}`}
              placeholder="City"
            />
            {addressErrors.city && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">State</label>
            <input
              type="text"
              name="state"
              value={newAddress.state || ""}
              onChange={onChange}
              className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.state ? "border-[#FF5630]" : ""}`}
              placeholder="State"
            />
            {addressErrors.state && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.state}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={newAddress.country || ""}
              onChange={onChange}
              className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.country ? "border-[#FF5630]" : ""}`}
              placeholder="Country"
            />
            {addressErrors.country && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.country}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#172B4D] mb-1">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={newAddress.zipCode || ""}
              onChange={onChange}
              className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.zipCode ? "border-[#FF5630]" : ""}`}
              placeholder="ZIP code"
            />
            {addressErrors.zipCode && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.zipCode}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#172B4D] mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={newAddress.phone || ""}
            onChange={onChange}
            className={`h-12 bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60 ${addressErrors.phone ? "border-[#FF5630]" : ""}`}
            placeholder="Phone number"
          />
          {addressErrors.phone && <p className="mt-1 text-sm text-[#FF5630]">{addressErrors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#172B4D] mb-1">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={newAddress.additionalInfo || ""}
            onChange={onChange}
            rows={2}
            className="bg-white border border-[#DFE1E6] rounded-[8px] px-4 py-3 w-full text-black font-sans shadow-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 focus:outline-none placeholder:text-[#6B778C]/60"
            placeholder="Delivery instructions, landmarks, etc."
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            checked={!!newAddress.isDefault}
            onChange={onChange}
            className="h-5 w-5 text-[#0052CC] focus:ring-[#0052CC] border-2 border-[#DFE1E6] rounded mr-2"
          />
          <label className="block text-sm text-[#172B4D]">
            Set as default address
          </label>
        </div>
        {addressErrors.submit && (
          <div className="text-[#FF5630] text-sm mt-2">
            {addressErrors.submit}
          </div>
        )}
        <div className="sticky bottom-0 left-0 bg-white pt-4 pb-2 flex justify-end space-x-3 mt-4 z-10 border-t border-[#DFE1E6]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-base font-medium text-[#0052CC] bg-white border border-[#0052CC] rounded-lg hover:bg-[#F0F5FF] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={savingAddress}
            className="px-6 py-2 bg-[#0052CC] text-white rounded-lg font-semibold hover:bg-[#00368F] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-40"
          >
            {savingAddress ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
});

// Move AddressStep outside CheckoutPage
interface AddressStepProps {
  addresses: Address[];
  loadingAddresses: boolean;
  showNewAddressForm: boolean;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  handleSelectAddress: () => void;
  setShowNewAddressForm: (show: boolean) => void;
  newAddress: Partial<Address>;
  addressErrors: Record<string, string>;
  savingAddress: boolean;
  handleNewAddressChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveNewAddress: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddressStep = React.memo(function AddressStep({
  addresses,
  loadingAddresses,
  showNewAddressForm,
  selectedAddressId,
  setSelectedAddressId,
  handleSelectAddress,
  setShowNewAddressForm,
  newAddress,
  addressErrors,
  savingAddress,
  handleNewAddressChange,
  handleSaveNewAddress,
}: AddressStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#172B4D] mb-8">Delivery Address</h2>
      {loadingAddresses ? (
        <div className="text-[#6B778C]">Loading addresses...</div>
      ) : (
        <>
          <div className="mb-8 space-y-6" style={{ display: showNewAddressForm ? 'none' : undefined }}>
            {addresses.length > 0 && (
              <>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`bg-white rounded-xl shadow p-6 flex items-start gap-4 border-2 transition-all duration-150 cursor-pointer ${selectedAddressId === address.id ? "border-[#0052CC] ring-2 ring-[#4C9AFF]" : "border-[#DFE1E6]"}`}
                  >
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 mr-4 accent-[#0052CC] w-5 h-5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#172B4D]">{address.fullName}</p>
                      <p className="text-[#6B778C]">{address.street}</p>
                      {address.apartment && <p className="text-[#6B778C]">{address.apartment}</p>}
                      <p className="text-[#6B778C]">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                      <p className="text-[#6B778C]">{address.country}</p>
                      <p className="text-[#6B778C]">{address.phone}</p>
                      {address.additionalInfo && <p className="text-xs text-[#97A0AF] mt-1">{address.additionalInfo}</p>}
                    </div>
                    {address.isDefault && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-[#E3FCEF] text-[#36B37E]">Default</span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-[#0052CC] hover:text-[#00368F] font-medium mt-2"
                >
                  + Add new address
                </button>
                <button
                  type="button"
                  onClick={handleSelectAddress}
                  disabled={!selectedAddressId}
                  className="w-full bg-[#0052CC] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#00368F] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-2 disabled:opacity-40 mt-4"
                >
                  Continue to Payment
                </button>
              </>
            )}
          </div>
          {showNewAddressForm && (
            <AddressForm
              newAddress={newAddress}
              addressErrors={addressErrors}
              savingAddress={savingAddress}
              onChange={handleNewAddressChange}
              onSubmit={handleSaveNewAddress}
              onCancel={() => setShowNewAddressForm(false)}
            />
          )}
        </>
      )}
    </div>
  );
});

// Move PaymentStep and SummaryStep outside CheckoutPage
interface PaymentStepProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}
const PaymentStep = ({ onSubmit, onBack }: PaymentStepProps) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
    {/* Replace with real payment form */}
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-2"
      onClick={() => onSubmit({
        method: "card",
        card: { brand: "Visa", last4: "4242", exp: "12/26" }
      })}
    >
      Use Example Card
    </button>
    <button
      className="text-black underline ml-2"
      onClick={onBack}
    >
      Back
    </button>
  </div>
);

interface SummaryStepProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  address: Address | null;
  payment: any;
  cart: any;
  error: string | null;
  isPlacingOrder: boolean;
}
const SummaryStep = ({ onBack, onPlaceOrder, address, payment, cart, error, isPlacingOrder }: SummaryStepProps) => (
  <div className="max-w-xl mx-auto bg-white rounded-[12px] shadow p-6 sm:p-8">
    <h2 className="text-2xl font-bold text-[#172B4D] mb-8">Order Summary</h2>
    {/* Shipping Address */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#172B4D] mb-2">Shipping Address</h3>
      <div className="text-[#6B778C] text-base space-y-0.5">
        <p className="font-medium">{address?.fullName}</p>
        <p>{address?.street}</p>
        {address?.apartment && <p>{address.apartment}</p>}
        <p>{`${address?.city}, ${address?.state} ${address?.zipCode}`}</p>
        <p>{address?.country}</p>
        <p className="mt-1">{address?.phone}</p>
      </div>
    </div>
    {/* Payment Method */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#172B4D] mb-2">Payment Method</h3>
      <div className="text-[#6B778C] text-base">
        {payment?.method === "card" && (
          <span className="inline-block bg-[#F4F5F7] rounded px-3 py-1 text-[#172B4D] font-mono text-sm">
            {payment.card.brand} **** {payment.card.last4} (exp {payment.card.exp})
          </span>
        )}
      </div>
    </div>
    {/* Order Items */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#172B4D] mb-4">Order Items</h3>
      <div className="divide-y divide-[#DFE1E6]">
        {cart.items.map((item: any) => (
          <div key={item.productId} className="flex items-center py-4 gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#172B4D] truncate text-base">{item.productName}</p>
              <p className="text-sm text-[#6B778C]">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#172B4D] text-base">${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-[#6B778C]">${item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Order Total */}
    <div className="border-t border-[#DFE1E6] pt-6 mt-6 space-y-2">
      <div className="flex justify-between text-[#6B778C] text-base">
        <span>Subtotal</span>
        <span>${cart.total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-[#6B778C] text-base">
        <span>Tax</span>
        <span>Calculated at checkout</span>
      </div>
      {/* Discount example: if you have a discount, show it here */}
      {/* <div className="flex justify-between text-green-600 text-base">
        <span>Discount</span>
        <span>-$5.00</span>
      </div> */}
      <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#DFE1E6] mt-2">
        <span className="text-[#172B4D]">Total</span>
        <span className="text-[#172B4D]">${cart.total.toFixed(2)}</span>
      </div>
    </div>
    {/* Action Buttons */}
    {error && <div className="text-[#FF5630] mt-4">{error}</div>}
    <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-base font-medium text-[#0052CC] bg-white border border-[#0052CC] rounded-lg hover:bg-[#F0F5FF] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-40 w-full sm:w-auto"
        disabled={isPlacingOrder}
      >
        Back
      </button>
      <button
        type="button"
        onClick={onPlaceOrder}
        className="px-6 py-2 text-base font-medium text-white bg-[#0052CC] rounded-lg hover:bg-[#00368F] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 disabled:opacity-40 w-full sm:w-auto"
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  </div>
);

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<Address | null>(null);
  const [payment, setPayment] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [savingAddress, setSavingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Fetch addresses on mount
  useEffect(() => {
    if (currentStep === "address") {
      fetchAddresses();
    }
  }, [currentStep]);

  async function fetchAddresses() {
    setLoadingAddresses(true);
    try {
      const res = await fetch("/api/addresses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data.addresses || []);
      if (data.addresses && data.addresses.length > 0) {
        const defaultAddr = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (e) {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  }

  // Address form handlers
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === "checkbox") {
      checked = (e.target as HTMLInputElement).checked;
    }
    setNewAddress((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressErrors({});
    const errors = validateAddress(newAddress);
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    setSavingAddress(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) throw new Error("Failed to save address");
      setShowNewAddressForm(false);
      setTimeout(() => setNewAddress({}), 0);
      await fetchAddresses();
    } catch (e) {
      setAddressErrors({ submit: "Failed to save address. Please try again." });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSelectAddress = () => {
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (addr) {
      setAddress(addr);
      setCurrentStep("payment");
    }
  };

  const validateAddress = (addr: Partial<Address>) => {
    const errors: Record<string, string> = {};
    if (!addr.fullName) errors.fullName = "Full name is required";
    if (!addr.street) errors.street = "Street is required";
    if (!addr.city) errors.city = "City is required";
    if (!addr.state) errors.state = "State is required";
    if (!addr.zipCode) errors.zipCode = "ZIP code is required";
    if (!addr.country) errors.country = "Country is required";
    if (!addr.phone) errors.phone = "Phone number is required";
    return errors;
  };

  // Step handlers
  const handlePaymentSubmit = (paymentData: any) => {
    setPayment(paymentData);
    setCurrentStep("summary");
  };
  const handleBack = () => {
    if (currentStep === "payment") setCurrentStep("address");
    if (currentStep === "summary") setCurrentStep("payment");
  };
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setError(null);
    try {
      // Construct the payload to match backend's CreateOrderRequest
      // Assuming Address maps directly to AddressDTO fields
      // You may need to adjust the mapping based on your backend DTOs
      const orderPayload = {
        shippingAddress: {
          fullName: address?.fullName,
          street: address?.street,
          apartment: address?.apartment,
          city: address?.city,
          state: address?.state,
          zipCode: address?.zipCode,
          country: address?.country,
          phone: address?.phone,
          additionalInfo: address?.additionalInfo,
        }, // Assuming 'address' maps to shippingAddress
        // billingAddress: ... // Add if you have a separate billing address
        useShippingAddressForBilling: true, // Set based on UI logic or add to state
        paymentMethodId: payment?.methodId || "mock-payment-method-id", // Assuming payment has a methodId or use a mock
        // notes: ... // Add if you have notes field in UI
        // deliveryInstructions: ... // Add if you have delivery instructions field in UI
        // promoCode: ... // Add if you have a promo code field in UI
        // Removed 'items' from the payload as per backend DTO
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderPayload), // Send the correctly structured payload
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to place order");
      }
      const data = await res.json();
      const orderId = data.orderId || data.id || "";
      if (!orderId) throw new Error("Order ID missing in response");
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (e: any) {
      setError(e?.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Address Step (real)
  const memoizedHandleNewAddressChange = useCallback(handleNewAddressChange, []);
  const memoizedHandleSaveNewAddress = useCallback(handleSaveNewAddress, [newAddress, addressErrors, savingAddress]);
  const memoizedHandleCancel = useCallback(() => setShowNewAddressForm(false), []);

  // Step renderer
  function renderStep() {
    switch (currentStep) {
      case "address":
        return <AddressStep
          addresses={addresses}
          loadingAddresses={loadingAddresses}
          showNewAddressForm={showNewAddressForm}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          handleSelectAddress={handleSelectAddress}
          setShowNewAddressForm={setShowNewAddressForm}
          newAddress={newAddress}
          addressErrors={addressErrors}
          savingAddress={savingAddress}
          handleNewAddressChange={memoizedHandleNewAddressChange}
          handleSaveNewAddress={memoizedHandleSaveNewAddress}
        />;
      case "payment":
        return <PaymentStep onSubmit={handlePaymentSubmit} onBack={handleBack} />;
      case "summary":
        return <SummaryStep onBack={handleBack} onPlaceOrder={handlePlaceOrder} address={address} payment={payment} cart={cart} error={error} isPlacingOrder={isPlacingOrder} />;
      default:
        return null;
    }
  }

  return (
    <main className="bg-[#F4F5F7] min-h-screen py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Checkout</h1>
        {/* Progress Indicator */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-y-2 gap-x-2 sm:gap-x-4" aria-label="Checkout Progress">
          {CHECKOUT_STEPS.map((step, idx) => (
            <React.Fragment key={step}>
              <div className={`flex items-center min-w-[64px] sm:min-w-[100px] ${currentStep === step ? "text-blue-600 font-bold" : "text-black"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm sm:text-lg ${currentStep === step ? "bg-blue-600 text-white" : "bg-black/10"}`}>{idx + 1}</div>
                <span className="ml-1 sm:ml-2 capitalize text-xs sm:text-base truncate">{step}</span>
              </div>
              {idx < CHECKOUT_STEPS.length - 1 && <div className="flex-shrink-0 w-4 sm:w-8 h-px bg-black/20 mx-1 sm:mx-4" />}
            </React.Fragment>
          ))}
        </div>
        {/* Step Content */}
        <div>{renderStep()}</div>
      </div>
    </main>
  );
} 