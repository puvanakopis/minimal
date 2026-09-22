'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  Truck,
  CreditCard,
  Calendar,
  DollarSign,
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  ShoppingBag,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { Order, OrderItem } from '@/interfaces';
import { orderService } from '@/services';
import { getImageUrl } from '@/helper/image';
import { notify } from '@/helper/toast';
import AdminLoading from '../loading';

const ORDER_STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUS_OPTIONS = ['PAID', 'PENDING', 'REFUNDED', 'FAILED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  // Modal States
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editOrderStatus, setEditOrderStatus] = useState<string>('Processing');
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('PAID');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await orderService.adminGetOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        notify.error(res.message || 'Failed to fetch orders');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch orders';
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderNum = (order.orderNumber || String(order.id)).toLowerCase();
      const customerName = (order.fullName || order.customerName || order.shippingAddress?.fullName || '').toLowerCase();
      const customerEmail = (order.customerEmail || order.email || order.guestEmail || '').toLowerCase();
      const phone = (order.phoneNumber || '').toLowerCase();
      const city = (order.city || '').toLowerCase();
      const productNames = (order.items || order.products || [])
        .map((i) => i.name)
        .join(' ')
        .toLowerCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        orderNum.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        phone.includes(query) ||
        city.includes(query) ||
        productNames.includes(query);

      const currentStatus = (order.orderStatus || order.status || 'Processing').toLowerCase();
      const matchesStatus =
        statusFilter === 'all' || currentStatus === statusFilter.toLowerCase();

      const currentPayment = (order.paymentStatus || 'PENDING').toLowerCase();
      const matchesPayment =
        paymentFilter === 'all' || currentPayment === paymentFilter.toLowerCase();

      const currentMethod = (order.paymentMethod || 'CARD').toLowerCase();
      const matchesMethod =
        paymentMethodFilter === 'all' || currentMethod === paymentMethodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter, paymentMethodFilter]);

  // Key Metrics
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    let totalRevenue = 0;
    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;

    orders.forEach((o) => {
      const amt = o.totalAmount ?? o.total ?? 0;
      totalRevenue += amt;
      const st = (o.orderStatus || o.status || 'Processing').toLowerCase();
      if (st === 'processing') processingCount++;
      else if (st === 'shipped') shippedCount++;
      else if (st === 'delivered') deliveredCount++;
    });

    return { totalCount, totalRevenue, processingCount, shippedCount, deliveredCount };
  }, [orders]);

  const handleOpenViewModal = (order: Order) => {
    setViewingOrder(order);
  };

  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setEditOrderStatus(order.orderStatus || order.status || 'Processing');
    setEditPaymentStatus(order.paymentStatus || 'PAID');
  };

  const handleSaveStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingOrder) return;

    setSubmittingStatus(true);
    try {
      const res = await orderService.adminUpdateOrderStatus(editingOrder.id, {
        orderStatus: editOrderStatus,
        paymentStatus: editPaymentStatus,
      });

      if (res.success && res.data) {
        notify.success(`Order #${res.data.orderNumber || res.data.id} status updated`);
        setOrders((prev) =>
          prev.map((o) => (o.id === editingOrder.id ? { ...o, ...res.data } : o))
        );
        if (viewingOrder && viewingOrder.id === editingOrder.id) {
          setViewingOrder({ ...viewingOrder, ...res.data });
        }
        setEditingOrder(null);
      } else {
        notify.error(res.message || 'Failed to update order status');
      }
    } catch (err: unknown) {
      notify.apiError(err, 'Failed to update order status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    const orderRef = order.orderNumber || `#${order.id}`;

    try {
      const res = await orderService.adminDeleteOrder(order.id);
      if (res.success) {
        notify.success(`Order ${orderRef} deleted successfully`);
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        if (viewingOrder?.id === order.id) setViewingOrder(null);
      } else {
        notify.error(res.message || 'Failed to delete order');
      }
    } catch (err: unknown) {
      notify.apiError(err, 'Failed to delete order');
    }
  };

  const getOrderStatusBadge = (status?: string) => {
    const s = (status || 'Processing').toLowerCase();
    switch (s) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'shipped':
        return 'bg-sky-50 text-sky-700 border border-sky-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'processing':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    }
  };

  const getPaymentStatusBadge = (status?: string) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'REFUNDED':
        return 'bg-purple-50 text-purple-700 border border-purple-200/60';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Order Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review customer orders, update fulfillment statuses, track payments, and inspect item details
          </p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Orders</span>
            <div className="size-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.totalCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">All customer orders</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Revenue</span>
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">
            Rs. {metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Gross order value</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">In Processing</span>
            <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Package size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.processingCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting fulfillment</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Delivered</span>
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.deliveredCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Successfully fulfilled</div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-[#e7f1f3] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, email, phone, city, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
          />
        </div>
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter orders by fulfillment status"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter orders by payment status"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            aria-label="Filter orders by payment method"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Methods</option>
            <option value="CARD">Card</option>
            <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-[#fbfdfe]">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Order</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Customer</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Date</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Payment</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Total</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-xs">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsList = order.items || order.products || [];
                  const totalItemsCount = itemsList.reduce((acc, item) => acc + (item.quantity || 1), 0);
                  const firstItem = itemsList[0];
                  const formattedTotal = (order.totalAmount ?? order.total ?? 0).toFixed(2);
                  const orderDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A');

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-[#fcfefe] transition-all duration-150"
                    >
                      {/* ORDER INFO & THUMBNAIL */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-200/80 shrink-0 flex items-center justify-center">
                            {firstItem?.image ? (
                              <img
                                src={getImageUrl(firstItem.image)}
                                alt={firstItem.name || 'Order Item'}
                                className="object-cover size-full"
                              />
                            ) : (
                              <Package size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold font-mono text-[#1a1a1a] block">
                              #{order.orderNumber || order.id}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="p-4">
                        <div>
                          <span className="text-xs font-bold text-[#1a1a1a] block line-clamp-1">
                            {order.fullName || order.customerName || order.shippingAddress?.fullName || 'Customer'}
                          </span>
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[180px]">
                            {order.customerEmail || order.email || order.guestEmail || order.phoneNumber || 'N/A'}
                          </div>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-4">
                        <span className="text-xs font-medium text-gray-600 block whitespace-nowrap">
                          {orderDate}
                        </span>
                      </td>

                      {/* PAYMENT */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-gray-700 block">
                            {order.paymentMethod === 'CARD' ? 'Card' : 'Cash on Delivery'}
                          </span>
                          <span
                            className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${getPaymentStatusBadge(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus || 'PENDING'}
                          </span>
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td className="p-4">
                        <span className="text-xs font-bold text-[#1a1a1a]">
                          Rs. {formattedTotal}
                        </span>
                      </td>

                      {/* ORDER STATUS */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${getOrderStatusBadge(
                            order.orderStatus || order.status
                          )}`}
                        >
                          {order.orderStatus || order.status || 'Processing'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* VIEW ORDER BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(order)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-colors cursor-pointer"
                            title="Inspect Order"
                          >
                            <Eye size={14} />
                          </button>

                          {/* EDIT ORDER STATUS BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(order)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-colors cursor-pointer"
                            title="Update Status"
                          >
                            <Edit size={14} />
                          </button>

                          {/* DELETE ORDER BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW ORDER INSPECTION MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-gray-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                  Order Inspection
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2 mt-0.5">
                  <span>Order #{viewingOrder.orderNumber || viewingOrder.id}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${getOrderStatusBadge(
                      viewingOrder.orderStatus || viewingOrder.status
                    )}`}
                  >
                    {viewingOrder.orderStatus || viewingOrder.status || 'Processing'}
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                aria-label="Close modal"
                className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* QUICK STATS SUMMARY BANNER */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Date</span>
                <span className="font-semibold text-gray-800">
                  {viewingOrder.date || (viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleDateString() : 'Recent')}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Payment Method</span>
                <span className="font-semibold text-gray-800">
                  {viewingOrder.paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Payment Status</span>
                <span
                  className={`inline-block text-[9px] uppercase font-extrabold px-2 py-0.2 rounded-full mt-0.5 ${getPaymentStatusBadge(
                    viewingOrder.paymentStatus
                  )}`}
                >
                  {viewingOrder.paymentStatus || 'PENDING'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Total Amount</span>
                <span className="text-sm font-bold text-brand-teal">
                  Rs. {(viewingOrder.totalAmount ?? viewingOrder.total ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* DETAILS GRID: CUSTOMER INFO & ITEMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CUSTOMER & SHIPPING INFO */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Shipping & Customer Info
                </h4>
                <div className="p-4 bg-[#fbfdfe] rounded-xl border border-[#e7f1f3] space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <UserIcon size={15} className="text-brand-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Recipient Name</span>
                      <span className="font-bold text-[#1a1a1a]">
                        {viewingOrder.fullName || viewingOrder.customerName || viewingOrder.shippingAddress?.fullName || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail size={15} className="text-brand-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Email Address</span>
                      <span className="text-gray-700">
                        {viewingOrder.customerEmail || viewingOrder.email || viewingOrder.guestEmail || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone size={15} className="text-brand-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Phone Number</span>
                      <span className="text-gray-700">
                        {viewingOrder.phoneNumber || viewingOrder.shippingAddress?.phone || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-brand-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Delivery Address</span>
                      <span className="text-gray-700 block">
                        {viewingOrder.streetAddress || viewingOrder.shippingAddress?.streetAddress || 'N/A'}
                      </span>
                      <span className="text-gray-500 text-[11px] block mt-0.5">
                        {[
                          viewingOrder.city || viewingOrder.shippingAddress?.city,
                          viewingOrder.district,
                          viewingOrder.postalCode || viewingOrder.shippingAddress?.postalCode,
                          viewingOrder.country || viewingOrder.shippingAddress?.country || 'Sri Lanka',
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUICK STATUS UPDATE FROM MODAL */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = viewingOrder;
                      setViewingOrder(null);
                      handleOpenEditModal(cur);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Edit size={14} />
                    <span>Update Order or Payment Status</span>
                  </button>
                </div>
              </div>

              {/* ORDER ITEMS & BREAKDOWN */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Purchased Items ({(viewingOrder.items || viewingOrder.products || []).length})
                </h4>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {(viewingOrder.items || viewingOrder.products || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="size-12 rounded-lg bg-gray-200 overflow-hidden relative shrink-0 border border-gray-200">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="object-cover size-full"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#1a1a1a] block truncate">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                          {item.size && <span>Size: <strong className="text-gray-600">{item.size}</strong></span>}
                          {item.color && <span>Color: <strong className="text-gray-600">{item.color}</strong></span>}
                          <span>Qty: <strong className="text-gray-600">{item.quantity}</strong></span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#1a1a1a] block">
                          Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          Rs. {(item.price || 0).toFixed(2)} ea
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FINANCIAL TOTAL BREAKDOWN */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs. {(viewingOrder.subtotal || viewingOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Cost</span>
                    <span>Rs. {(viewingOrder.shippingCost || 0).toFixed(2)}</span>
                  </div>
                  {viewingOrder.tax !== undefined && viewingOrder.tax > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Tax</span>
                      <span>Rs. {(viewingOrder.tax || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#1a1a1a] pt-2 border-t border-gray-200">
                    <span>Grand Total</span>
                    <span className="text-brand-teal">
                      Rs. {(viewingOrder.totalAmount ?? viewingOrder.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ORDER STATUS MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in duration-200 space-y-6">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                  Order Status Management
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mt-0.5">
                  Update #{editingOrder.orderNumber || editingOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                aria-label="Close modal"
                className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSaveStatus} className="space-y-4">
              {/* Order Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Fulfillment Status</label>
                <select
                  value={editOrderStatus}
                  onChange={(e) => setEditOrderStatus(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400">
                  Controls order workflow stage visible to customer in order tracking.
                </p>
              </div>

              {/* Payment Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400">
                  Update payment verification state (e.g. for Cash on Delivery collection).
                </p>
              </div>

              {/* Customer summary */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-1">
                <div>
                  Customer: <strong>{editingOrder.fullName || editingOrder.customerName || 'N/A'}</strong>
                </div>
                <div>
                  Total: <strong>Rs. {(editingOrder.totalAmount ?? editingOrder.total ?? 0).toFixed(2)}</strong> ({editingOrder.paymentMethod || 'CARD'})
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStatus}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingStatus ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
