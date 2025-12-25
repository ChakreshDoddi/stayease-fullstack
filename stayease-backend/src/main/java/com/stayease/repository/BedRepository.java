package com.stayease.repository;

import com.stayease.entity.Bed;
import com.stayease.enums.BedStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    
    List<Bed> findByRoomId(Long roomId);
    
    List<Bed> findByRoomIdAndStatus(Long roomId, BedStatus status);
    
    Optional<Bed> findByRoomIdAndBedNumber(Long roomId, String bedNumber);
    
    boolean existsByRoomIdAndBedNumber(Long roomId, String bedNumber);
    
    @Query("SELECT COUNT(b) FROM Bed b WHERE b.room.id = :roomId AND b.status = :status")
    long countByRoomIdAndStatus(@Param("roomId") Long roomId, @Param("status") BedStatus status);
    
    @Query("SELECT b FROM Bed b WHERE b.room.property.id = :propertyId AND b.status = 'AVAILABLE'")
    List<Bed> findAvailableBedsByPropertyId(@Param("propertyId") Long propertyId);
}