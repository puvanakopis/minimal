'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'

interface SignUpFormProps {
    onSignIn: () => void
}

export default function SignUpForm({ onSignIn }: SignUpFormProps) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [showSignupPassword, setShowSignupPassword] = useState(false)
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [signupEmailError, setSignupEmailError] = useState('')
    const [signupPasswordError, setSignupPasswordError] = useState('')
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [sendingOtp, setSendingOtp] = useState(false)
    const [formError, setFormError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateFirstName = (val: string) => {
        if (!val) {
            setFirstNameError('First name is required')
            return false
        }
        if (val.length < 2) {
            setFirstNameError('First name must be at least 2 characters')
            return false
        }
        setFirstNameError('')
        return true
    }

    const validateLastName = (val: string) => {
        if (!val) {
            setLastNameError('Last name is required')
            return false
        }
        if (val.length < 2) {
            setLastNameError('Last name must be at least 2 characters')
            return false
        }
        setLastNameError('')
        return true
    }

    const validateSignupEmail = (val: string) => {
        if (!val) {
            setSignupEmailError('Email address is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setSignupEmailError('Please enter a valid email address')
            return false
        }
        setSignupEmailError('')
        return true
    }

    const validateSignupPassword = (val: string) => {
        if (!val) {
            setSignupPasswordError('Password is required')
            return false
        }
        if (val.length < 6) {
            setSignupPasswordError('Password must be at least 6 characters')
            return false
        }
        setSignupPasswordError('')
        return true
    }

    const handleSendOtp = async () => {
        setFormError('')
        const isEmailValid = validateSignupEmail(signupEmail)
        if (!isEmailValid) return

        setSendingOtp(true)
        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: signupEmail, type: 'signup' }),
            })

            const data = await res.json()

            if (!res.ok) {
                setFormError(data.error || 'Failed to send OTP')
            } else {
                setOtpSent(true)
            }
        } catch (err) {
            setFormError('Network error. Please try again.')
        } finally {
            setSendingOtp(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setOtpError('')

        const isFirstNameValid = validateFirstName(firstName)
        const isLastNameValid = validateLastName(lastName)
        const isEmailValid = validateSignupEmail(signupEmail)
        const isPassValid = validateSignupPassword(signupPassword)

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPassValid) return

        if (!otpSent) {
            setFormError('Please verify your email address with an OTP first.')
            return
        }

        if (!otp) {
            setOtpError('Verification OTP is required')
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: signupEmail,
                    password: signupPassword,
                    otp,
                }),
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
            console.error('Sign up error:', err)
            setFormError('Network error. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <motion.form
            key="signup-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {formError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-center">
                    {formError}
                </div>
            )}
            {/* FIRST NAME INPUT */}
            <div className="relative">
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        if (firstNameError) setFirstNameError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="First Name"
                />
                <label
                    htmlFor="firstName"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    First Name
                </label>
                {firstNameError && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> {firstNameError}
                    </p>
                )}
            </div>

            {/* LAST NAME INPUT */}
            <div className="relative">
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value)
                        if (lastNameError) setLastNameError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="Last Name"
                />
                <label
                    htmlFor="lastName"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    Last Name
                </label>
                {lastNameError && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> {lastNameError}
                    </p>
                )}
            </div>

            {/* EMAIL INPUT */}
            <div className="relative flex items-end gap-4">
                <div className="relative flex-1">
                    <input
                        type="email"
                        id="signupEmail"
                        value={signupEmail}
                        onChange={(e) => {
                            setSignupEmail(e.target.value)
                            if (signupEmailError) setSignupEmailError('')
                        }}
                        className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                        placeholder="Email Address"
                    />
                    <label
                        htmlFor="signupEmail"
                        className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                    >
                        Email Address
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="py-2 px-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex-shrink-0 cursor-pointer disabled:opacity-50"
                >
                    {sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
            </div>
            {signupEmailError && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                    <span className="material-symbols-outlined text-[14px]">error</span> {signupEmailError}
                </p>
            )}

            {/* OTP INPUT */}
            {otpSent && (
                <div className="relative">
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value)
                            if (otpError) setOtpError('')
                        }}
                        className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                        placeholder="Verification OTP"
                    />
                    <label
                        htmlFor="otp"
                        className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                    >
                        Verification OTP
                    </label>
                    {otpError && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                            <span className="material-symbols-outlined text-[14px]">error</span> {otpError}
                        </p>
                    )}
                </div>
            )}

            {/* PASSWORD INPUT */}
            <div className="relative">
                <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signupPassword"
                    value={signupPassword}
                    onChange={(e) => {
                        setSignupPassword(e.target.value)
                        if (signupPasswordError) setSignupPasswordError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 pr-10 pl-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="Password"
                />
                <label
                    htmlFor="signupPassword"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    Password
                </label>
                <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
                >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {signupPasswordError && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[14px]">error</span> {signupPasswordError}
                    </p>
                )}
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
                {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <>
                        Create Account
                        <UserPlus size={14} />
                    </>
                )}
            </button>

            {/* FOOTER */}
            <div className="pt-4 border-t border-[#e7f1f3] text-center space-y-3">
                <p className="text-xs text-brand-teal tracking-wide">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSignIn}
                        className="text-brand-teal hover:underline font-bold uppercase text-[10px] tracking-widest cursor-pointer ml-1"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </motion.form>
    )
}