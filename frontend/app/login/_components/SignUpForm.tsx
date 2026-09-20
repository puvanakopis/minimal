'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2, RotateCw } from 'lucide-react'
import { authService as authApi } from '@/services'
import { notify } from '@/helper/toast'

interface SignUpFormProps {
    onSignIn: () => void
}

export default function SignUpForm({ onSignIn }: SignUpFormProps) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showSignupPassword, setShowSignupPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [signupEmailError, setSignupEmailError] = useState('')
    const [signupPasswordError, setSignupPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState('')
    const [otpStep, setOtpStep] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')
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
        if (val.length < 8) {
            setSignupPasswordError('Password must be at least 8 characters')
            return false
        }
        if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).*$/.test(val)) {
            setSignupPasswordError('Must include uppercase, lowercase, number, and special character')
            return false
        }
        setSignupPasswordError('')
        return true
    }

    const validateConfirmPassword = (val: string) => {
        if (!val) {
            setConfirmPasswordError('Password confirmation is required')
            return false
        }
        if (val !== signupPassword) {
            setConfirmPasswordError('Passwords do not match')
            return false
        }
        setConfirmPasswordError('')
        return true
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setFormSuccess('')

        const isFirstNameValid = validateFirstName(firstName)
        const isLastNameValid = validateLastName(lastName)
        const isEmailValid = validateSignupEmail(signupEmail)
        const isPassValid = validateSignupPassword(signupPassword)
        const isConfirmValid = validateConfirmPassword(confirmPassword)

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPassValid || !isConfirmValid) return

        setIsLoading(true)

        try {
            const res = await authApi.register({
                firstName,
                lastName,
                email: signupEmail,
                password: signupPassword,
                confirmPassword,
            })

            if (res.success) {
                setOtpStep(true)
                const msg = 'Verification code sent! Please check your email inbox.'
                setFormSuccess(msg)
                notify.success(msg)
            } else {
                const msg = res.message || 'Failed to initiate registration.'
                setFormError(msg)
                notify.error(msg)
            }
        } catch (err: any) {
            const msg = err.message || 'An error occurred during registration.'
            setFormError(msg)
            notify.apiError(err, 'An error occurred during registration.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        setFormSuccess('')
        setOtpError('')

        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit verification code')
            return
        }

        setIsLoading(true)

        try {
            const res = await authApi.verifyEmail({
                email: signupEmail,
                otp,
            })

            if (res.success) {
                const msg = 'Account verified successfully! Redirecting to sign in...'
                setFormSuccess(msg)
                notify.success(msg)
                setTimeout(() => {
                    onSignIn()
                }, 2000)
            } else {
                const msg = res.message || 'OTP verification failed.'
                setFormError(msg)
                notify.error(msg)
            }
        } catch (err: any) {
            const msg = err.message || 'Invalid or expired OTP.'
            setFormError(msg)
            notify.apiError(err, 'Invalid or expired OTP.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setFormError('')
        setFormSuccess('')
        setIsResending(true)

        try {
            const res = await authApi.resendOtp({
                email: signupEmail,
                purpose: 'ACCOUNT_VERIFICATION',
            })

            if (res.success) {
                const msg = 'A new verification code has been sent to your email.'
                setFormSuccess(msg)
                notify.info(msg)
            } else {
                const msg = res.message || 'Failed to resend verification code.'
                setFormError(msg)
                notify.error(msg)
            }
        } catch (err: any) {
            const msg = err.message || 'Could not resend OTP. Please try again shortly.'
            setFormError(msg)
            notify.apiError(err, 'Could not resend OTP. Please try again shortly.')
        } finally {
            setIsResending(false)
        }
    }

    if (otpStep) {
        return (
            <motion.form
                key="otp-verification-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
            >
                {formError && (
                    <div className="p-3 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-center">
                        {formError}
                    </div>
                )}
                {formSuccess && (
                    <div className="p-3 text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-semibold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                        <span>{formSuccess}</span>
                    </div>
                )}

                <div className="text-center space-y-1">
                    <p className="text-xs text-[#4e8b97]">
                        We sent a 6-digit verification code to:
                    </p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{signupEmail}</p>
                </div>

                {/* OTP INPUT */}
                <div className="relative">
                    <input
                        type="text"
                        maxLength={6}
                        id="verify-otp"
                        value={otp}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '')
                            setOtp(val)
                            if (otpError) setOtpError('')
                        }}
                        className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-center tracking-[0.5em] text-lg font-bold outline-none focus:border-brand-teal focus:ring-0 transition-colors placeholder-gray-300 text-[#1a1a1a]"
                        placeholder="••••••"
                    />
                    {otpError && (
                        <p className="text-rose-500 text-xs mt-1.5 text-center font-semibold tracking-wide">
                            {otpError}
                        </p>
                    )}
                </div>

                {/* VERIFY BUTTON */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <>
                            Verify & Activate Account
                            <CheckCircle2 size={14} />
                        </>
                    )}
                </button>

                {/* RESEND / BACK ACTIONS */}
                <div className="flex items-center justify-between text-xs pt-2">
                    <button
                        type="button"
                        onClick={() => setOtpStep(false)}
                        className="text-gray-500 hover:text-[#1a1a1a] transition-colors cursor-pointer text-[11px]"
                    >
                        ← Edit Info
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-brand-teal hover:underline font-bold uppercase text-[10px] tracking-widest cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                        {isResending ? <RotateCw size={12} className="animate-spin" /> : null}
                        Resend Code
                    </button>
                </div>
            </motion.form>
        )
    }

    return (
        <motion.form
            key="signup-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegister}
            className="space-y-4"
        >
            {formError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-center">
                    {formError}
                </div>
            )}
            {formSuccess && (
                <div className="p-3 text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-semibold text-center">
                    {formSuccess}
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
                    <p className="text-rose-500 text-xs mt-1 font-semibold tracking-wide">
                        {firstNameError}
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
                    <p className="text-rose-500 text-xs mt-1 font-semibold tracking-wide">
                        {lastNameError}
                    </p>
                )}
            </div>

            {/* EMAIL INPUT */}
            <div className="relative">
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
                {signupEmailError && (
                    <p className="text-rose-500 text-xs mt-1 font-semibold tracking-wide">
                        {signupEmailError}
                    </p>
                )}
            </div>

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
                    Password (min 8 chars)
                </label>
                <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
                >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {signupPasswordError && (
                    <p className="text-rose-500 text-xs mt-1 font-semibold tracking-wide">
                        {signupPasswordError}
                    </p>
                )}
            </div>

            {/* CONFIRM PASSWORD INPUT */}
            <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (confirmPasswordError) setConfirmPasswordError('')
                    }}
                    className="w-full bg-transparent border-b border-gray-300 py-3.5 pr-10 pl-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                    placeholder="Confirm Password"
                />
                <label
                    htmlFor="confirmPassword"
                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
            peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
            peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                >
                    Confirm Password
                </label>
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
                >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPasswordError && (
                    <p className="text-rose-500 text-xs mt-1 font-semibold tracking-wide">
                        {confirmPasswordError}
                    </p>
                )}
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
                {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <>
                        Continue to Verification
                        <UserPlus size={14} />
                    </>
                )}
            </button>

            {/* FOOTER */}
            <div className="pt-3 border-t border-[#e7f1f3] text-center space-y-2">
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