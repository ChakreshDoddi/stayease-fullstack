package com.stayease.repository;

import com.stayease.entity.Property;
import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    // Find by owner
    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);
    
    List<Property> findByOwnerIdAndIsActiveTrue(Long ownerId);
    
    // Find active properties
    Page<Property> findByIsActiveTrue(Pageable pageable);
    
    // Find featured properties
    List<Property> findByIsFeaturedTrueAndIsActiveTrue();
    
    // Search by city
    Page<Property> findByCityIgnoreCaseAndIsActiveTrue(String city, Pageable pageable);
    
    // Search with filters
    @Query("SELECT p FROM Property p WHERE p.isActive = true " +
           "AND (:city IS NULL OR LOWER(p.city) = LOWER(:city)) " +
           "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
           "AND (:genderPreference IS NULL OR p.genderPreference = :genderPreference) " +
           "AND (:minRent IS NULL OR p.minRent >= :minRent) " +
           "AND (:maxRent IS NULL OR p.maxRent <= :maxRent) " +
           "AND (:availableBeds IS NULL OR p.availableBeds >= :availableBeds)")
    Page<Property> searchProperties(
        @Param("city") String city,
        @Param("propertyType") PropertyType propertyType,
        @Param("genderPreference") GenderPreference genderPreference,
        @Param("minRent") BigDecimal minRent,
        @Param("maxRent") BigDecimal maxRent,
        @Param("availableBeds") Integer availableBeds,
        Pageable pageable
    );
    
    // Search by keyword
    @Query("SELECT p FROM Property p WHERE p.isActive = true " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Property> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    // Count by owner
    long countByOwnerId(Long ownerId);
    
    // Get distinct cities
    @Query("SELECT DISTINCT p.city FROM Property p WHERE p.isActive = true ORDER BY p.city")
    List<String> findDistinctCities();
}