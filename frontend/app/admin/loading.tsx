'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 p-10 w-full"
      >
        {/* Animated outer ring */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-14 h-14 border-2 border-brand-teal/20 border-t-brand-teal rounded-full"
          />
          <Loader2 className="absolute size-6 animate-spin text-brand-teal" />
        </div>

        {/* Text with subtle pulse */}
        <div className="text-center space-y-1.5">
          <motion.h3
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a1a]"
          >
            Loading Admin Panel
          </motion.h3>
          <p className="text-[10px] text-gray-400 tracking-wider">Please wait while we retrieve the latest data...</p>
        </div>
      </motion.div>
    </div>
  );
}
