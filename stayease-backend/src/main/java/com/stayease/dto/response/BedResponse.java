package com.stayease.dto.response;

import com.stayease.enums.BedStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BedResponse {
    
    private Long id;
    private String bedNumber;
    private BedStatus status;
    private LocalDate occupiedFrom;
    private LocalDate expectedCheckout;
}