'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  User,
  UpdateProfilePayload,
  AdminUpdateUserPayload,
  ApiResponse,
} from '@/interfaces';
import { userService } from '@/services';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  profile: User | null;
  isLoading: boolean;
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (data: UpdateProfilePayload) => Promise<ApiResponse<User>>;
  uploadAvatar: (file: File) => Promise<ApiResponse<{ avatarUrl: string }>>;
  adminGetUsers: () => Promise<ApiResponse<User[]>>;
  adminGetUserById: (id: number | string) => Promise<ApiResponse<User>>;
  adminUpdateUser: (id: number | string, data: AdminUpdateUserPayload) => Promise<ApiResponse<User>>;
  adminToggleBlockUser: (id: number | string, blocked?: boolean) => Promise<ApiResponse<User>>;
  adminDeleteUser: (id: number | string) => Promise<ApiResponse<void>>;
  refreshUsers: () => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser: setAuthUser } = useAuth();

  const getProfile = useCallback(async (): Promise<ApiResponse<User>> => {
    setIsLoading(true);
    try {
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    const res = await userService.updateProfile(data);
    if (res.success && res.data) {
      setProfile(res.data);
      setAuthUser(res.data);
    }
    return res;
  }, [setAuthUser]);

  const uploadAvatar = useCallback(async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    return userService.uploadAvatar(file);
  }, []);

  const adminGetUsers = useCallback(async (): Promise<ApiResponse<User[]>> => {
    setIsLoading(true);
    try {
      const res = await userService.adminGetUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await adminGetUsers();
  }, [adminGetUsers]);

  const adminGetUserById = useCallback(async (id: number | string): Promise<ApiResponse<User>> => {
    return userService.adminGetUserById(id);
  }, []);

  const adminUpdateUser = useCallback(async (id: number | string, data: AdminUpdateUserPayload): Promise<ApiResponse<User>> => {
    const res = await userService.adminUpdateUser(id, data);
    if (res.success && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === Number(id) || u.id === id ? res.data! : u)));
    }
    return res;
  }, []);

  const adminToggleBlockUser = useCallback(async (id: number | string, blocked?: boolean): Promise<ApiResponse<User>> => {
    const res = await userService.adminToggleBlockUser(id, blocked);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === Number(id) || u.id === id ? { ...u, blocked: !!blocked } : u))
      );
    }
    return res;
  }, []);

  const adminDeleteUser = useCallback(async (id: number | string): Promise<ApiResponse<void>> => {
    const res = await userService.adminDeleteUser(id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== Number(id) && u.id !== id));
    }
    return res;
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        profile,
        isLoading,
        getProfile,
        updateProfile,
        uploadAvatar,
        adminGetUsers,
        adminGetUserById,
        adminUpdateUser,
        adminToggleBlockUser,
        adminDeleteUser,
        refreshUsers,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}

export const useUser = useUsers;
