package com.stayease.service.impl;

import com.stayease.dto.request.PropertyRequest;
import com.stayease.dto.response.PagedResponse;
import com.stayease.dto.response.PropertyResponse;
import com.stayease.entity.*;
import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;
import com.stayease.exception.BadRequestException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.*;
import com.stayease.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
    
    private final PropertyRepository propertyRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final AmenityRepository amenityRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final UserRepository userRepository;

    @Override
@Transactional
public PropertyResponse createProperty(PropertyRequest request, Long userId) {
    OwnerProfile owner = ownerProfileRepository.findByUserId(userId)
        .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found"));

    Property property = Property.builder()
        .owner(owner)
        .name(request.getName())
        .description(request.getDescription())
        .propertyType(request.getPropertyType())
        .genderPreference(request.getGenderPreference())
        .addressLine1(request.getAddressLine1())
        .addressLine2(request.getAddressLine2())
        .city(request.getCity())
        .state(request.getState())
        .pincode(request.getPincode())
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .minRent(request.getMinRent())
        .maxRent(request.getMaxRent())
        .securityDeposit(request.getSecurityDeposit())
        .noticePeriodDays(request.getNoticePeriodDays() != null ? request.getNoticePeriodDays() : 30)
        .isActive(true)
        .isVerified(false)
        .isFeatured(false)
        .totalRooms(0)
        .totalBeds(0)
        .availableBeds(0)
        .build();

    // Add amenities
    if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
        Set<Amenity> amenities = new HashSet<>(amenityRepository.findByIdIn(request.getAmenityIds()));
        property.setAmenities(amenities);
    }

    Property savedProperty = propertyRepository.save(property);

    // Add images
    if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
        for (int i = 0; i < request.getImageUrls().size(); i++) {
            PropertyImage image = PropertyImage.builder()
                .property(savedProperty)
                .imageUrl(request.getImageUrls().get(i))
                .isPrimary(i == 0)
                .displayOrder(i)
                .build();
            propertyImageRepository.save(image);
        }
    }

    // Update owner's property count (with null check)
    int currentCount = owner.getTotalProperties() != null ? owner.getTotalProperties() : 0;
    owner.setTotalProperties(currentCount + 1);
    ownerProfileRepository.save(owner);

    return mapToPropertyResponse(savedProperty);
}

    @Override
    @Transactional
    public PropertyResponse updateProperty(Long propertyId, PropertyRequest request, Long userId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        // Verify ownership
        if (!property.getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this property");
        }

        property.setName(request.getName());
        property.setDescription(request.getDescription());
        property.setPropertyType(request.getPropertyType());
        property.setGenderPreference(request.getGenderPreference());
        property.setAddressLine1(request.getAddressLine1());
        property.setAddressLine2(request.getAddressLine2());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setPincode(request.getPincode());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());
        property.setMinRent(request.getMinRent());
        property.setMaxRent(request.getMaxRent());
        property.setSecurityDeposit(request.getSecurityDeposit());
        property.setNoticePeriodDays(request.getNoticePeriodDays());

        // Update amenities
        if (request.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findByIdIn(request.getAmenityIds()));
            property.setAmenities(amenities);
        }

        Property updatedProperty = propertyRepository.save(property);
        return mapToPropertyResponse(updatedProperty);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
        return mapToPropertyResponse(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getAllProperties(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> propertyPage = propertyRepository.findByIsActiveTrue(pageable);
        return mapToPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getPropertiesByOwner(Long userId, int page, int size) {
        OwnerProfile owner = ownerProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner profile not found"));
            
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> propertyPage = propertyRepository.findByOwnerId(owner.getId(), pageable);
        return mapToPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> searchProperties(
            String city,
            PropertyType propertyType,
            GenderPreference genderPreference,
            BigDecimal minRent,
            BigDecimal maxRent,
            Integer availableBeds,
            int page,
            int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> propertyPage = propertyRepository.searchProperties(
            city, propertyType, genderPreference, minRent, maxRent, availableBeds, pageable
        );
        return mapToPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> searchByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> propertyPage = propertyRepository.searchByKeyword(keyword, pageable);
        return mapToPagedResponse(propertyPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> getFeaturedProperties() {
        return propertyRepository.findByIsFeaturedTrueAndIsActiveTrue()
            .stream()
            .map(this::mapToPropertyResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCities() {
        return propertyRepository.findDistinctCities();
    }

    @Override
    @Transactional
    public void deleteProperty(Long propertyId, Long userId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this property");
        }

        // Soft delete - just mark as inactive
        property.setIsActive(false);
        propertyRepository.save(property);

        // Update owner's property count
        OwnerProfile owner = property.getOwner();
        owner.setTotalProperties(Math.max(0, owner.getTotalProperties() - 1));
        ownerProfileRepository.save(owner);
    }

    @Override
    @Transactional
    public void togglePropertyStatus(Long propertyId, Long userId, boolean isActive) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (!property.getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this property");
        }

        property.setIsActive(isActive);
        propertyRepository.save(property);
    }

    private PropertyResponse mapToPropertyResponse(Property property) {
        List<PropertyImage> images = propertyImageRepository
            .findByPropertyIdOrderByDisplayOrderAsc(property.getId());
        
        String primaryImage = images.stream()
            .filter(PropertyImage::getIsPrimary)
            .map(PropertyImage::getImageUrl)
            .findFirst()
            .orElse(images.isEmpty() ? null : images.get(0).getImageUrl());

        List<String> imageUrls = images.stream()
            .map(PropertyImage::getImageUrl)
            .collect(Collectors.toList());

        Set<String> amenityNames = property.getAmenities().stream()
            .map(Amenity::getName)
            .collect(Collectors.toSet());

        User ownerUser = property.getOwner().getUser();

        return PropertyResponse.builder()
            .id(property.getId())
            .name(property.getName())
            .description(property.getDescription())
            .propertyType(property.getPropertyType())
            .genderPreference(property.getGenderPreference())
            .addressLine1(property.getAddressLine1())
            .addressLine2(property.getAddressLine2())
            .city(property.getCity())
            .state(property.getState())
            .pincode(property.getPincode())
            .fullAddress(property.getFullAddress())
            .latitude(property.getLatitude())
            .longitude(property.getLongitude())
            .minRent(property.getMinRent())
            .maxRent(property.getMaxRent())
            .securityDeposit(property.getSecurityDeposit())
            .noticePeriodDays(property.getNoticePeriodDays())
            .totalRooms(property.getTotalRooms())
            .totalBeds(property.getTotalBeds())
            .availableBeds(property.getAvailableBeds())
            .avgRating(property.getAvgRating())
            .totalReviews(property.getTotalReviews())
            .isVerified(property.getIsVerified())
            .isFeatured(property.getIsFeatured())
            .images(imageUrls)
            .primaryImage(primaryImage)
            .amenities(amenityNames)
            .owner(PropertyResponse.OwnerSummary.builder()
                .id(property.getOwner().getId())
                .name(ownerUser.getFullName())
                .phone(ownerUser.getPhone())
                .businessName(property.getOwner().getBusinessName())
                .build())
            .createdAt(property.getCreatedAt())
            .build();
    }

    private PagedResponse<PropertyResponse> mapToPagedResponse(Page<Property> page) {
        List<PropertyResponse> content = page.getContent().stream()
            .map(this::mapToPropertyResponse)
            .collect(Collectors.toList());

        return PagedResponse.<PropertyResponse>builder()
            .content(content)
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .last(page.isLast())
            .first(page.isFirst())
            .build();
    }
}