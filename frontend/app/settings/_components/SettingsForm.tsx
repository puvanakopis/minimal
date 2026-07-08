"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";

export function SettingsForm() {
    // Password Form State
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] =
        useState<"idle" | "success" | "error">("idle");

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateStatus("idle");

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsUpdating(false);
        setUpdateStatus("success");
        setTimeout(() => setUpdateStatus("idle"), 3000);
    };

    const handleDelete = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert("Account deleted (mock action)");
    };

    return (
        <div className="flex flex-col gap-16">
            {/* Header */}
            <header className="space-y-4" >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <span className="w-8 h-[1px] bg-brand-teal" />
                    <span className="text-[11px] uppercase tracking-[0.4em] text-brand-teal font-bold">
                        Account Preferences
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
                        Settings
                    </span>
                </motion.h1>
            </header>

            <div className="flex flex-col gap-24">
                {/* Security Section */}
                <section className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <KeyRound className="w-5 h-5 text-zinc-400" />
                        <h2 className="font-serif text-2xl text-zinc-900">
                            Security
                        </h2>
                    </motion.div>

                    <form
                        onSubmit={handlePasswordUpdate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-2xl"
                    >
                        {/* Current Password */}
                        <div className="flex flex-col gap-3 md:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Current Password
                            </label>
                            <div className="relative border-b border-zinc-200 focus-within:border-brand-teal transition-colors duration-300">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            current: e.target.value,
                                        })
                                    }
                                    className="w-full bg-transparent border-none py-3 font-serif text-xl outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(!showCurrent)
                                    }
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-teal transition-colors"
                                >
                                    {showCurrent ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                New Password
                            </label>
                            <div className="relative border-b border-zinc-200 focus-within:border-brand-teal transition-colors duration-300">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwords.new}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            new: e.target.value,
                                        })
                                    }
                                    className="w-full bg-transparent border-none py-3 font-serif text-xl outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-teal transition-colors"
                                >
                                    {showNew ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Confirm New Password
                            </label>
                            <div className="relative border-b border-zinc-200 focus-within:border-brand-teal transition-colors duration-300">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={passwords.confirm}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            confirm: e.target.value,
                                        })
                                    }
                                    className="w-full bg-transparent border-none py-3 font-serif text-xl outline-none"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4 flex items-center gap-8">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className={`px-12 py-5 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 ${updateStatus === "success"
                                        ? "bg-zinc-900 text-white"
                                        : "bg-brand-teal text-white hover:bg-zinc-900"
                                    } disabled:opacity-70 shadow-lg shadow-brand-teal/20`}
                            >
                                {isUpdating
                                    ? "UPDATING..."
                                    : updateStatus === "success"
                                        ? "UPDATED"
                                        : "Update Password"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="space-y-8 border-t border-zinc-100">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex items-center gap-4"
                    >
                        <Trash2 className="w-5 h-5 text-zinc-400" />
                        <h2 className="font-serif text-2xl text-zinc-900">
                            Danger Zone
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="max-w-2xl space-y-10"
                    >
                        <div className="space-y-4">
                            <p className="text-zinc-500 font-serif text-lg leading-relaxed">
                                Permanently delete your account and all
                                associated data. This action cannot be undone.
                            </p>

                            <div className="flex items-center gap-3 text-zinc-400">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">
                                    irreversible action
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDelete}
                            className="px-12 py-5 font-bold uppercase tracking-[0.3em] text-[11px] bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-900/10"
                        >
                            Delete Account
                        </button>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}