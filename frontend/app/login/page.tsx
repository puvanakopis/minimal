'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import LogoIcon from '@/components/LogoIcon'
import SignInForm from './_components/SignInForm'
import SignUpForm from './_components/SignUpForm'
import ForgotPasswordForm from './_components/ForgotPasswordForm'

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'password' | 'signup' | 'forgot-password'>('password')

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-16 bg-black/15  max-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] max-w-[1280px] mx-auto bg-white rounded-3xl overflow-hidden border border-[#e7f1f3]">

        {/* LEFT COLUMN */}
        <div className="hidden lg:flex lg:flex-col lg:col-span-5 relative bg-[#1a1a1a] overflow-hidden h-full">

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-black/10 mix-blend-multiply" />

          <div className="absolute inset-0 scale-105 select-none pointer-events-none">
            <Image
              src="/images/auth_bg.png"
              alt="Modern Clothing Editorial"
              fill
              priority
              sizes="50vw"
              className="object-cover object-center opacity-90 transition-transform duration-[10000ms] ease-out hover:scale-110"
            />
          </div>

          {/* BRANDING */}
          <div className="relative z-20 h-full w-full flex flex-col justify-between p-12 text-white">

            <div className="flex items-center gap-3">
              <div className="size-6 text-primary">
                <LogoIcon />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Minimal
              </h2>
            </div>

            <div className="space-y-6">
              <h3 className="font-serif text-3xl xl:text-4xl font-light italic leading-snug text-white/90">
                “Where timeless design meets modern comfort — redefine your style.”
              </h3>
              <div className="h-px w-16 bg-brand-teal" />
              <p className="text-xs tracking-[0.2em] font-semibold text-white/50 uppercase">
                Spring Collection / Effortless Elegance
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN/SIGNUP FORM SECTION */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-16 bg-white">
          <div className="max-w-[420px] w-full mx-auto space-y-8">

            {/* HEADER */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="font-serif text-3xl font-normal tracking-wide text-[#1a1a1a]">
                {loginMode === 'password' ? 'Welcome Back' : loginMode === 'signup' ? 'Join the Club' : 'Reset Password'}
              </h1>
              <p className="text-xs text-brand-teal tracking-wider">
                {loginMode === 'password'
                  ? 'Access your personalized style and orders'
                  : loginMode === 'signup'
                    ? 'Create an account to start your fashion journey'
                    : 'Enter your email to reset your password'}
              </p>
            </div>

            {/* MODE SEGMENTED CONTROL (only for password/signup) */}
            {loginMode !== 'forgot-password' && (
              <div className="relative flex p-1 bg-off-white rounded-full border border-[#e7f1f3]">
                <button
                  type="button"
                  onClick={() => setLoginMode('password')}
                  className="relative flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-colors duration-300"
                >
                  {loginMode === 'password' && (
                    <div className="absolute inset-0 bg-white rounded-full shadow-sm" />
                  )}
                  <span className={`relative z-20 transition-colors duration-300 ${loginMode === 'password' ? 'text-[#1a1a1a]' : 'text-[#4e8b97]'}`}>
                    Sign In
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('signup')}
                  className="relative flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-colors duration-300"
                >
                  {loginMode === 'signup' && (
                    <div className="absolute inset-0 bg-white rounded-full shadow-sm" />
                  )}
                  <span className={`relative z-20 transition-colors duration-300 ${loginMode === 'signup' ? 'text-[#1a1a1a]' : 'text-[#4e8b97]'}`}>
                    Sign Up
                  </span>
                </button>
              </div>
            )}

            {/* INTERACTIVE FORM PANEL */}
            <div className="min-h-[420px]">
              <AnimatePresence mode="wait">
                {loginMode === 'password' && (
                  <SignInForm
                    key="signin"
                    onForgotPassword={() => setLoginMode('forgot-password')}
                    onSignUp={() => setLoginMode('signup')}
                  />
                )}
                {loginMode === 'signup' && (
                  <SignUpForm
                    key="signup"
                    onSignIn={() => setLoginMode('password')}
                  />
                )}
                {loginMode === 'forgot-password' && (
                  <ForgotPasswordForm
                    key="forgot"
                    onBack={() => setLoginMode('password')}
                  />
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}