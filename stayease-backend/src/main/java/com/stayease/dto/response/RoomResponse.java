package com.stayease.dto.response;

import com.stayease.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    
    private Long id;
    private Long propertyId;
    private String roomNumber;
    private RoomType roomType;
    private Integer floorNumber;
    private Integer totalBeds;
    private Integer availableBeds;
    private BigDecimal rentPerBed;
    private Boolean hasAttachedBathroom;
    private Boolean hasAc;
    private Boolean hasBalcony;
    private Integer roomSizeSqft;
    private String description;
    private Boolean isActive;
    private List<BedResponse> beds;
}