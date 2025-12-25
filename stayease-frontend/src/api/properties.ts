import { api, unwrap } from './client';
import type { Amenity, PagedResponse, Property, PropertyRequest, Room } from '@/types/api';
import type { GenderPreference, PropertyType } from '@/types/domain';

export const fetchProperties = async (page = 0, size = 10) => {
  const res = await api.get('/properties', { params: { page, size } });
  return unwrap<PagedResponse<Property>>(res);
};

export const fetchPropertyById = async (id: number) => {
  const res = await api.get(`/properties/${id}`);
  return unwrap<Property>(res);
};

export const fetchPropertyRooms = async (id: number, onlyAvailable?: boolean) => {
  const path = onlyAvailable ? `/properties/${id}/rooms/available` : `/properties/${id}/rooms`;
  const res = await api.get(path);
  return unwrap<Room[]>(res);
};

export const fetchFeaturedProperties = async () => {
  const res = await api.get('/properties/featured');
  return unwrap<Property[]>(res);
};

export const fetchCities = async () => {
  const res = await api.get('/properties/cities');
  return unwrap<string[]>(res);
};

export const searchProperties = async (params: {
  city?: string;
  propertyType?: PropertyType;
  genderPreference?: GenderPreference;
  minRent?: number;
  maxRent?: number;
  availableBeds?: number;
  page?: number;
  size?: number;
}) => {
  const res = await api.get('/properties/search', { params });
  return unwrap<PagedResponse<Property>>(res);
};

export const searchPropertiesByKeyword = async (params: { keyword: string; page?: number; size?: number }) => {
  const res = await api.get('/properties/search/keyword', { params });
  return unwrap<PagedResponse<Property>>(res);
};

export const fetchAmenities = async () => {
  const res = await api.get('/amenities');
  return unwrap<Amenity[]>(res);
};

// Owner endpoints
export const fetchOwnerProperties = async (page = 0, size = 10) => {
  const res = await api.get('/owner/properties', { params: { page, size } });
  return unwrap<PagedResponse<Property>>(res);
};

export const createProperty = async (payload: PropertyRequest) => {
  const res = await api.post('/owner/properties', payload);
  return unwrap<Property>(res);
};

export const updateProperty = async (propertyId: number, payload: PropertyRequest) => {
  const res = await api.put(`/owner/properties/${propertyId}`, payload);
  return unwrap<Property>(res);
};

export const deleteProperty = async (propertyId: number) => {
  const res = await api.delete(`/owner/properties/${propertyId}`);
  return unwrap<void>(res);
};

export const togglePropertyStatus = async (propertyId: number, isActive: boolean) => {
  const res = await api.patch(`/owner/properties/${propertyId}/status`, null, { params: { isActive } });
  return unwrap<void>(res);
};
