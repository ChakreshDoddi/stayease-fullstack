package com.stayease.dto.response;

import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {
    
    private Long id;
    private String name;
    private String description;
    private PropertyType propertyType;
    private GenderPreference genderPreference;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String fullAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal minRent;
    private BigDecimal maxRent;
    private BigDecimal securityDeposit;
    private Integer noticePeriodDays;
    private Integer totalRooms;
    private Integer totalBeds;
    private Integer availableBeds;
    private BigDecimal avgRating;
    private Integer totalReviews;
    private Boolean isVerified;
    private Boolean isFeatured;
    private List<String> images;
    private String primaryImage;
    private Set<String> amenities;
    private OwnerSummary owner;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerSummary {
        private Long id;
        private String name;
        private String phone;
        private String businessName;
    }
}