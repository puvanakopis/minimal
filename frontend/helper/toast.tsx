'use client';

import React from 'react';
import { toast, ToastOptions, CloseButtonProps } from 'react-toastify';
import { X } from 'lucide-react';
import { ApiError } from '@/services/client';

export const CustomCloseButton = ({ closeToast }: CloseButtonProps) => (
  <button
    type="button"
    onClick={closeToast}
    aria-label="Close notification"
    className="size-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1a1a1a] hover:bg-black/5 transition-colors shrink-0 ml-3 self-center"
  >
    <X size={14} strokeWidth={2} />
  </button>
);

interface ToastItemProps {
  message: string;
}

export const MinimalToastContent: React.FC<ToastItemProps> = ({ message }) => {
  return (
    <div className="w-full py-1 px-1">
      <p className="text-xs sm:text-[13px] font-medium text-[#1a1a1a] leading-relaxed break-words">
        {message}
      </p>
    </div>
  );
};

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  closeButton: CustomCloseButton,
  icon: false,
};

/**
 * Clean helper methods for unified Toastify notifications matching MINIMAL UI design.
 */
export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toast(
      <MinimalToastContent message={message} />,
      {
        ...defaultOptions,
        className: 'minimal-toast minimal-toast--success',
        ...options,
      }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return toast(
      <MinimalToastContent message={message} />,
      {
        ...defaultOptions,
        className: 'minimal-toast minimal-toast--error',
        ...options,
      }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(
      <MinimalToastContent message={message} />,
      {
        ...defaultOptions,
        className: 'minimal-toast minimal-toast--warning',
        ...options,
      }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(
      <MinimalToastContent message={message} />,
      {
        ...defaultOptions,
        className: 'minimal-toast minimal-toast--info',
        ...options,
      }
    );
  },

  /**
   * Safely formats and displays an API or network error message.
   * Avoids displaying raw stack traces or internal technical errors to the user.
   */
  apiError: (error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.', options?: ToastOptions) => {
    let displayMessage = fallbackMessage;

    if (error instanceof ApiError) {
      if (error.message && !error.message.includes('Internal Server Error') && !error.message.includes('Exception')) {
        displayMessage = error.message;
      }
    } else if (error instanceof Error) {
      if (error.message && !error.message.includes('<!DOCTYPE') && !error.message.includes('fetch failed')) {
        displayMessage = error.message;
      }
    } else if (typeof error === 'string') {
      displayMessage = error;
    }

    return toast(
      <MinimalToastContent message={displayMessage} />,
      {
        ...defaultOptions,
        className: 'minimal-toast minimal-toast--error',
        ...options,
      }
    );
  },
};

export { toast };
export default notify;
