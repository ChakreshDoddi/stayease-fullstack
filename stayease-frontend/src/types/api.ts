import type {
  BedStatus,
  BookingStatus,
  GenderPreference,
  PropertyType,
  Role,
  RoomType,
} from './domain';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
};

export type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
};

export type JwtResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImageUrl?: string | null;
  role: Role;
  isVerified?: boolean;
  createdAt?: string;
};

export type Amenity = {
  id: number;
  name: string;
  icon?: string;
  category: string;
};

export type Property = {
  id: number;
  name: string;
  description?: string;
  propertyType: PropertyType;
  genderPreference: GenderPreference;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  minRent: number;
  maxRent: number;
  securityDeposit?: number;
  noticePeriodDays?: number;
  totalRooms?: number;
  totalBeds?: number;
  availableBeds?: number;
  avgRating?: number;
  totalReviews?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  images?: string[];
  primaryImage?: string | null;
  amenities?: string[];
  owner: {
    id: number;
    name: string;
    phone?: string;
    businessName?: string;
  };
  createdAt?: string;
};

export type Bed = {
  id: number;
  bedNumber: string;
  status: BedStatus;
  occupiedFrom?: string | null;
  expectedCheckout?: string | null;
};

export type Room = {
  id: number;
  propertyId: number;
  roomNumber: string;
  roomType: RoomType;
  floorNumber?: number;
  totalBeds: number;
  availableBeds: number;
  rentPerBed: number;
  hasAttachedBathroom?: boolean;
  hasAc?: boolean;
  hasBalcony?: boolean;
  roomSizeSqft?: number;
  description?: string;
  isActive?: boolean;
  beds?: Bed[];
};

export type Booking = {
  id: number;
  bookingReference: string;
  userId: number;
  userName: string;
  propertyId: number;
  propertyName: string;
  roomId: number;
  roomNumber: string;
  bedId: number;
  bedNumber: string;
  checkInDate: string;
  checkOutDate?: string | null;
  monthlyRent: number;
  securityDeposit?: number;
  status: BookingStatus;
  notes?: string;
  createdAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: Role;
};

export type PropertyRequest = {
  name: string;
  description?: string;
  propertyType: PropertyType;
  genderPreference: GenderPreference;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  minRent: number;
  maxRent: number;
  securityDeposit?: number | null;
  noticePeriodDays?: number | null;
  amenityIds?: number[];
  imageUrls?: string[];
};

export type RoomRequest = {
  roomNumber: string;
  roomType: RoomType;
  floorNumber?: number | null;
  totalBeds: number;
  rentPerBed: number;
  hasAttachedBathroom?: boolean;
  hasAc?: boolean;
  hasBalcony?: boolean;
  roomSizeSqft?: number | null;
  description?: string;
};

export type BookingRequest = {
  propertyId: number;
  roomId: number;
  bedId: number;
  checkInDate: string;
  checkOutDate?: string | null;
  notes?: string;
};

export type InquiryRequest = {
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferredVisitDate?: string | null;
};
