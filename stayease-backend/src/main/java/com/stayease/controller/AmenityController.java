package com.stayease.controller;

import com.stayease.dto.response.ApiResponse;
import com.stayease.entity.Amenity;
import com.stayease.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amenities")
@RequiredArgsConstructor
public class AmenityController {
    
    private final AmenityRepository amenityRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Amenity>>> getAllAmenities() {
        List<Amenity> amenities = amenityRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(amenities));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Amenity>>> getAmenitiesByCategory(
            @PathVariable String category) {
        List<Amenity> amenities = amenityRepository.findByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(amenities));
    }
}