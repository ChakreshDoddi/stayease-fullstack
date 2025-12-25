package com.stayease.repository;

import com.stayease.entity.Inquiry;
import com.stayease.enums.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    
    Page<Inquiry> findByPropertyId(Long propertyId, Pageable pageable);
    
    List<Inquiry> findByPropertyIdAndStatus(Long propertyId, InquiryStatus status);
    
    @Query("SELECT i FROM Inquiry i WHERE i.property.owner.id = :ownerId")
    Page<Inquiry> findByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);
    
    @Query("SELECT COUNT(i) FROM Inquiry i WHERE i.property.owner.id = :ownerId AND i.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") InquiryStatus status);
}