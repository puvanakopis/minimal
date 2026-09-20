'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, CheckCircle2, RotateCw, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'
import { authService as authApi } from '@/services'
import { notify } from '@/helper/toast'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'new-password'>('email')
  const [resetEmail, setResetEmail] = useState('')
  const [resetEmailError, setResetEmailError] = useState('')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [isResending, setIsResending] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateResetEmail = (val: string) => {
    if (!val) {
      setResetEmailError('Email address is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setResetEmailError('Please enter a valid email address')
      return false
    }
    setResetEmailError('')
    return true
  }

  const validatePassword = (val: string) => {
    if (!val) {
      setNewPasswordError('New password is required')
      return false
    }
    if (val.length < 8) {
      setNewPasswordError('Password must be at least 8 characters')
      return false
    }
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).*$/.test(val)) {
      setNewPasswordError('Must include uppercase, lowercase, number, and special character')
      return false
    }
    setNewPasswordError('')
    return true
  }

  const validateConfirmPassword = (val: string) => {
    if (!val) {
      setConfirmPasswordError('Please confirm your password')
      return false
    }
    if (val !== newPassword) {
      setConfirmPasswordError('Passwords do not match')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  // Step 1: Send Forgot Password OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    const isEmailValid = validateResetEmail(resetEmail)
    if (!isEmailValid) return

    setIsLoading(true)
    try {
      const res = await authApi.forgotPassword({ email: resetEmail })
      if (res.success) {
        setStep('otp')
        const msg = 'Reset code sent! Please check your email inbox.'
        setFormSuccess(msg)
        notify.success(msg)
      } else {
        const msg = res.message || 'Failed to send reset code.'
        setFormError(msg)
        notify.error(msg)
      }
    } catch (err: any) {
      const msg = err.message || 'Error requesting password reset.'
      setFormError(msg)
      notify.apiError(err, 'Error requesting password reset.')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setOtpError('')

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter the 6-digit reset code')
      return
    }

    setIsLoading(true)
    try {
      const res = await authApi.verifyResetOtp({
        email: resetEmail,
        otp,
      })

      if (res.success && res.data?.resetToken) {
        setResetToken(res.data.resetToken)
        setStep('new-password')
        const msg = 'Code verified! Please choose a new password.'
        setFormSuccess(msg)
        notify.success(msg)
      } else {
        const msg = res.message || 'Invalid or expired reset code.'
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

  // Step 3: Reset Password with Reset Token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    const isPassValid = validatePassword(newPassword)
    const isConfirmValid = validateConfirmPassword(confirmPassword)

    if (!isPassValid || !isConfirmValid) return

    setIsLoading(true)

    try {
      const res = await authApi.resetPassword({
        email: resetEmail,
        resetToken,
        newPassword,
        confirmPassword,
      })

      if (res.success) {
        setResetSuccess(true)
        const msg = 'Password reset successfully! Returning to sign in...'
        setFormSuccess(msg)
        notify.success(msg)
        setTimeout(() => {
          onBack()
        }, 2500)
      } else {
        const msg = res.message || 'Failed to reset password.'
        setFormError(msg)
        notify.error(msg)
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to reset password. Please try again.'
      setFormError(msg)
      notify.apiError(err, 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    setFormError('')
    setFormSuccess('')
    setIsResending(true)

    try {
      const res = await authApi.resendOtp({
        email: resetEmail,
        purpose: 'PASSWORD_RESET',
      })

      if (res.success) {
        const msg = 'A new reset code has been sent to your email.'
        setFormSuccess(msg)
        notify.info(msg)
      } else {
        const msg = res.message || 'Failed to resend reset code.'
        setFormError(msg)
        notify.error(msg)
      }
    } catch (err: any) {
      const msg = err.message || 'Could not resend OTP. Cooldown may be active.'
      setFormError(msg)
      notify.apiError(err, 'Could not resend OTP. Cooldown may be active.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
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

      {/* STEP 1: ENTER EMAIL */}
      {step === 'email' && (
        <motion.form
          key="forgot-email-step"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleRequestOtp}
          className="space-y-5"
        >
          <div className="relative">
            <input
              type="email"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value)
                if (resetEmailError) setResetEmailError('')
              }}
              className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
              placeholder="Email Address"
            />
            <label
              htmlFor="resetEmail"
              className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
            >
              Email Address
            </label>
            {resetEmailError && (
              <p className="text-rose-500 text-xs mt-1.5 font-semibold tracking-wide">
                {resetEmailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Send Reset Code
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 'otp' && (
        <motion.form
          key="forgot-otp-step"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleVerifyOtp}
          className="space-y-6"
        >
          <div className="text-center space-y-1">
            <p className="text-xs text-[#4e8b97]">
              Enter the 6-digit code sent to:
            </p>
            <p className="text-sm font-semibold text-[#1a1a1a]">{resetEmail}</p>
          </div>

          <div className="relative">
            <input
              type="text"
              maxLength={6}
              id="reset-otp"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Verify Code
                <KeyRound size={14} />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-gray-500 hover:text-[#1a1a1a] transition-colors cursor-pointer text-[11px]"
            >
              ← Change Email
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
      )}

      {/* STEP 3: CHOOSE NEW PASSWORD */}
      {step === 'new-password' && (
        <motion.form
          key="forgot-new-password-step"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleResetPassword}
          className="space-y-5"
        >
          {/* NEW PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (newPasswordError) setNewPasswordError('')
              }}
              className="w-full bg-transparent border-b border-gray-300 py-3.5 pr-10 pl-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
              placeholder="New Password"
            />
            <label
              htmlFor="newPassword"
              className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
            >
              New Password (min 8 chars)
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {newPasswordError && (
              <p className="text-rose-500 text-xs mt-1.5 font-semibold tracking-wide">
                {newPasswordError}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
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
              placeholder="Confirm New Password"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
            >
              Confirm New Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-1 top-3.5 text-[#4e8b97] hover:text-brand-teal transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {confirmPasswordError && (
              <p className="text-rose-500 text-xs mt-1.5 font-semibold tracking-wide">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || resetSuccess}
            className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Reset Password
                <Lock size={14} />
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* FOOTER */}
      <div className="pt-3 border-t border-[#e7f1f3] text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#4e8b97] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          Remember your password? <span className="text-brand-teal font-bold uppercase text-[10px] tracking-widest ml-1">Sign In</span>
        </button>
      </div>
    </div>
  )
}