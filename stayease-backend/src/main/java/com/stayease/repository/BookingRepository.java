package com.stayease.repository;

import com.stayease.entity.Booking;
import com.stayease.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    
    Page<Booking> findByPropertyId(Long propertyId, Pageable pageable);
    
    Page<Booking> findByPropertyOwnerId(Long ownerId, Pageable pageable);
    
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    
    List<Booking> findByPropertyIdAndStatus(Long propertyId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.property.owner.id = :ownerId " +
           "AND (:status IS NULL OR b.status = :status)")
    Page<Booking> findByOwnerIdAndStatus(
        @Param("ownerId") Long ownerId,
        @Param("status") BookingStatus status,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.property.owner.id = :ownerId AND b.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") BookingStatus status);
    
    boolean existsByBedIdAndStatusIn(Long bedId, List<BookingStatus> statuses);
    
    @Query("SELECT b FROM Booking b WHERE b.checkInDate <= :date AND " +
           "(b.checkOutDate IS NULL OR b.checkOutDate >= :date) AND b.status = 'CHECKED_IN'")
    List<Booking> findActiveBookingsOnDate(@Param("date") LocalDate date);
}