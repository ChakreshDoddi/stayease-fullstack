package com.stayease.service;

import com.stayease.dto.request.BookingRequest;
import com.stayease.dto.response.BookingResponse;
import com.stayease.dto.response.PagedResponse;
import com.stayease.enums.BookingStatus;

public interface BookingService {
    
    BookingResponse createBooking(BookingRequest request, Long userId);
    
    BookingResponse getBookingById(Long bookingId, Long userId);
    
    BookingResponse getBookingByReference(String reference);
    
    PagedResponse<BookingResponse> getUserBookings(Long userId, int page, int size);
    
    PagedResponse<BookingResponse> getOwnerBookings(Long ownerId, BookingStatus status, int page, int size);
    
    BookingResponse updateBookingStatus(Long bookingId, BookingStatus status, Long userId);
    
    void cancelBooking(Long bookingId, Long userId);
}