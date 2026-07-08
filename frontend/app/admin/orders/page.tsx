'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/lib/db';
import AdminLoading from '../loading';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Orders</h1>
        <p className="text-xs text-gray-500 mt-1">Review purchases, update fulfillment status, and inspect items</p>
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-off-white">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 w-10"></th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Order ID</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Customer</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Date</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Total</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <>
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-off-white/30 transition-all duration-150">
                      <td className="p-4">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-gray-400 hover:text-[#1a1a1a] cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-xs text-[#1a1a1a]">{order.id}</td>
                      <td className="p-4">
                        <div className="text-xs font-bold text-[#1a1a1a]">{order.customerName}</div>
                        <div className="text-[10px] text-gray-400">{order.email}</div>
                      </td>
                      <td className="p-4 text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-xs font-bold text-[#1a1a1a]">${order.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-off-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a] outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-details`} className="bg-off-white/40 border-b border-gray-100">
                        <td colSpan={7} className="p-6">
                          <div className="space-y-4 max-w-2xl">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Order Contents</h4>
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                              {order.products.map((p) => (
                                <div key={p.productId} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 text-xs">
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-[#1a1a1a]">{p.name}</span>
                                    <span className="block text-[10px] text-gray-400">Product ID: {p.productId}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-gray-500 font-medium">Qty {p.quantity}</span>
                                    <span className="block font-bold text-[#1a1a1a]">${(p.price * p.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
