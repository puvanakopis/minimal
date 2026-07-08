"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface OrderProduct {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
    total: number;
    items: OrderProduct[];
}

const mockOrders: Order[] = [
    {
        id: "ORD-7291",
        date: "May 12, 2026",
        status: "Delivered",
        total: 745.0,
        items: [
            {
                id: "1",
                name: "Structured Wool Overcoat",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE",
                quantity: 1,
                price: 450.0,
            },
            {
                id: "2",
                name: "Signature Cashmere Knit",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE",
                quantity: 1,
                price: 295.0,
            },
        ],
    },
    {
        id: "ORD-8823",
        date: "April 28, 2026",
        status: "Processing",
        total: 65.0,
        items: [
            {
                id: "3",
                name: "Pima Cotton Capsule Tee",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b",
                quantity: 1,
                price: 65.0,
            },
        ],
    },
];

export function OrderList() {
    return (
        <div className="flex flex-col gap-16">
            {/* Header (UPDATED to match ProfileForm style) */}
            <header className="space-y-4">
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
                    className="text-5xl md:text-4xl font-serif leading-tight text-zinc-900"
                >
                    My{" "}
                    <span className="italic font-normal text-brand-teal">
                        Orders
                    </span>
                </motion.h1>
            </header>

            {/* Orders List */}
            <div className="space-y-8">
                {mockOrders.map((order, idx) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                        className="bg-white border border-[#e7f1f3] rounded-lg overflow-hidden"
                    >
                        {/* Order Header */}
                        <div className="bg-[#f6f8f8] px-8 py-4 border-b border-[#e7f1f3] flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Order Date
                                    </p>
                                    <p className="text-[12px] text-primary">
                                        {order.date}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Total Amount
                                    </p>
                                    <p className="text-[12px] text-primary">
                                        ${order.total.toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                        Status
                                    </p>
                                    <span
                                        className="text-[12px] text-primary">

                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                                    Order ID
                                </p>
                                <p className="text-[12px] text-primary">
                                    #{order.id}
                                </p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="p-8 space-y-6">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-6 items-center"
                                >
                                    <div className="w-20 h-24 relative bg-zinc-100 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-serif text-zinc-900 mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-[#e7f1f3] flex justify-end gap-4 bg-white">
                            <button className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                                Order Details
                            </button>
                            <button className="text-xs text-primary hover:text-[#1499b4] transition-colors uppercase tracking-widest font-bold">
                                Invoice
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}