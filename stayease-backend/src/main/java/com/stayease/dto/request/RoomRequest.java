package com.stayease.dto.request;

import com.stayease.enums.RoomType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    
    @NotBlank(message = "Room number is required")
    @Size(max = 20, message = "Room number must not exceed 20 characters")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    private Integer floorNumber = 0;

    @NotNull(message = "Total beds is required")
    @Min(value = 1, message = "Total beds must be at least 1")
    private Integer totalBeds;

    @NotNull(message = "Rent per bed is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent per bed must be greater than 0")
    private BigDecimal rentPerBed;

    private Boolean hasAttachedBathroom = false;
    private Boolean hasAc = false;
    private Boolean hasBalcony = false;
    private Integer roomSizeSqft;
    private String description;
}