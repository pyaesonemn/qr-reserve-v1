'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/lib/api';
import { queryKeys, getInvalidationKeys } from '@/lib/query-keys';
import type {
  Session,
  PublicSession,
  CreateSession,
  UpdateSession,
} from '@repo/types';

// Session list hook
export function useSessions(initialData?: Session[]) {
  return useQuery({
    queryKey: queryKeys.sessions.lists(),
    queryFn: () => clientApi.get<Session[]>('/sessions'),
    initialData,
  });
}

// Single session hook
export function useSession(id: string, initialData?: Session) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => clientApi.get<Session>(`/sessions/${id}`),
    enabled: !!id,
    initialData,
  });
}

// Public sessions (for booking interface)
export function usePublicSessions(initialData?: PublicSession[]) {
  return useQuery({
    queryKey: queryKeys.sessions.public.lists(),
    queryFn: () => clientApi.get<PublicSession[]>('/sessions/public'),
    initialData,
  });
}

// Public session detail
export function usePublicSession(id: string, initialData?: PublicSession) {
  return useQuery({
    queryKey: queryKeys.sessions.public.detail(id),
    queryFn: () => clientApi.get<PublicSession>(`/sessions/public/${id}`),
    enabled: !!id,
    initialData,
  });
}

// Create session mutation
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSession) =>
      clientApi.post<Session>('/sessions', data),
    onSuccess: () => {
      // Invalidate and refetch session lists
      getInvalidationKeys.onSessionChange().forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
    },
  });
}

// Update session mutation
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSession }) =>
      clientApi.put<Session>(`/sessions/${id}`, data),
    onSuccess: (_, { id }) => {
      // Invalidate related queries
      getInvalidationKeys.onSessionChange(id).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Failed to update session:', error);
    },
  });
}

// Delete session mutation
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientApi.delete(`/sessions/${id}`),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: queryKeys.sessions.detail(id) });
      getInvalidationKeys.onSessionChange().forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Failed to delete session:', error);
    },
  });
}

// Toggle session active status
export function useToggleSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientApi.patch<Session>(`/sessions/${id}/status`, { isActive }),
    onSuccess: (_, { id }) => {
      getInvalidationKeys.onSessionChange(id).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Failed to toggle session status:', error);
    },
  });
}