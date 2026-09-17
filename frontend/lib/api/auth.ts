import { apiClient, ApiResponse } from './client';

export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt?: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResendOtpPayload {
  email: string;
  purpose: 'ACCOUNT_VERIFICATION' | 'PASSWORD_RESET';
}

export const authApi = {
  register: (data: RegisterPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/auth/register', data);
  },

  verifyEmail: (data: VerifyEmailPayload): Promise<ApiResponse<User>> => {
    return apiClient.post<User>('/api/auth/verify-email', data);
  },

  login: (data: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/api/auth/login', data);
  },

  forgotPassword: (data: ForgotPasswordPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/auth/forgot-password', data);
  },

  verifyResetOtp: (data: VerifyResetOtpPayload): Promise<ApiResponse<{ resetToken: string }>> => {
    return apiClient.post<{ resetToken: string }>('/api/auth/verify-reset-otp', data);
  },

  resetPassword: (data: ResetPasswordPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/auth/reset-password', data);
  },

  resendOtp: (data: ResendOtpPayload): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/api/auth/resend-otp', data);
  },

  getMe: (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/api/auth/me');
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      return await apiClient.post<void>('/api/auth/logout');
    } catch {
      return { success: true, message: 'Logged out' };
    }
  },
};
