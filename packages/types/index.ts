// Shared types for frontend and backend

// Enums
export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Session types
export interface Session {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: Date;
  endTime: Date;
  maxBookings: number;
  isActive: boolean;
  qrCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  bookingCount?: number | null;
}

export interface PublicSession {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: Date;
  endTime: Date;
  maxBookings: number;
  bookingCount: number;
  isAvailable: boolean;
}

// Booking types
export interface Booking {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string | null;
  notes?: string | null;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  session: Session;
}

export interface PublicBooking {
  id: string;
  status: BookingStatus;
  createdAt: Date;
  sessionTitle: string;
  sessionStartTime: Date;
  sessionEndTime: Date;
}

// Input/Create types
export interface CreateSession {
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  maxBookings: number;
}

export interface CreateBooking {
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  notes?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfile {
  name?: string;
  phone?: string;
}

export interface UpdateBookingStatus {
  status: BookingStatus;
}

export interface UpdateSession {
  title?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  maxBookings?: number;
}