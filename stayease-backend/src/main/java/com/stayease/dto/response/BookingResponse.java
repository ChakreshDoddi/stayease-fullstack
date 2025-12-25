package com.stayease.dto.response;

import com.stayease.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    
    private Long id;
    private String bookingReference;
    private Long userId;
    private String userName;
    private Long propertyId;
    private String propertyName;
    private Long roomId;
    private String roomNumber;
    private Long bedId;
    private String bedNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal monthlyRent;
    private BigDecimal securityDeposit;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;
}