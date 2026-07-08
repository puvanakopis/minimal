'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

interface SignInFormProps {
    onForgotPassword: () => void
    onSignUp: () => void
}

export default function SignInForm({ onForgotPassword, onSignUp }: SignInFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [formError, setFormError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateEmail = (val: string) => {
        if (!val) {
            setEmailError('Email address is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setEmailError('Please enter a valid email address')
            return false
        }
        setEmailError('')
        return true
    }

    const validatePassword = (val: string) => {
        if (!val) {
            setPasswordError('Password is required')
            return false
        }
        if (val.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            return false
        }
        setPasswordError('')
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        const isEmailValid = validateEmail(email)
        const isPassValid = validatePassword(password)

        if (!isEmailValid || !isPassValid) return

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setFormError(data.error || 'Something went wrong')
                setIsLoading(false)
                return
            }

            // Navigate to appropriate page on success
            if (data.user?.role === 'admin') {
                window.location.href = '/admin'
            } else {
                window.location.href = '/'
            }
        } catch (err) {
            console.error('Sign in error:', err)
            setFormError('Network error. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <motion.form
            key="password-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {formError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-center">
                    {formError}
                </div>
            )}
            {/* EMAIL INPUT */}
            <div className="relative">
                <input
                    type="email"
                    id="email-pass"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="Email Address"
                />
                <label
                    htmlFor="email-pass"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    Email Address
                </label>
                {emailError && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> {emailError}
                    </p>
                )}
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        if (passwordError) setPasswordError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 pr-10 pl-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="Password"
                />
                <label
                    htmlFor="password"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    Password
                </label>
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {passwordError && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> {passwordError}
                    </p>
                )}
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-teal hover:text-brand-teal/80 transition-colors cursor-pointer"
                >
                    Forgot Password?
                </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <>
                        Sign In
                        <ArrowRight size={14} />
                    </>
                )}
            </button>

            {/* FOOTER */}
            <div className="pt-4 border-t border-[#e7f1f3] text-center space-y-3">
                <p className="text-xs text-brand-teal tracking-wide">
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        onClick={onSignUp}
                        className="text-brand-teal hover:underline font-bold uppercase text-[10px] tracking-widest cursor-pointer ml-1"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </motion.form>
    )
}