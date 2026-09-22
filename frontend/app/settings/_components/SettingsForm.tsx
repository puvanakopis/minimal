"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Eye, EyeOff, Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { notify } from "@/helper/toast";
import { userService } from "@/services";
import { useAuth } from "@/context";

export function SettingsForm() {
    const { logout } = useAuth();

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

    // Account Deletion State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwords.current) {
            notify.error("Please enter your current password.");
            return;
        }

        if (!passwords.new) {
            notify.error("Please enter a new password.");
            return;
        }

        if (passwords.new.length < 6) {
            notify.error("New password must be at least 6 characters long.");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            notify.error("New passwords do not match.");
            return;
        }

        try {
            setIsUpdating(true);
            setUpdateStatus("idle");

            const res = await userService.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new,
                confirmPassword: passwords.confirm,
            });

            if (res.success) {
                setUpdateStatus("success");
                notify.success(res.message || "Security credentials updated successfully.");
                setPasswords({
                    current: "",
                    new: "",
                    confirm: "",
                });
                setTimeout(() => setUpdateStatus("idle"), 3000);
            } else {
                setUpdateStatus("error");
                notify.error(res.message || "Failed to update password.");
            }
        } catch (err: unknown) {
            setUpdateStatus("error");
            const message = err instanceof Error ? err.message : "Failed to update password.";
            notify.error(message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!deletePassword) {
            notify.error("Please enter your current password to confirm account deletion.");
            return;
        }

        try {
            setIsDeleting(true);
            const res = await userService.deleteAccount(deletePassword);
            if (res.success) {
                notify.success("Account deleted successfully.");
                setShowDeleteModal(false);
                setDeletePassword("");
                await logout();
            } else {
                notify.error(res.message || "Failed to delete account.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete account.";
            notify.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setShowDeleteModal(false);
        setDeletePassword("");
        setShowDeletePassword(false);
    };

    return (
        <div className="flex flex-col gap-16">
            {/* Header */}
            <header className="space-y-4">
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
                                    placeholder="Enter current password"
                                    className="w-full bg-transparent border-none py-3 font-serif text-lg outline-none placeholder:text-zinc-300"
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
                                    placeholder="At least 6 characters"
                                    className="w-full bg-transparent border-none py-3 font-serif text-lg outline-none placeholder:text-zinc-300"
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
                                    placeholder="Confirm new password"
                                    className="w-full bg-transparent border-none py-3 font-serif text-lg outline-none placeholder:text-zinc-300"
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
                                    } disabled:opacity-70 shadow-lg shadow-brand-teal/20 flex items-center gap-2`}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>UPDATING...</span>
                                    </>
                                ) : updateStatus === "success" ? (
                                    "UPDATED"
                                ) : (
                                    "Update Password"
                                )}
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
                                Deactivate your account and disable future login access. Your account status will be marked as deleted.
                            </p>

                            <div className="flex items-center gap-3 text-zinc-400">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">
                                    Account Deactivation
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="px-12 py-5 font-bold uppercase tracking-[0.3em] text-[11px] bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/10 cursor-pointer"
                        >
                            Delete Account
                        </button>
                    </motion.div>
                </section>
            </div>

            {/* Delete Account Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-lg bg-white p-8 md:p-10 shadow-2xl border border-zinc-100 rounded-2xl"
                        >
                            <button
                                onClick={handleCloseDeleteModal}
                                disabled={isDeleting}
                                className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="space-y-6">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-serif text-2xl text-zinc-900">
                                        Delete Account
                                    </h3>
                                    <p className="text-zinc-500 font-serif text-sm leading-relaxed">
                                        Are you sure you want to delete your account? Your account status will be set to <strong className="text-red-600 font-semibold">Deleted</strong> and you will not be able to log in again. Please enter your current password below to confirm.
                                    </p>
                                </div>

                                <form onSubmit={handleDeleteAccount} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                                            Current Password
                                        </label>
                                        <div className="relative border-b border-zinc-200 focus-within:border-red-500 transition-colors duration-300">
                                            <input
                                                type={showDeletePassword ? "text" : "password"}
                                                value={deletePassword}
                                                onChange={(e) => setDeletePassword(e.target.value)}
                                                placeholder="Enter current password to confirm"
                                                className="w-full bg-transparent border-none py-2.5 font-serif text-base outline-none placeholder:text-zinc-300 pr-8"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowDeletePassword(!showDeletePassword)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                                            >
                                                {showDeletePassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100">
                                        <button
                                            type="button"
                                            disabled={isDeleting}
                                            onClick={handleCloseDeleteModal}
                                            className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isDeleting || !deletePassword.trim()}
                                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center gap-2 rounded shadow-sm shadow-red-600/20 cursor-pointer"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Deleting...</span>
                                                </>
                                            ) : (
                                                "Confirm Delete"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}