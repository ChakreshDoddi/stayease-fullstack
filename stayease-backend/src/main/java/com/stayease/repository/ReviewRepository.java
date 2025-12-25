package com.stayease.repository;

import com.stayease.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Page<Review> findByPropertyIdAndIsVisibleTrue(Long propertyId, Pageable pageable);
    
    Page<Review> findByUserId(Long userId, Pageable pageable);
    
    Optional<Review> findByUserIdAndPropertyId(Long userId, Long propertyId);
    
    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId AND r.isVisible = true")
    Double getAverageRatingByPropertyId(@Param("propertyId") Long propertyId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.property.id = :propertyId AND r.isVisible = true")
    long countByPropertyId(@Param("propertyId") Long propertyId);
}