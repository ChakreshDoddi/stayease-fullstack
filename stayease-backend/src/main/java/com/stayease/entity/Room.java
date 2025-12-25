package com.stayease.entity;

import com.stayease.enums.BedStatus;
import com.stayease.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "room_number", nullable = false, length = 20)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "floor_number")
    private Integer floorNumber = 0;

    @Column(name = "total_beds", nullable = false)
    private Integer totalBeds;

    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds;

    @Column(name = "rent_per_bed", nullable = false, precision = 10, scale = 2)
    private BigDecimal rentPerBed;

    @Column(name = "has_attached_bathroom")
    private Boolean hasAttachedBathroom = false;

    @Column(name = "has_ac")
    private Boolean hasAc = false;

    @Column(name = "has_balcony")
    private Boolean hasBalcony = false;

    @Column(name = "room_size_sqft")
    private Integer roomSizeSqft;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Bed> beds = new ArrayList<>();

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    // Helper methods
    public void recalculateAvailableBeds() {
        this.availableBeds = (int) beds.stream()
            .filter(bed -> bed.getStatus() == BedStatus.AVAILABLE)
            .count();
    }
}