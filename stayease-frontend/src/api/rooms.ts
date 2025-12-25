import { api, unwrap } from './client';
import type { Room, RoomRequest } from '@/types/api';

export const fetchOwnerRooms = async (propertyId: number) => {
  const res = await api.get(`/owner/properties/${propertyId}/rooms`);
  return unwrap<Room[]>(res);
};

export const createRoom = async (propertyId: number, payload: RoomRequest) => {
  const res = await api.post(`/owner/properties/${propertyId}/rooms`, payload);
  return unwrap<Room>(res);
};

export const updateRoom = async (roomId: number, payload: RoomRequest) => {
  const res = await api.put(`/owner/rooms/${roomId}`, payload);
  return unwrap<Room>(res);
};

export const deleteRoom = async (roomId: number) => {
  const res = await api.delete(`/owner/rooms/${roomId}`);
  return unwrap<void>(res);
};

export const toggleRoomStatus = async (roomId: number, isActive: boolean) => {
  const res = await api.patch(`/owner/rooms/${roomId}/status`, null, { params: { isActive } });
  return unwrap<void>(res);
};
