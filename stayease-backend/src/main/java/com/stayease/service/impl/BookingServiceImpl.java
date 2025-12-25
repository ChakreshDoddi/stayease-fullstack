package com.stayease.service.impl;

import com.stayease.dto.request.BookingRequest;
import com.stayease.dto.response.BookingResponse;
import com.stayease.dto.response.PagedResponse;
import com.stayease.entity.*;
import com.stayease.enums.BedStatus;
import com.stayease.enums.BookingStatus;
import com.stayease.exception.BadRequestException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.*;
import com.stayease.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final OwnerProfileRepository ownerProfileRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get property
        Property property = propertyRepository.findById(request.getPropertyId())
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        // Get room
        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));

        // Verify room belongs to property
        if (!room.getProperty().getId().equals(property.getId())) {
            throw new BadRequestException("Room does not belong to the specified property");
        }

        // Get bed
        Bed bed = bedRepository.findById(request.getBedId())
            .orElseThrow(() -> new ResourceNotFoundException("Bed", "id", request.getBedId()));

        // Verify bed belongs to room
        if (!bed.getRoom().getId().equals(room.getId())) {
            throw new BadRequestException("Bed does not belong to the specified room");
        }

        // Check if bed is available
        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new BadRequestException("Bed is not available for booking");
        }

        // Check for existing active bookings
        List<BookingStatus> activeStatuses = Arrays.asList(
            BookingStatus.PENDING, 
            BookingStatus.CONFIRMED, 
            BookingStatus.CHECKED_IN
        );
        if (bookingRepository.existsByBedIdAndStatusIn(bed.getId(), activeStatuses)) {
            throw new BadRequestException("Bed already has an active booking");
        }

        // Generate booking reference
        String bookingReference = generateBookingReference();

        // Create booking
        Booking booking = Booking.builder()
            .bookingReference(bookingReference)
            .user(user)
            .property(property)
            .room(room)
            .bed(bed)
            .checkInDate(request.getCheckInDate())
            .checkOutDate(request.getCheckOutDate())
            .monthlyRent(room.getRentPerBed())
            .securityDeposit(property.getSecurityDeposit())
            .status(BookingStatus.PENDING)
            .notes(request.getNotes())
            .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Update bed status to reserved
        bed.setStatus(BedStatus.RESERVED);
        bedRepository.save(bed);

        // Update room available beds count
        room.recalculateAvailableBeds();
        roomRepository.save(room);

        // Update property available beds count
        property.recalculateBedCounts();
        propertyRepository.save(property);

        return mapToBookingResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check if user is the booking owner or property owner
        boolean isBookingOwner = booking.getUser().getId().equals(userId);
        boolean isPropertyOwner = booking.getProperty().getOwner().getUser().getId().equals(userId);

        if (!isBookingOwner && !isPropertyOwner) {
            throw new BadRequestException("You don't have permission to view this booking");
        }

        return mapToBookingResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "reference", reference));
        return mapToBookingResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getUserBookings(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findByUserId(userId, pageable);
        return mapToPagedResponse(bookingPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getOwnerBookings(Long userId, BookingStatus status, int page, int size) {
        OwnerProfile owner = ownerProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookingPage = bookingRepository.findByOwnerIdAndStatus(owner.getId(), status, pageable);
        return mapToPagedResponse(bookingPage);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Verify ownership (only property owner can update status)
        if (!booking.getProperty().getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this booking");
        }

        BookingStatus currentStatus = booking.getStatus();
        Bed bed = booking.getBed();
        Room room = booking.getRoom();
        Property property = booking.getProperty();

        // Validate status transition
        validateStatusTransition(currentStatus, newStatus);

        // Update bed status based on booking status
        switch (newStatus) {
            case CONFIRMED:
                bed.setStatus(BedStatus.RESERVED);
                break;
            case CHECKED_IN:
                bed.setStatus(BedStatus.OCCUPIED);
                bed.setCurrentTenant(booking.getUser());
                bed.setOccupiedFrom(booking.getCheckInDate());
                bed.setExpectedCheckout(booking.getCheckOutDate());
                break;
            case CHECKED_OUT:
            case CANCELLED:
                bed.setStatus(BedStatus.AVAILABLE);
                bed.setCurrentTenant(null);
                bed.setOccupiedFrom(null);
                bed.setExpectedCheckout(null);
                break;
            default:
                break;
        }

        bedRepository.save(bed);
        
        // Recalculate counts
        room.recalculateAvailableBeds();
        roomRepository.save(room);
        
        property.recalculateBedCounts();
        propertyRepository.save(property);

        booking.setStatus(newStatus);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(updatedBooking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Check if user is booking owner or property owner
        boolean isBookingOwner = booking.getUser().getId().equals(userId);
        boolean isPropertyOwner = booking.getProperty().getOwner().getUser().getId().equals(userId);

        if (!isBookingOwner && !isPropertyOwner) {
            throw new BadRequestException("You don't have permission to cancel this booking");
        }

        // Can only cancel pending or confirmed bookings
        if (booking.getStatus() != BookingStatus.PENDING && 
            booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel booking with status: " + booking.getStatus());
        }

        // Update bed status
        Bed bed = booking.getBed();
        bed.setStatus(BedStatus.AVAILABLE);
        bed.setCurrentTenant(null);
        bedRepository.save(bed);

        // Update room counts
        Room room = booking.getRoom();
        room.recalculateAvailableBeds();
        roomRepository.save(room);

        // Update property counts
        Property property = booking.getProperty();
        property.recalculateBedCounts();
        propertyRepository.save(property);

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private void validateStatusTransition(BookingStatus current, BookingStatus newStatus) {
        switch (current) {
            case PENDING:
                if (newStatus != BookingStatus.CONFIRMED && newStatus != BookingStatus.CANCELLED) {
                    throw new BadRequestException("Invalid status transition from PENDING to " + newStatus);
                }
                break;
            case CONFIRMED:
                if (newStatus != BookingStatus.CHECKED_IN && newStatus != BookingStatus.CANCELLED) {
                    throw new BadRequestException("Invalid status transition from CONFIRMED to " + newStatus);
                }
                break;
            case CHECKED_IN:
                if (newStatus != BookingStatus.CHECKED_OUT) {
                    throw new BadRequestException("Invalid status transition from CHECKED_IN to " + newStatus);
                }
                break;
            case CHECKED_OUT:
            case CANCELLED:
                throw new BadRequestException("Cannot change status of " + current + " booking");
            default:
                throw new BadRequestException("Unknown booking status: " + current);
        }
    }

    private String generateBookingReference() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.valueOf((int) (Math.random() * 10000));
        return "BK" + timestamp + random;
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
            .id(booking.getId())
            .bookingReference(booking.getBookingReference())
            .userId(booking.getUser().getId())
            .userName(booking.getUser().getFullName())
            .propertyId(booking.getProperty().getId())
            .propertyName(booking.getProperty().getName())
            .roomId(booking.getRoom().getId())
            .roomNumber(booking.getRoom().getRoomNumber())
            .bedId(booking.getBed().getId())
            .bedNumber(booking.getBed().getBedNumber())
            .checkInDate(booking.getCheckInDate())
            .checkOutDate(booking.getCheckOutDate())
            .monthlyRent(booking.getMonthlyRent())
            .securityDeposit(booking.getSecurityDeposit())
            .status(booking.getStatus())
            .notes(booking.getNotes())
            .createdAt(booking.getCreatedAt())
            .build();
    }

    private PagedResponse<BookingResponse> mapToPagedResponse(Page<Booking> page) {
        List<BookingResponse> content = page.getContent().stream()
            .map(this::mapToBookingResponse)
            .collect(Collectors.toList());

        return PagedResponse.<BookingResponse>builder()
            .content(content)
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .last(page.isLast())
            .first(page.isFirst())
            .build();
    }
}