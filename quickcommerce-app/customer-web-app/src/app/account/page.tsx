'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

async function updateProfile({ name, phone }: { name: string; phone: string }) {
  const res = await fetch('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  const res = await fetch('/api/users/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // If loading or not authenticated, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not authenticated after loading, the middleware should have redirected
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Please log in</h1>
        <p className="mt-4 text-gray-500">
          You need to be logged in to view this page.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }
  
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'security', label: 'Security' },
  ];
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'profile' && <ProfilePanel user={user} />}
            {activeTab === 'orders' && <OrdersPanel />}
            {activeTab === 'addresses' && <AddressesPanel />}
            {activeTab === 'payment' && <PaymentMethodsPanel />}
            {activeTab === 'security' && <SecurityPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Update formData if user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUpdating(true);
    
    try {
      const updated = await updateProfile({ name: formData.name, phone: formData.phone });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isEditing) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
        
        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isUpdating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Edit Profile
        </button>
      </div>
      
      {success && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.name || 'Not set'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.email || 'Not set'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone number</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.phone || 'Not set'}</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account created</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// --- OrdersPanel ---
function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // If paginated, use data.content; else, use data.orders or data
        setOrders(data.content || data.orders || data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading orders...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!orders.length) return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order History</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
      <div className="mt-6">
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
  return (
    <div className="py-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order #</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-4 py-2 font-mono">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">₹{order.total}</td>
                <td className="px-4 py-2">
                  <Link href={`/orders/${order.id}/tracking`} className="text-blue-600 hover:underline">
                    Track Order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- AddressesPanel ---
function AddressesPanel() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '', apartment: '', additionalInfo: '', isDefault: false
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/addresses', { credentials: 'include' });
      const data = await res.json();
      setAddresses(data.addresses || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      checked = e.target.checked;
    }
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowForm(false);
      setForm({ fullName: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '', apartment: '', additionalInfo: '', isDefault: false });
      fetchAddresses();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      await fetch(`/api/addresses/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchAddresses();
    } catch {}
  };

  if (loading) return <div className="py-10 text-center">Loading addresses...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  return (
    <div className="py-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Addresses</h3>
      {addresses.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You haven't added any addresses yet.</p>}
      <div className="space-y-4 mb-6">
        {addresses.map((addr: any) => (
          <div key={addr.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">{addr.fullName}</div>
              <div>{addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}</div>
              <div className="text-gray-500 text-sm">{addr.phone}</div>
              {addr.apartment && <div className="text-gray-400 text-xs">Apt: {addr.apartment}</div>}
              {addr.additionalInfo && <div className="text-gray-400 text-xs">{addr.additionalInfo}</div>}
              {addr.isDefault && <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Default</span>}
            </div>
            <button onClick={() => handleDelete(addr.id)} className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
          </div>
        ))}
      </div>
      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" required />
            <input name="street" value={form.street} onChange={handleChange} placeholder="Street" className="input" required />
            <input name="apartment" value={form.apartment} onChange={handleChange} placeholder="Apartment" className="input" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input" required />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input" required />
            <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="ZIP Code" className="input" required />
            <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input" required />
          </div>
          <textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange} placeholder="Additional Info" className="input" />
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            <span>Set as default</span>
          </label>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add New Address</button>
      )}
    </div>
  );
}

// --- PaymentMethodsPanel ---
function PaymentMethodsPanel() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'CREDIT_CARD', cardBrand: '', last4: '', expiryMonth: '', expiryYear: '', paymentMethodId: '', upiId: '', bankName: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMethods = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment-methods', { credentials: 'include' });
      const data = await res.json();
      setMethods(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment methods.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMethods(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowForm(false);
      setForm({ type: 'CREDIT_CARD', cardBrand: '', last4: '', expiryMonth: '', expiryYear: '', paymentMethodId: '', upiId: '', bankName: '' });
      fetchMethods();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add payment method.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment method?')) return;
    try {
      await fetch(`/api/payment-methods/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchMethods();
    } catch {}
  };

  if (loading) return <div className="py-10 text-center">Loading payment methods...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  return (
    <div className="py-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
      {methods.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You haven't added any payment methods yet.</p>}
      <div className="space-y-4 mb-6">
        {methods.map((pm: any, idx) => (
          <div key={idx} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">{pm.type}</div>
              {pm.type === 'CREDIT_CARD' || pm.type === 'DEBIT_CARD' ? (
                <div>{pm.cardBrand} ****{pm.last4} (exp: {pm.expiryMonth}/{pm.expiryYear})</div>
              ) : pm.type === 'UPI' ? (
                <div>UPI ID: {pm.upiId}</div>
              ) : pm.type === 'NET_BANKING' ? (
                <div>Bank: {pm.bankName}</div>
              ) : null}
            </div>
            <button onClick={() => handleDelete(pm.id)} className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
          </div>
        ))}
      </div>
      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="type" value={form.type} onChange={handleChange} className="input" required>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="WALLET">Wallet</option>
              <option value="COD">Cash on Delivery</option>
            </select>
            {form.type === 'CREDIT_CARD' || form.type === 'DEBIT_CARD' ? (
              <><input name="cardBrand" value={form.cardBrand} onChange={handleChange} placeholder="Card Brand" className="input" required />
              <input name="last4" value={form.last4} onChange={handleChange} placeholder="Last 4 Digits" className="input" required />
              <input name="expiryMonth" value={form.expiryMonth} onChange={handleChange} placeholder="Expiry Month" className="input" required />
              <input name="expiryYear" value={form.expiryYear} onChange={handleChange} placeholder="Expiry Year" className="input" required />
              <input name="paymentMethodId" value={form.paymentMethodId} onChange={handleChange} placeholder="Payment Method ID" className="input" required />
              </>
            ) : form.type === 'UPI' ? (
              <input name="upiId" value={form.upiId} onChange={handleChange} placeholder="UPI ID" className="input" required />
            ) : form.type === 'NET_BANKING' ? (
              <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" className="input" required />
            ) : null}
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Payment Method</button>
      )}
    </div>
  );
}

function SecurityPanel() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
      <div className="mt-6 space-y-4">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowChangePassword((v) => !v)}
        >
          Change Password
        </button>
        {showChangePassword && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-sm mx-auto text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowChangePassword(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        )}
        <div className="block">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Two-Factor Authentication
          </button>
        </div>
      </div>
    </div>
  );
} 