'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Package,
  Layers,
  Shield,
  MailCheck,
  TrendingUp,
  CreditCard,
  Truck,
  Ban,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  Tag,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Product, Order, User } from '@/interfaces';
import { productService, orderService, userService } from '@/services';
import { getImageUrl } from '@/helper/image';
import { notify } from '@/helper/toast';
import AdminLoading from './loading';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      const [prodRes, ordRes, userRes] = await Promise.allSettled([
        productService.adminGetProducts(),
        orderService.adminGetOrders(),
        userService.adminGetUsers(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.success && prodRes.value.data) {
        setProducts(prodRes.value.data);
      }
      if (ordRes.status === 'fulfilled' && ordRes.value.success && ordRes.value.data) {
        setOrders(ordRes.value.data);
      }
      if (userRes.status === 'fulfilled' && userRes.value.success && userRes.value.data) {
        setUsers(userRes.value.data);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load dashboard stats';
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ==========================================
  // METRICS COMPUTATION
  // ==========================================

  // Order & Financial Analytics
  const orderAnalytics = useMemo(() => {
    const totalOrders = orders.length;
    let totalRevenue = 0;
    let paidRevenue = 0;
    let pendingRevenue = 0;

    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    let cardPaymentCount = 0;
    let codPaymentCount = 0;

    orders.forEach((o) => {
      const amount = o.totalAmount ?? o.total ?? 0;
      totalRevenue += amount;

      const payStatus = (o.paymentStatus || 'PENDING').toUpperCase();
      if (payStatus === 'PAID') {
        paidRevenue += amount;
      } else if (payStatus === 'PENDING') {
        pendingRevenue += amount;
      }

      const ordStatus = (o.orderStatus || o.status || 'Processing').toLowerCase();
      if (ordStatus === 'processing') processingCount++;
      else if (ordStatus === 'shipped') shippedCount++;
      else if (ordStatus === 'delivered') deliveredCount++;
      else if (ordStatus === 'cancelled') cancelledCount++;

      const method = (o.paymentMethod || 'CARD').toUpperCase();
      if (method === 'CARD') cardPaymentCount++;
      else codPaymentCount++;
    });

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const fulfillmentRate = totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(1) : '0';

    return {
      totalOrders,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      cardPaymentCount,
      codPaymentCount,
      averageOrderValue,
      fulfillmentRate,
    };
  }, [orders]);

  // Product Catalog Analytics
  const productAnalytics = useMemo(() => {
    const totalProducts = products.length;
    let menCount = 0;
    let womenCount = 0;
    let unisexCount = 0;
    const categoryMap: Record<string, number> = {};
    let totalPrice = 0;

    products.forEach((p) => {
      const g = (p.gender || 'unisex').toLowerCase();
      if (g === 'men') menCount++;
      else if (g === 'women') womenCount++;
      else unisexCount++;

      const cat = p.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      totalPrice += p.price || 0;
    });

    const categoriesArray = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const avgPrice = totalProducts > 0 ? totalPrice / totalProducts : 0;

    return {
      totalProducts,
      menCount,
      womenCount,
      unisexCount,
      categoriesArray,
      categoryCount: categoriesArray.length,
      avgPrice,
    };
  }, [products]);

  // User Management Analytics
  const userAnalytics = useMemo(() => {
    const totalUsers = users.length;
    let activeUsers = 0;
    let blockedUsers = 0;
    let deletedUsers = 0;
    let adminUsers = 0;
    let verifiedUsers = 0;

    users.forEach((u) => {
      if (u.deleted) deletedUsers++;
      else if (u.blocked) blockedUsers++;
      else activeUsers++;

      if (u.role?.toLowerCase() === 'admin') adminUsers++;
      if (u.emailVerified) verifiedUsers++;
    });

    const verificationRate = totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(0) : '0';

    return {
      totalUsers,
      activeUsers,
      blockedUsers,
      deletedUsers,
      adminUsers,
      verifiedUsers,
      verificationRate,
    };
  }, [users]);

  // Dynamic Monthly Sales Chart Data (Last 6 Months)
  const monthlyChartData = useMemo(() => {
    const months: { [key: string]: { name: string; sales: number; orders: number; monthKey: string } } = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
      months[key] = { name: monthName, sales: 0, orders: 0, monthKey: key };
    }

    orders.forEach((o) => {
      const dateStr = o.createdAt || o.date;
      if (!dateStr) return;
      const orderDate = new Date(dateStr);
      if (isNaN(orderDate.getTime())) return;
      const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        const amt = o.totalAmount ?? o.total ?? 0;
        months[key].sales += amt;
        months[key].orders += 1;
      }
    });

    return Object.values(months);
  }, [orders]);

  const maxChartSales = useMemo(() => {
    const max = Math.max(...monthlyChartData.map((d) => d.sales), 0);
    return max > 0 ? max : 100;
  }, [monthlyChartData]);

  // Recent 5 Orders
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0).getTime();
        const dateB = new Date(b.createdAt || b.date || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  // Recent 4 Users
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [users]);

  // Order status badge styling
  const getOrderStatusBadge = (status?: string) => {
    const s = (status || 'Processing').toLowerCase();
    switch (s) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'shipped':
        return 'bg-sky-50 text-sky-700 border-sky-200/70';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200/70';
      case 'processing':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200/70';
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* ========================================== */}
      {/* DASHBOARD HEADER */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
            Executive Summary
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Overview Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time live performance across Products, Orders, and User Management
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* TOP 4 KEY PERFORMANCE INDICATORS */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* REVENUE CARD */}
        <div className="bg-white p-5 rounded-2xl border border-[#e7f1f3] shadow-xs relative overflow-hidden group hover:border-emerald-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Revenue</span>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#1a1a1a]">
              Rs. {orderAnalytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
              <span className="text-emerald-600 font-semibold">
                Rs. {orderAnalytics.paidRevenue.toFixed(0)} paid
              </span>
              <span>•</span>
              <span className="text-amber-600 font-medium">
                Rs. {orderAnalytics.pendingRevenue.toFixed(0)} pending
              </span>
            </div>
          </div>
        </div>

        {/* ORDERS CARD */}
        <div className="bg-white p-5 rounded-2xl border border-[#e7f1f3] shadow-xs relative overflow-hidden group hover:border-sky-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Orders</span>
            <div className="size-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#1a1a1a]">{orderAnalytics.totalOrders}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
              <span className="text-amber-600 font-semibold">{orderAnalytics.processingCount} in process</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">{orderAnalytics.deliveredCount} delivered</span>
            </div>
          </div>
        </div>

        {/* PRODUCTS CARD */}
        <div className="bg-white p-5 rounded-2xl border border-[#e7f1f3] shadow-xs relative overflow-hidden group hover:border-amber-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Products Stocked</span>
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#1a1a1a]">{productAnalytics.totalProducts}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
              <span className="text-sky-600 font-medium">{productAnalytics.menCount} Men</span>
              <span>•</span>
              <span className="text-rose-600 font-medium">{productAnalytics.womenCount} Women</span>
              <span>•</span>
              <span className="text-gray-500 font-medium">{productAnalytics.categoryCount} Categories</span>
            </div>
          </div>
        </div>

        {/* ACTIVE USERS CARD */}
        <div className="bg-white p-5 rounded-2xl border border-[#e7f1f3] shadow-xs relative overflow-hidden group hover:border-purple-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Registered Users</span>
            <div className="size-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#1a1a1a]">{userAnalytics.totalUsers}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
              <span className="text-emerald-600 font-semibold">{userAnalytics.activeUsers} active</span>
              <span>•</span>
              <span className="text-sky-600 font-medium">{userAnalytics.verificationRate}% verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* REVENUE PERFORMANCE CHART & FULFILLMENT MATRIX */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SALES & REVENUE MONTHLY BAR CHART */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] xl:col-span-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                Revenue & Sales Trajectory
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Monthly Sales Breakdown</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-brand-teal inline-block" /> Gross Revenue
              </span>
              <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-black tracking-widest uppercase">
                LAST 6 MONTHS
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 sm:px-6">
            {monthlyChartData.map((data) => {
              const pct = maxChartSales > 0 ? (data.sales / maxChartSales) * 100 : 0;
              const barHeight = Math.max(pct, data.sales > 0 ? 8 : 3);

              return (
                <div key={data.name} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative bg-gray-50 rounded-t-xl h-48 flex items-end overflow-visible border border-gray-100/80">
                    <div
                      style={{ height: `${barHeight}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 relative flex items-center justify-center ${
                        data.sales > 0
                          ? 'bg-brand-teal group-hover:bg-brand-teal/90 shadow-xs'
                          : 'bg-gray-200'
                      }`}
                    >
                      {/* Interactive Tooltip on Hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 font-sans text-center">
                        <div className="font-bold">Rs. {data.sales.toFixed(2)}</div>
                        <div className="text-[9px] text-gray-300 font-normal">
                          {data.orders} {data.orders === 1 ? 'order' : 'orders'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {data.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary Strip below Chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Average Order Value</span>
              <div className="font-bold text-[#1a1a1a]">Rs. {orderAnalytics.averageOrderValue.toFixed(2)}</div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Fulfillment Rate</span>
              <div className="font-bold text-emerald-600">{orderAnalytics.fulfillmentRate}% Complete</div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Card Payments</span>
              <div className="font-bold text-gray-800">
                {orderAnalytics.cardPaymentCount} orders ({orderAnalytics.totalOrders > 0 ? Math.round((orderAnalytics.cardPaymentCount / orderAnalytics.totalOrders) * 100) : 0}%)
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cash on Delivery</span>
              <div className="font-bold text-gray-800">
                {orderAnalytics.codPaymentCount} orders ({orderAnalytics.totalOrders > 0 ? Math.round((orderAnalytics.codPaymentCount / orderAnalytics.totalOrders) * 100) : 0}%)
              </div>
            </div>
          </div>
        </div>

        {/* ORDER FULFILLMENT & PAYMENT PIPELINE */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] xl:col-span-4 space-y-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                  Workflow Pipeline
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Order Statuses</h3>
              </div>
              <Link
                href="/admin/orders"
                className="text-[10px] font-bold uppercase tracking-wider text-brand-teal hover:underline flex items-center gap-1"
              >
                Orders <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Status Breakdown Bars */}
            <div className="space-y-4 pt-4">
              {/* Processing */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-amber-700 flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-500" /> In Processing
                  </span>
                  <span className="font-bold text-gray-800">
                    {orderAnalytics.processingCount} / {orderAnalytics.totalOrders}
                  </span>
                </div>
                <div className="w-full h-2 bg-amber-50 rounded-full overflow-hidden border border-amber-100">
                  <div
                    style={{
                      width: `${orderAnalytics.totalOrders > 0 ? (orderAnalytics.processingCount / orderAnalytics.totalOrders) * 100 : 0}%`,
                    }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Shipped */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-sky-700 flex items-center gap-1.5">
                    <Truck size={13} className="text-sky-500" /> Out for Delivery / Shipped
                  </span>
                  <span className="font-bold text-gray-800">
                    {orderAnalytics.shippedCount} / {orderAnalytics.totalOrders}
                  </span>
                </div>
                <div className="w-full h-2 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                  <div
                    style={{
                      width: `${orderAnalytics.totalOrders > 0 ? (orderAnalytics.shippedCount / orderAnalytics.totalOrders) * 100 : 0}%`,
                    }}
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Delivered */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" /> Delivered
                  </span>
                  <span className="font-bold text-gray-800">
                    {orderAnalytics.deliveredCount} / {orderAnalytics.totalOrders}
                  </span>
                </div>
                <div className="w-full h-2 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                  <div
                    style={{
                      width: `${orderAnalytics.totalOrders > 0 ? (orderAnalytics.deliveredCount / orderAnalytics.totalOrders) * 100 : 0}%`,
                    }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Cancelled */}
              {orderAnalytics.cancelledCount > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-rose-700 flex items-center gap-1.5">
                      <AlertCircle size={13} className="text-rose-500" /> Cancelled
                    </span>
                    <span className="font-bold text-gray-800">
                      {orderAnalytics.cancelledCount} / {orderAnalytics.totalOrders}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-rose-50 rounded-full overflow-hidden border border-rose-100">
                    <div
                      style={{
                        width: `${(orderAnalytics.cancelledCount / orderAnalytics.totalOrders) * 100}%`,
                      }}
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Status Summary Box */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
              Payment Verification Ratio
            </span>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Settled (Paid)</span>
              <span className="font-bold text-emerald-600">
                Rs. {orderAnalytics.paidRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Awaiting Payment</span>
              <span className="font-bold text-amber-600">
                Rs. {orderAnalytics.pendingRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3-COLUMN DEEP DIVE: PRODUCTS, USERS, SHORTCUTS */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 1. PRODUCT CATALOG DISTRIBUTION */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                Catalog Inventory
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Category Share</h3>
            </div>
            <Link
              href="/admin/products"
              className="text-[10px] font-bold uppercase tracking-wider text-brand-teal hover:underline flex items-center gap-1"
            >
              Catalog <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            {productAnalytics.categoriesArray.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No categories found</p>
            ) : (
              productAnalytics.categoriesArray.slice(0, 5).map((cat) => {
                const pct = productAnalytics.totalProducts > 0
                  ? Math.round((cat.count / productAnalytics.totalProducts) * 100)
                  : 0;

                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="text-gray-500 font-semibold">{cat.count} items ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-brand-teal rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Gender Split Banner */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Men ({productAnalytics.menCount})</span>
              <span>Women ({productAnalytics.womenCount})</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
              <div
                style={{
                  width: `${
                    productAnalytics.totalProducts > 0
                      ? (productAnalytics.menCount / productAnalytics.totalProducts) * 100
                      : 50
                  }%`,
                }}
                className="bg-sky-500 h-full"
                title="Men's collection"
              />
              <div
                style={{
                  width: `${
                    productAnalytics.totalProducts > 0
                      ? (productAnalytics.womenCount / productAnalytics.totalProducts) * 100
                      : 50
                  }%`,
                }}
                className="bg-rose-400 h-full"
                title="Women's collection"
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-2 text-right">
              Avg. Catalog Price: <strong className="text-gray-700">Rs. {productAnalytics.avgPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* 2. USER BASE & HEALTH INDICATORS */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                Customer Community
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">User Accounts</h3>
            </div>
            <Link
              href="/admin/users"
              className="text-[10px] font-bold uppercase tracking-wider text-brand-teal hover:underline flex items-center gap-1"
            >
              Users <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* User Account Health Badges */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                Active Users
              </span>
              <span className="text-lg font-bold text-emerald-800 mt-0.5 block">
                {userAnalytics.activeUsers}
              </span>
              <span className="text-[10px] text-emerald-600">Full login privileges</span>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 block">
                Admins
              </span>
              <span className="text-lg font-bold text-indigo-800 mt-0.5 block">
                {userAnalytics.adminUsers}
              </span>
              <span className="text-[10px] text-indigo-600">Dashboard managers</span>
            </div>

            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 block">
                Verified Emails
              </span>
              <span className="text-lg font-bold text-sky-800 mt-0.5 block">
                {userAnalytics.verifiedUsers}
              </span>
              <span className="text-[10px] text-sky-600">{userAnalytics.verificationRate}% of members</span>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block">
                Restricted / Blocked
              </span>
              <span className="text-lg font-bold text-rose-800 mt-0.5 block">
                {userAnalytics.blockedUsers + userAnalytics.deletedUsers}
              </span>
              <span className="text-[10px] text-rose-600">
                {userAnalytics.blockedUsers} blocked • {userAnalytics.deletedUsers} deleted
              </span>
            </div>
          </div>

          {/* Latest Registered Users Preview */}
          <div className="space-y-2 pt-1 border-t border-gray-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
              Recent Signups
            </span>
            <div className="space-y-2">
              {recentUsers.length === 0 ? (
                <p className="text-xs text-gray-400">No users registered yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-600 overflow-hidden border border-gray-200">
                        {u.avatar ? (
                          <img src={getImageUrl(u.avatar)} alt={u.firstName} className="size-full object-cover" />
                        ) : (
                          <span>{u.firstName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-gray-800 block truncate">
                          {u.firstName} {u.lastName}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate block">{u.email}</span>
                      </div>
                    </div>
                    {u.emailVerified ? (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. QUICK MANAGEMENT ACTION HUB */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] space-y-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-gray-100">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
                Operations
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Quick Actions</h3>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-brand-teal block">
                      Add New Product
                    </span>
                    <span className="text-[10px] text-gray-400">Upload images, sizes & pricing</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-brand-teal transition-all" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Package size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-sky-700 block">
                      Manage Orders ({orderAnalytics.processingCount} pending)
                    </span>
                    <span className="text-[10px] text-gray-400">Update status, tracking & payments</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700 block">
                      User Access & Permissions
                    </span>
                    <span className="text-[10px] text-gray-400">Inspect accounts, block or delete</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
              </Link>
            </div>
          </div>

          <div className="p-4 bg-[#f8fafb] rounded-xl border border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <Sparkles size={14} className="text-brand-teal" />
              <span>System Health Normal</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              All services connected to backend APIs with live real-time sync.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RECENT ORDERS FEED */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">
              Recent Transactions
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Latest Customer Orders</h3>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition-all cursor-pointer w-fit"
          >
            <span>View All Orders ({orderAnalytics.totalOrders})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-[#fbfdfe]">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Order</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Customer</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Date</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Payment</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const itemsList = order.items || order.products || [];
                  const totalItemsCount = itemsList.reduce((acc, item) => acc + (item.quantity || 1), 0);
                  const firstItem = itemsList[0];
                  const formattedTotal = (order.totalAmount ?? order.total ?? 0).toFixed(2);
                  const orderDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'Recent');

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-[#fcfefe] transition-all duration-150"
                    >
                      {/* ORDER NUMBER & THUMBNAIL */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0 flex items-center justify-center">
                            {firstItem?.image ? (
                              <img
                                src={getImageUrl(firstItem.image)}
                                alt={firstItem.name || 'Order Item'}
                                className="object-cover size-full"
                              />
                            ) : (
                              <Package size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold font-mono text-[#1a1a1a] block">
                              #{order.orderNumber || order.id}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="p-4">
                        <div>
                          <span className="text-xs font-bold text-[#1a1a1a] block truncate max-w-[150px]">
                            {order.fullName || order.customerName || order.shippingAddress?.fullName || 'Customer'}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate max-w-[150px]">
                            {order.customerEmail || order.email || order.guestEmail || order.phoneNumber || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                        {orderDate}
                      </td>

                      {/* PAYMENT */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-xs text-gray-700 block font-medium">
                            {order.paymentMethod === 'CARD' ? 'Card' : 'Cash on Delivery'}
                          </span>
                          <span
                            className={`inline-block text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.2 rounded-full ${
                              (order.paymentStatus || '').toUpperCase() === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {order.paymentStatus || 'PENDING'}
                          </span>
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="p-4">
                        <span className="text-xs font-bold text-[#1a1a1a]">
                          Rs. {formattedTotal}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${getOrderStatusBadge(
                            order.orderStatus || order.status
                          )}`}
                        >
                          {order.orderStatus || order.status || 'Processing'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:underline"
                        >
                          <span>Inspect</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

