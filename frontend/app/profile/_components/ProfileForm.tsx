"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services";

const DEFAULT_AVATAR =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAkqKN-Dn7b2RiByQOdsY3JsOSPqwWe9h5hkK-nlCe_c-yNoY5XnCvvlLfbad7i9b5Hnd_0IG_26KxM972ZeCq7XZ6jaoWnDQcGSMK6pDILCqAqd0y6TPCeIaTGtlyjDNk00J9lutPGvfb97ttlZsxF4Su7lU3kWdeJvFzgoMTlOZm4j1Jwu7Zx38TrKUzlpgcm4FfesCRehO4diutfWGA_X-cQmywSMVRptlZ0_oBPL3Nc7wNj7m_OFngqYFlIe_IUX-VjGx_66KtP";

export function ProfileForm() {
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [profileImage, setProfileImage] = useState<string>(DEFAULT_AVATAR);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                address: user.shippingAddress || "",
            });
            if (user.avatar) {
                setProfileImage(user.avatar);
            }
        }
    }, [user]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSaveStatus("error");
            setStatusMessage("Image size should be less than 5MB");
            setTimeout(() => setSaveStatus("idle"), 3000);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setProfileImage(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSaving(true);
        setSaveStatus("idle");
        setStatusMessage("");

        try {
            const res = await userService.updateProfile({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phoneNumber: formData.phone.trim(),
                shippingAddress: formData.address.trim(),
                avatar: profileImage,
            });

            if (res.success && res.data) {
                setUser(res.data);
                setSaveStatus("success");
                setStatusMessage("Profile updated successfully!");
            } else {
                setSaveStatus("error");
                setStatusMessage(res.message || "Failed to update profile.");
            }
        } catch (err: unknown) {
            setSaveStatus("error");
            const errorMessage =
                err instanceof Error ? err.message : "An error occurred while updating profile.";
            setStatusMessage(errorMessage);
        } finally {
            setIsSaving(false);
            setTimeout(() => {
                setSaveStatus("idle");
                setStatusMessage("");
            }, 3000);
        }
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
                        Personal Information
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-4xl font-serif leading-tight text-zinc-900"
                >
                    User <span className="italic font-normal text-brand-teal">Profile</span>
                </motion.h1>
            </header>

            <div className="flex flex-col lg:flex-row gap-16 items-start">
                {/* Profile Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col items-center gap-8 group"
                >
                    <div className="relative w-48 h-48 overflow-hidden bg-zinc-100 rounded-full border border-brand-teal/20 p-1 shadow-2xl">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                                src={profileImage || DEFAULT_AVATAR}
                                alt="Profile photo"
                                fill
                                unoptimized={profileImage.startsWith("data:")}
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                                sizes="(max-width: 192px) 100vw, 192px"
                            />
                        </div>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-zinc-400 hover:text-brand-teal transition-all tracking-[0.2em] border-b border-zinc-200 hover:border-brand-teal pb-1"
                    >
                        UPDATE AVATAR
                    </button>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-12 w-full">
                    {statusMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl text-sm font-medium ${
                                saveStatus === "success"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {statusMessage}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* First Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col gap-3"
                        >
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                First Name
                            </label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter first name"
                                className="bg-transparent border-0 border-b border-zinc-200 py-3 font-serif text-xl focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </motion.div>

                        {/* Last Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="flex flex-col gap-3"
                        >
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Last Name
                            </label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter last name"
                                className="bg-transparent border-0 border-b border-zinc-200 py-3 font-serif text-xl focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </motion.div>

                        {/* Email (Read Only) */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="flex flex-col gap-3 md:col-span-2"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Email Address
                                </label>
                                <span className="text-[10px] text-zinc-400 tracking-wider">
                                    (Verified account email)
                                </span>
                            </div>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="bg-transparent border-0 border-b border-zinc-200 py-3 font-serif text-xl text-zinc-500 cursor-not-allowed outline-none"
                            />
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="flex flex-col gap-3 md:col-span-2"
                        >
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Phone Number
                            </label>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 000-0000"
                                className="bg-transparent border-0 border-b border-zinc-200 py-3 font-serif text-xl focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </motion.div>

                        {/* Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                            className="flex flex-col gap-3 md:col-span-2"
                        >
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Shipping Address
                            </label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Street address, City, State/Province, Postal Code, Country"
                                className="bg-transparent border-0 border-b border-zinc-200 py-3 font-serif text-xl focus:border-brand-teal outline-none resize-none transition-colors duration-300"
                            />
                        </motion.div>
                    </div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        className="pt-10"
                    >
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`group relative overflow-hidden px-12 py-5 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 ${
                                saveStatus === "success"
                                    ? "bg-zinc-900 text-white"
                                    : saveStatus === "error"
                                    ? "bg-red-600 text-white"
                                    : "bg-brand-teal text-white hover:bg-zinc-900"
                            } disabled:opacity-70`}
                        >
                            <span className="relative z-10">
                                {isSaving
                                    ? "SAVING..."
                                    : saveStatus === "success"
                                    ? "SAVED"
                                    : saveStatus === "error"
                                    ? "RETRY"
                                    : "Commit Changes"}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}