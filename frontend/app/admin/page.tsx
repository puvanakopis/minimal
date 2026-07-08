'use client';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, ShoppingCart, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import AdminLoading from './loading';

interface Metrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface ChartData {
  name: string;
  sales: number;
  orders: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setRecentOrders(data.recentOrders);
          setChartData(data.chartData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <AdminLoading />;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${metrics?.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Products Stocked',
      value: metrics?.totalProducts,
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Active Customers',
      value: metrics?.totalUsers,
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Overview Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time performance metrics and sales statistics</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-2xl border border-[#e7f1f3] flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{card.title}</span>
                <h3 className="text-2xl font-bold text-[#1a1a1a]">{card.value}</h3>
              </div>
              <div className={`size-12 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS & RECENT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* SALES CHART */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] xl:col-span-7 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Sales Performance</h3>
            <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-black tracking-widest uppercase">LAST 6 MONTHS</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
            {chartData.map((data) => {
              const maxSales = Math.max(...chartData.map((d) => d.sales), 100);
              const pct = (data.sales / maxSales) * 100;
              return (
                <div key={data.name} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative bg-off-white rounded-t-lg h-48 flex items-end overflow-hidden border border-gray-100">
                    <div
                      style={{ height: `${pct}%` }}
                      className="w-full bg-brand-teal group-hover:bg-brand-teal/90 rounded-t-lg transition-all duration-500 relative"
                    >
                      {/* Tooltip */}
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-bold">
                        ${data.sales.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{data.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white p-6 rounded-2xl border border-[#e7f1f3] xl:col-span-5 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-[10px] font-bold uppercase tracking-wider text-brand-teal hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No recent orders found</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-off-white transition-all duration-200">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-[#1a1a1a]">{order.customerName}</h5>
                    <p className="text-[10px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-bold text-[#1a1a1a]">${order.totalAmount.toFixed(2)}</span>
                    <div>
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
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
