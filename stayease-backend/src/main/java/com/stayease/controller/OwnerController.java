package com.stayease.controller;

import com.stayease.dto.request.PropertyRequest;
import com.stayease.dto.request.RoomRequest;
import com.stayease.dto.response.*;
import com.stayease.enums.BookingStatus;
import com.stayease.security.CustomUserDetails;
import com.stayease.service.BookingService;
import com.stayease.service.PropertyService;
import com.stayease.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@PreAuthorize("hasRole('OWNER')")
@RequiredArgsConstructor
public class OwnerController {
    
    private final PropertyService propertyService;
    private final RoomService roomService;
    private final BookingService bookingService;

    // ==================== PROPERTY ENDPOINTS ====================

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getMyProperties(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PropertyResponse> response = propertyService.getPropertiesByOwner(
            userDetails.getId(), page, size
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/properties")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PropertyRequest request) {
        PropertyResponse response = propertyService.createProperty(request, userDetails.getId());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Property created successfully", response));
    }

    @PutMapping("/properties/{propertyId}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long propertyId,
            @Valid @RequestBody PropertyRequest request) {
        PropertyResponse response = propertyService.updateProperty(propertyId, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Property updated successfully", response));
    }

    @DeleteMapping("/properties/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long propertyId) {
        propertyService.deleteProperty(propertyId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Property deleted successfully", null));
    }

    @PatchMapping("/properties/{propertyId}/status")
    public ResponseEntity<ApiResponse<Void>> togglePropertyStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long propertyId,
            @RequestParam boolean isActive) {
        propertyService.togglePropertyStatus(propertyId, userDetails.getId(), isActive);
        String message = isActive ? "Property activated" : "Property deactivated";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    // ==================== ROOM ENDPOINTS ====================

    @GetMapping("/properties/{propertyId}/rooms")
    public ResponseEntity<ApiResponse<java.util.List<RoomResponse>>> getPropertyRooms(
            @PathVariable Long propertyId) {
        java.util.List<RoomResponse> response = roomService.getRoomsByPropertyId(propertyId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/properties/{propertyId}/rooms")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long propertyId,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.createRoom(propertyId, request, userDetails.getId());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Room created successfully", response));
    }

    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long roomId,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.updateRoom(roomId, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", response));
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long roomId) {
        roomService.deleteRoom(roomId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }

    @PatchMapping("/rooms/{roomId}/status")
    public ResponseEntity<ApiResponse<Void>> toggleRoomStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long roomId,
            @RequestParam boolean isActive) {
        roomService.toggleRoomStatus(roomId, userDetails.getId(), isActive);
        String message = isActive ? "Room activated" : "Room deactivated";
        return ResponseEntity.ok(ApiResponse.success(message, null));
    }

    // ==================== BOOKING ENDPOINTS ====================

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<BookingResponse> response = bookingService.getOwnerBookings(
            userDetails.getId(), status, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingDetails(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId) {
        BookingResponse response = bookingService.getBookingById(bookingId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        BookingResponse response = bookingService.updateBookingStatus(
            bookingId, status, userDetails.getId()
        );
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
    }
}