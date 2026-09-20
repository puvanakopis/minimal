import { apiClient } from './client';
import {
  ApiResponse,
  User,
  AuthResponseData,
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
  ResendOtpPayload,
} from '@/interfaces';

export const authService = {
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

// Backward-compatible alias
export const authApi = authService;
