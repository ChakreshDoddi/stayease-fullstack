package com.stayease.controller;

import com.stayease.dto.response.ApiResponse;
import com.stayease.dto.response.PagedResponse;
import com.stayease.dto.response.PropertyResponse;
import com.stayease.dto.response.RoomResponse;
import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;
import com.stayease.service.PropertyService;
import com.stayease.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {
    
    private final PropertyService propertyService;
    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PropertyResponse> response = propertyService.getAllProperties(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(@PathVariable Long id) {
        PropertyResponse response = propertyService.getPropertyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getPropertyRooms(@PathVariable Long id) {
        List<RoomResponse> response = roomService.getRoomsByPropertyId(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/rooms/available")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAvailableRooms(@PathVariable Long id) {
        List<RoomResponse> response = roomService.getAvailableRoomsByPropertyId(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getFeaturedProperties() {
        List<PropertyResponse> response = propertyService.getFeaturedProperties();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<String>>> getAllCities() {
        List<String> response = propertyService.getAllCities();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) GenderPreference genderPreference,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) Integer availableBeds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponse<PropertyResponse> response = propertyService.searchProperties(
            city, propertyType, genderPreference, minRent, maxRent, availableBeds, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search/keyword")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> searchByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PropertyResponse> response = propertyService.searchByKeyword(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}