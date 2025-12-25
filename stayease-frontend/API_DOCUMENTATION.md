# StayEase API Documentation

This document provides a complete reference for all REST API endpoints exposed by the Spring Boot backend and consumed by the React frontend.

## Base URL
```
http://localhost:8080
```

## Authentication
Most endpoints require JWT authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints (`/auth`)

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "1234567890",
      "role": "USER"
    }
  }
}
```

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

### POST `/auth/register/owner`
Register a new owner account.

**Request Body:** Same as `/auth/register`

### GET `/auth/me`
Get current authenticated user profile.

**Headers:** Requires `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "role": "USER"
  }
}
```

---

## Property Endpoints (`/properties`)

### GET `/properties`
Get paginated list of all properties.

**Query Parameters:**
- `page` (optional, default: 0) - Page number
- `size` (optional, default: 10) - Page size

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 10,
    "totalElements": 50,
    "totalPages": 5,
    "first": true,
    "last": false
  }
}
```

### GET `/properties/{id}`
Get property details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sunshine PG",
    "description": "Comfortable PG near city center",
    "propertyType": "PG",
    "genderPreference": "MALE",
    "addressLine1": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "minRent": 8000,
    "maxRent": 12000,
    "securityDeposit": 10000,
    "totalBeds": 10,
    "availableBeds": 5,
    "amenities": ["WiFi", "AC", "Laundry"],
    "images": ["https://..."],
    "owner": {
      "id": 1,
      "name": "John Owner",
      "phone": "9876543210"
    }
  }
}
```

### GET `/properties/{id}/rooms`
Get all rooms in a property.

### GET `/properties/{id}/rooms/available`
Get only available rooms in a property.

### GET `/properties/featured`
Get featured properties.

### GET `/properties/cities`
Get list of all cities with properties.

**Response:**
```json
{
  "success": true,
  "data": ["Bangalore", "Mumbai", "Delhi", "Pune"]
}
```

### GET `/properties/search`
Search properties with filters.

**Query Parameters:**
- `city` (optional) - Filter by city
- `propertyType` (optional) - PG | HOSTEL | FLAT | APARTMENT
- `genderPreference` (optional) - MALE | FEMALE | COED
- `minRent` (optional) - Minimum rent
- `maxRent` (optional) - Maximum rent
- `availableBeds` (optional) - Minimum available beds
- `page` (optional, default: 0)
- `size` (optional, default: 10)

### GET `/properties/search/keyword`
Search properties by keyword.

**Query Parameters:**
- `keyword` (required) - Search term
- `page` (optional, default: 0)
- `size` (optional, default: 10)

---

## Amenity Endpoints (`/amenities`)

### GET `/amenities`
Get all amenities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "WiFi",
      "icon": "wifi",
      "category": "utilities"
    }
  ]
}
```

### GET `/amenities/category/{category}`
Get amenities by category.

---

## Booking Endpoints (`/bookings`)

### POST `/bookings`
Create a new booking (User only).

**Headers:** Requires `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "propertyId": 1,
  "roomId": 1,
  "bedId": 1,
  "checkInDate": "2024-01-01",
  "checkOutDate": "2024-12-31",
  "notes": "Prefer ground floor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "bookingReference": "BK-20240101-001",
    "propertyName": "Sunshine PG",
    "roomNumber": "101",
    "bedNumber": "A",
    "checkInDate": "2024-01-01",
    "monthlyRent": 10000,
    "status": "PENDING"
  }
}
```

### GET `/bookings`
Get current user's bookings.

