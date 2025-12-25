package com.stayease.repository;

import com.stayease.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    
    Optional<Amenity> findByName(String name);
    
    List<Amenity> findByCategory(String category);
    
    List<Amenity> findByIdIn(Set<Long> ids);
    
    boolean existsByName(String name);
}