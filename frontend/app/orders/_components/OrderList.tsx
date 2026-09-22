"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Order } from "@/interfaces";
import { orderService } from "@/services";
import { getImageUrl } from "@/helper/image";
import { useAuth } from "@/context";

export function OrderList() {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!isAuthenticated) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await orderService.getUserOrders();
                if (res.success && res.data) {
                    setOrders(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch user orders:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (!isAuthLoading) {
            fetchOrders();
        }
    }, [isAuthenticated, isAuthLoading]);

    if (isLoading || isAuthLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-[#4e8b97] font-semibold">Loading orders...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-white border border-[#e7f1f3] rounded-2xl p-12 text-center space-y-6 shadow-2xs">
                <div className="size-16 rounded-full bg-[#f6f8f8] border border-[#e7f1f3] flex items-center justify-center mx-auto text-brand-teal">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif italic text-zinc-900">Sign in to view your orders</h2>
                    <p className="text-xs text-[#4e8b97] uppercase tracking-wider">
                        Please log in to track your order history, delivery statuses, and invoices.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-teal hover:bg-[#1499b5] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white border border-[#e7f1f3] rounded-2xl p-12 text-center space-y-6 shadow-2xs">
                <div className="size-16 rounded-full bg-[#f6f8f8] border border-[#e7f1f3] flex items-center justify-center mx-auto text-brand-teal">
                    <span className="material-symbols-outlined text-3xl">receipt_long</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif italic text-zinc-900">No Orders Placed Yet</h2>
                    <p className="text-xs text-[#4e8b97] uppercase tracking-wider">
                        You haven&apos;t placed any orders yet. Discover our curated collections and place your first order.
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-teal hover:bg-[#1499b5] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "text-emerald-700 bg-emerald-50 border-emerald-200";
            case "shipped":
                return "text-sky-700 bg-sky-50 border-sky-200";
            case "cancelled":
                return "text-rose-700 bg-rose-50 border-rose-200";
            case "processing":
            default:
                return "text-amber-700 bg-amber-50 border-amber-200";
        }
    };

    return (
        <div className="flex flex-col gap-12">
            {/* Header */}
            <header className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <span className="w-8 h-[1px] bg-brand-teal" />
                    <span className="text-[11px] uppercase tracking-[0.4em] text-brand-teal font-bold">
                        Order History
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-serif leading-tight text-zinc-900"
                >
                    My{" "}
                    <span className="italic font-normal text-brand-teal">
                        Orders
                    </span>
                </motion.h1>
            </header>

            {/* Orders List */}
            <div className="space-y-8">
                {orders.map((order, idx) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="bg-white border border-[#e7f1f3] rounded-2xl overflow-hidden shadow-2xs hover:border-brand-teal/30 transition-all"
                    >
                        {/* Order Header */}
                        <div className="bg-[#f6f8f8] px-6 sm:px-8 py-5 border-b border-[#e7f1f3] flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-6 sm:gap-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                                        Order Date
                                    </p>
                                    <p className="text-xs font-semibold text-zinc-800">
                                        {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                                        Total Amount
                                    </p>
                                    <p className="text-xs font-bold text-zinc-900">
                                        Rs. {order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                                        Status
                                    </p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                                        Payment
                                    </p>
                                    <span className="text-xs text-zinc-700 font-medium uppercase tracking-wider">
                                        {order.paymentMethod === 'CARD' ? 'Card' : 'Cash on Delivery'} ({order.paymentStatus})
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                                    Order Number
                                </p>
                                <p className="text-xs font-bold text-brand-teal font-mono">
                                    #{order.orderNumber}
                                </p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="p-6 sm:p-8 divide-y divide-gray-100">
                            {order.items?.map((item, itemIdx) => (
                                <div
                                    key={item.id || itemIdx}
                                    className="py-4 first:pt-0 last:pb-0 flex gap-6 items-center"
                                >
                                    <div className="w-16 h-20 sm:w-20 sm:h-24 relative bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <Image
                                            src={getImageUrl(item.image || "")}
                                            alt={item.name}
                                            fill
                                            sizes="80px"
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        {item.productId ? (
                                            <Link href={`/products/${item.productId}`} className="hover:text-brand-teal transition-colors">
                                                <h3 className="font-serif italic text-base sm:text-lg text-zinc-900 font-medium">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                        ) : (
                                            <h3 className="font-serif italic text-base sm:text-lg text-zinc-900 font-medium">
                                                {item.name}
                                            </h3>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                            {item.size && <span className="font-medium text-brand-teal">Size: {item.size}</span>}
                                            {item.size && <span>•</span>}
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-zinc-900">
                                            Rs. {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-[11px] text-zinc-400">
                                            Rs. {item.price.toFixed(2)} each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping details info & Footer */}
                        <div className="px-6 sm:px-8 py-4 border-t border-[#e7f1f3] bg-[#fafcfc] flex flex-wrap justify-between items-center gap-4 text-xs">
                            <div className="text-zinc-600">
                                <span className="text-zinc-400 uppercase tracking-wider text-[10px] block font-bold">Delivered to:</span>
                                <span>{order.fullName} — {order.streetAddress}, {order.city} ({order.phoneNumber})</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/shop"
                                    className="text-xs text-brand-teal hover:underline uppercase tracking-widest font-bold"
                                >
                                    Reorder Products
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}