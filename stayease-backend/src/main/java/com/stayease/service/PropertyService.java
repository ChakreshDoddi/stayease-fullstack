package com.stayease.service;

import com.stayease.dto.request.PropertyRequest;
import com.stayease.dto.response.PagedResponse;
import com.stayease.dto.response.PropertyResponse;
import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    
    PropertyResponse createProperty(PropertyRequest request, Long ownerId);
    
    PropertyResponse updateProperty(Long propertyId, PropertyRequest request, Long ownerId);
    
    PropertyResponse getPropertyById(Long propertyId);
    
    PagedResponse<PropertyResponse> getAllProperties(int page, int size);
    
    PagedResponse<PropertyResponse> getPropertiesByOwner(Long ownerId, int page, int size);
    
    PagedResponse<PropertyResponse> searchProperties(
        String city,
        PropertyType propertyType,
        GenderPreference genderPreference,
        BigDecimal minRent,
        BigDecimal maxRent,
        Integer availableBeds,
        int page,
        int size
    );
    
    PagedResponse<PropertyResponse> searchByKeyword(String keyword, int page, int size);
    
    List<PropertyResponse> getFeaturedProperties();
    
    List<String> getAllCities();
    
    void deleteProperty(Long propertyId, Long ownerId);
    
    void togglePropertyStatus(Long propertyId, Long ownerId, boolean isActive);
}