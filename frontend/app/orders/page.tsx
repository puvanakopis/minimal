"use client";

import { Sidebar } from "@/components/Sidebar";
import { OrderList } from "./_components/OrderList";
import { motion } from "framer-motion";

export default function OrdersPage() {
    return (
        <main className="max-w-7xl mx-auto flex min-h-screen bg-off-white">
            <Sidebar />

            <section className="flex-1 py-12 md:py-20 px-6 md:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <OrderList />
                </motion.div>
            </section>
        </main>
    );
}
