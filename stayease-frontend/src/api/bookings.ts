import { api, unwrap } from './client';
import type { Booking, BookingRequest, PagedResponse } from '@/types/api';
import type { BookingStatus } from '@/types/domain';

export const createBooking = async (payload: BookingRequest) => {
  const res = await api.post('/bookings', payload);
  return unwrap<Booking>(res);
};

export const fetchMyBookings = async (page = 0, size = 10) => {
  const res = await api.get('/bookings', { params: { page, size } });
  return unwrap<PagedResponse<Booking>>(res);
};

export const fetchBookingById = async (bookingId: number) => {
  const res = await api.get(`/bookings/${bookingId}`);
  return unwrap<Booking>(res);
};

export const cancelBooking = async (bookingId: number) => {
  const res = await api.post(`/bookings/${bookingId}/cancel`);
  return unwrap<void>(res);
};

export const fetchOwnerBookings = async ({
  status,
  page = 0,
  size = 10,
}: {
  status?: BookingStatus;
  page?: number;
  size?: number;
}) => {
  const res = await api.get('/owner/bookings', { params: { status, page, size } });
  return unwrap<PagedResponse<Booking>>(res);
};

export const updateBookingStatus = async (bookingId: number, status: BookingStatus) => {
  const res = await api.patch(`/owner/bookings/${bookingId}/status`, null, { params: { status } });
  return unwrap<Booking>(res);
};
