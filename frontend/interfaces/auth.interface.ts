export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin' | string;
  phoneNumber?: string;
  shippingAddress?: string;
  avatar?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  shippingAddress?: string;
  avatar?: string;
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
