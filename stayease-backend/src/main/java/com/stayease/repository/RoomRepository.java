package com.stayease.repository;

import com.stayease.entity.Room;
import com.stayease.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByPropertyIdAndIsActiveTrue(Long propertyId);
    
    List<Room> findByPropertyId(Long propertyId);
    
    Optional<Room> findByPropertyIdAndRoomNumber(Long propertyId, String roomNumber);
    
    boolean existsByPropertyIdAndRoomNumber(Long propertyId, String roomNumber);
    
    @Query("SELECT r FROM Room r WHERE r.property.id = :propertyId AND r.availableBeds > 0 AND r.isActive = true")
    List<Room> findAvailableRoomsByPropertyId(@Param("propertyId") Long propertyId);
    
    @Query("SELECT SUM(r.totalBeds) FROM Room r WHERE r.property.id = :propertyId")
    Integer getTotalBedsByPropertyId(@Param("propertyId") Long propertyId);
    
    @Query("SELECT SUM(r.availableBeds) FROM Room r WHERE r.property.id = :propertyId")
    Integer getAvailableBedsByPropertyId(@Param("propertyId") Long propertyId);
    
    long countByPropertyId(Long propertyId);
}