"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys, getInvalidationKeys } from "@/lib/query-keys";
import type {
  Booking,
  PublicBooking,
  CreateBooking,
  UpdateBookingStatus,
  BookingStatus,
} from "@repo/types";

// All bookings for admin
export function useBookings(initialData?: Booking[]) {
  return useQuery({
    queryKey: queryKeys.bookings.lists(),
    queryFn: () => clientApi.get<Booking[]>("/bookings"),
    initialData,
  });
}

// Single booking detail
export function useBooking(id: string, initialData?: Booking) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => clientApi.get<Booking>(`/bookings/${id}`),
    enabled: !!id,
    initialData,
  });
}

// Bookings for a specific session
export function useSessionBookings(sessionId: string, initialData?: Booking[]) {
  return useQuery({
    queryKey: queryKeys.bookings.bySession(sessionId),
    queryFn: () => clientApi.get<Booking[]>(`/sessions/${sessionId}/bookings`),
    enabled: !!sessionId,
    initialData,
  });
}

// Public booking detail (for visitors to check their booking)
export function usePublicBooking(id: string, initialData?: PublicBooking) {
  return useQuery({
    queryKey: queryKeys.bookings.public.detail(id),
    queryFn: () => clientApi.get<PublicBooking>(`/bookings/public/${id}`),
    enabled: !!id,
    initialData,
  });
}

// Create booking mutation (public endpoint)
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: CreateBooking;
    }) => clientApi.post<Booking>(`/sessions/${sessionId}/bookings`, data),
    onSuccess: (_, { sessionId }) => {
      // Invalidate related queries
      getInvalidationKeys.onBookingChange(sessionId).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error("Failed to create booking:", error);
    },
  });
}

// Update booking status (admin only)
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      clientApi.patch<Booking>(`/bookings/${id}/status`, { status }),
    onSuccess: (updatedBooking) => {
      // Update the booking in cache
      queryClient.setQueryData(
        queryKeys.bookings.detail(updatedBooking.id),
        updatedBooking
      );

      // Invalidate related queries
      getInvalidationKeys
        .onBookingChange(updatedBooking.session.id, updatedBooking.id)
        .forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
    },
    onError: (error) => {
      console.error("Failed to update booking status:", error);
    },
  });
}

// Cancel booking (public endpoint)
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      clientApi.patch<Booking>(`/bookings/${id}/cancel`, {}),
    onSuccess: (updatedBooking) => {
      // Update the booking in cache
      queryClient.setQueryData(
        queryKeys.bookings.detail(updatedBooking.id),
        updatedBooking
      );
      queryClient.setQueryData(
        queryKeys.bookings.public.detail(updatedBooking.id),
        {
          id: updatedBooking.id,
          status: updatedBooking.status,
          createdAt: updatedBooking.createdAt,
          sessionTitle: updatedBooking.session.title,
          sessionStartTime: updatedBooking.session.startTime,
          sessionEndTime: updatedBooking.session.endTime,
        } as PublicBooking
      );

      // Invalidate related queries
      getInvalidationKeys
        .onBookingChange(updatedBooking.session.id, updatedBooking.id)
        .forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
    },
    onError: (error) => {
      console.error("Failed to cancel booking:", error);
    },
  });
}

// Delete booking (admin only)
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientApi.delete(`/bookings/${id}`),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.removeQueries({
        queryKey: queryKeys.bookings.public.detail(id),
      });

      // Invalidate lists
      getInvalidationKeys.onBookingChange().forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error("Failed to delete booking:", error);
    },
  });
}

// Bulk update booking statuses
export function useBulkUpdateBookings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: BookingStatus }) =>
      clientApi.patch<Booking[]>("/bookings/bulk-update", { ids, status }),
    onSuccess: () => {
      // Invalidate all booking-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
    onError: (error) => {
      console.error("Failed to bulk update bookings:", error);
    },
  });
}
