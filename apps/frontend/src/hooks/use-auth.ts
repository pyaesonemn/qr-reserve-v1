"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys, getInvalidationKeys } from "@/lib/query-keys";
import type {
  User,
  AuthResponse,
  LoginData,
  SignupData,
  UpdateProfile,
} from "@repo/types";

// Current user hook
export function useUser(initialData?: User) {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => clientApi.get<User>("/auth/me"),
    initialData,
    retry: false, // Don't retry auth requests
    staleTime: 10 * 60 * 1000, // 10 minutes - user data doesn't change often
  });
}

// User profile hook (more detailed user info)
export function useProfile(initialData?: User) {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => clientApi.get<User>("/auth/profile"),
    initialData,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) =>
      clientApi.post<AuthResponse>("/auth/login", data),
    onSuccess: (response) => {
      // Store tokens (you might want to use a more secure method)
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), response.user);
      queryClient.setQueryData(queryKeys.auth.profile(), response.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

// Signup mutation
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupData) =>
      clientApi.post<AuthResponse>("/auth/signup", data),
    onSuccess: (response) => {
      // Store tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), response.user);
      queryClient.setQueryData(queryKeys.auth.profile(), response.user);
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clientApi.post("/auth/logout", {}),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
    },
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfile) =>
      clientApi.put<User>("/auth/profile", data),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), updatedUser);
      queryClient.setQueryData(queryKeys.auth.profile(), updatedUser);

      // Invalidate related queries
      getInvalidationKeys.onProfileChange().forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return clientApi.post<AuthResponse>("/auth/refresh", { refreshToken });
    },
    onSuccess: (response) => {
      // Update tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Update user data
      queryClient.setQueryData(queryKeys.auth.user(), response.user);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
    },
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      clientApi.post("/auth/change-password", data),
    onError: (error) => {
      console.error("Failed to change password:", error);
    },
  });
}

// Request password reset
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) =>
      clientApi.post("/auth/forgot-password", { email }),
    onError: (error) => {
      console.error("Failed to request password reset:", error);
    },
  });
}

// Reset password with token
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      clientApi.post("/auth/reset-password", data),
    onError: (error) => {
      console.error("Failed to reset password:", error);
    },
  });
}
