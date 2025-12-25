package com.stayease.dto.request;

import com.stayease.enums.GenderPreference;
import com.stayease.enums.PropertyType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyRequest {
    
    @NotBlank(message = "Property name is required")
    @Size(max = 100, message = "Property name must not exceed 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @NotNull(message = "Gender preference is required")
    private GenderPreference genderPreference;

    @NotBlank(message = "Address is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @NotNull(message = "Minimum rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum rent must be greater than 0")
    private BigDecimal minRent;

    @NotNull(message = "Maximum rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum rent must be greater than 0")
    private BigDecimal maxRent;

    private BigDecimal securityDeposit;
    
    private Integer noticePeriodDays = 30;

    private Set<Long> amenityIds;
    
    private List<String> imageUrls;
}