**Headers:** Requires `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 0)
- `size` (optional, default: 10)

### GET `/bookings/{bookingId}`
Get booking details by ID.

### GET `/bookings/reference/{reference}`
Get booking by reference number.

### POST `/bookings/{bookingId}/cancel`
Cancel a booking.

---

## Owner Endpoints (`/owner`)

**All endpoints require `OWNER` role and authentication.**

### Property Management

#### GET `/owner/properties`
Get owner's properties.

**Query Parameters:**
- `page` (optional, default: 0)
- `size` (optional, default: 10)

#### POST `/owner/properties`
Create a new property.

**Request Body:**
```json
{
  "name": "My New PG",
  "description": "Comfortable PG",
  "propertyType": "PG",
  "genderPreference": "COED",
  "addressLine1": "123 Main St",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "minRent": 8000,
  "maxRent": 12000,
  "securityDeposit": 10000,
  "noticePeriodDays": 30,
  "amenityIds": [1, 2, 3],
  "imageUrls": ["https://..."]
}
```

#### PUT `/owner/properties/{propertyId}`
Update a property.

#### DELETE `/owner/properties/{propertyId}`
Delete a property.

#### PATCH `/owner/properties/{propertyId}/status`
Toggle property active status.

**Query Parameters:**
- `isActive` (required) - true | false

### Room Management

#### GET `/owner/properties/{propertyId}/rooms`
Get all rooms for a property.

#### POST `/owner/properties/{propertyId}/rooms`
Create a new room.

**Request Body:**
```json
{
  "roomNumber": "101",
  "roomType": "DOUBLE",
  "floorNumber": 1,
  "totalBeds": 2,
  "rentPerBed": 10000,
  "hasAttachedBathroom": true,
  "hasAc": true,
  "hasBalcony": false,
  "roomSizeSqft": 200,
  "description": "Spacious room with attached bathroom"
}
```

#### PUT `/owner/rooms/{roomId}`
Update a room.

#### DELETE `/owner/rooms/{roomId}`
Delete a room.

#### PATCH `/owner/rooms/{roomId}/status`
Toggle room active status.

**Query Parameters:**
- `isActive` (required) - true | false

### Booking Management

#### GET `/owner/bookings`
Get all bookings for owner's properties.

**Query Parameters:**
- `status` (optional) - Filter by status (PENDING | CONFIRMED | CHECKED_IN | CHECKED_OUT | CANCELLED)
- `page` (optional, default: 0)
- `size` (optional, default: 10)

#### GET `/owner/bookings/{bookingId}`
Get booking details.

#### PATCH `/owner/bookings/{bookingId}/status`
Update booking status.

**Query Parameters:**
- `status` (required) - New status (CONFIRMED | CHECKED_IN | CHECKED_OUT | CANCELLED)

---

## Enums Reference

### PropertyType
- `PG` - Paying Guest accommodation
- `HOSTEL` - Hostel
- `FLAT` - Flat/Apartment for sharing
- `APARTMENT` - Full apartment

### GenderPreference
- `MALE` - Male only
- `FEMALE` - Female only
- `COED` - Co-ed / Mixed

### RoomType
- `SINGLE` - Single occupancy
- `DOUBLE` - Double occupancy
- `TRIPLE` - Triple occupancy
- `DORMITORY` - Dormitory (4+ beds)

### BookingStatus
- `PENDING` - Awaiting owner confirmation
- `CONFIRMED` - Confirmed by owner
- `CHECKED_IN` - Tenant has moved in
- `CHECKED_OUT` - Tenant has moved out
- `CANCELLED` - Booking cancelled

### BedStatus
- `AVAILABLE` - Bed is available
- `OCCUPIED` - Bed is occupied
- `RESERVED` - Bed is reserved
- `MAINTENANCE` - Bed under maintenance

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-01T12:00:00"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. **Inquiry Endpoints**: The backend has an `Inquiry` entity but no REST controller. Frontend has a placeholder UI that will show errors if used.

2. **Pagination**: All paginated endpoints return the same structure with `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, and `last`.

3. **JWT Token**: Tokens expire after 24 hours (configurable in backend). Frontend automatically redirects to login on 401/403 errors.

4. **Demo Accounts**:
   - Owner: `owner@test.com` / `password123`
   - User: `user@test.com` / `password123`