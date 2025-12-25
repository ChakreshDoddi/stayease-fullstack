package com.stayease.service.impl;

import com.stayease.dto.request.RoomRequest;
import com.stayease.dto.response.BedResponse;
import com.stayease.dto.response.RoomResponse;
import com.stayease.entity.Bed;
import com.stayease.entity.Property;
import com.stayease.entity.Room;
import com.stayease.enums.BedStatus;
import com.stayease.exception.BadRequestException;
import com.stayease.exception.DuplicateResourceException;
import com.stayease.exception.ResourceNotFoundException;
import com.stayease.repository.BedRepository;
import com.stayease.repository.PropertyRepository;
import com.stayease.repository.RoomRepository;
import com.stayease.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    
    private final RoomRepository roomRepository;
    private final PropertyRepository propertyRepository;
    private final BedRepository bedRepository;

    @Override
    @Transactional
    public RoomResponse createRoom(Long propertyId, RoomRequest request, Long userId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        // Verify ownership
        if (!property.getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to add rooms to this property");
        }

        // Check for duplicate room number
        if (roomRepository.existsByPropertyIdAndRoomNumber(propertyId, request.getRoomNumber())) {
            throw new DuplicateResourceException("Room number already exists in this property");
        }

        Room room = Room.builder()
            .property(property)
            .roomNumber(request.getRoomNumber())
            .roomType(request.getRoomType())
            .floorNumber(request.getFloorNumber())
            .totalBeds(request.getTotalBeds())
            .availableBeds(request.getTotalBeds()) // Initially all beds are available
            .rentPerBed(request.getRentPerBed())
            .hasAttachedBathroom(request.getHasAttachedBathroom())
            .hasAc(request.getHasAc())
            .hasBalcony(request.getHasBalcony())
            .roomSizeSqft(request.getRoomSizeSqft())
            .description(request.getDescription())
            .isActive(true)
            .build();

        Room savedRoom = roomRepository.save(room);

        // Create beds for the room
        List<Bed> beds = new ArrayList<>();
        for (int i = 1; i <= request.getTotalBeds(); i++) {
            Bed bed = Bed.builder()
                .room(savedRoom)
                .bedNumber("B" + i)
                .status(BedStatus.AVAILABLE)
                .build();
            beds.add(bed);
        }
        bedRepository.saveAll(beds);

        // Update property bed counts
        property.recalculateBedCounts();
        propertyRepository.save(property);

        return mapToRoomResponse(savedRoom);
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Long roomId, RoomRequest request, Long userId) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

        // Verify ownership
        if (!room.getProperty().getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this room");
        }

        // Check for duplicate room number if changed
        if (!room.getRoomNumber().equals(request.getRoomNumber()) &&
            roomRepository.existsByPropertyIdAndRoomNumber(room.getProperty().getId(), request.getRoomNumber())) {
            throw new DuplicateResourceException("Room number already exists in this property");
        }

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloorNumber(request.getFloorNumber());
        room.setRentPerBed(request.getRentPerBed());
        room.setHasAttachedBathroom(request.getHasAttachedBathroom());
        room.setHasAc(request.getHasAc());
        room.setHasBalcony(request.getHasBalcony());
        room.setRoomSizeSqft(request.getRoomSizeSqft());
        room.setDescription(request.getDescription());

        // Handle bed count changes
        int currentBeds = room.getTotalBeds();
        int newBeds = request.getTotalBeds();
        
        if (newBeds > currentBeds) {
            // Add new beds
            for (int i = currentBeds + 1; i <= newBeds; i++) {
                Bed bed = Bed.builder()
                    .room(room)
                    .bedNumber("B" + i)
                    .status(BedStatus.AVAILABLE)
                    .build();
                bedRepository.save(bed);
            }
            room.setTotalBeds(newBeds);
            room.setAvailableBeds(room.getAvailableBeds() + (newBeds - currentBeds));
        }
        // Note: We don't reduce beds to avoid data loss. This should be handled carefully in production.

        Room updatedRoom = roomRepository.save(room);

        // Update property bed counts
        Property property = room.getProperty();
        property.recalculateBedCounts();
        propertyRepository.save(property);

        return mapToRoomResponse(updatedRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        return mapToRoomResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByPropertyId(Long propertyId) {
        return roomRepository.findByPropertyId(propertyId).stream()
            .map(this::mapToRoomResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRoomsByPropertyId(Long propertyId) {
        return roomRepository.findAvailableRoomsByPropertyId(propertyId).stream()
            .map(this::mapToRoomResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

        if (!room.getProperty().getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this room");
        }

        // Check if any beds are occupied
        long occupiedBeds = bedRepository.countByRoomIdAndStatus(roomId, BedStatus.OCCUPIED);
        if (occupiedBeds > 0) {
            throw new BadRequestException("Cannot delete room with occupied beds");
        }

        Property property = room.getProperty();
        roomRepository.delete(room);

        // Update property counts
        property.recalculateBedCounts();
        propertyRepository.save(property);
    }

    @Override
    @Transactional
    public void toggleRoomStatus(Long roomId, Long userId, boolean isActive) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));

        if (!room.getProperty().getOwner().getUser().getId().equals(userId)) {
            throw new BadRequestException("You don't have permission to update this room");
        }

        room.setIsActive(isActive);
        roomRepository.save(room);

        // Update property counts
        Property property = room.getProperty();
        property.recalculateBedCounts();
        propertyRepository.save(property);
    }

    private RoomResponse mapToRoomResponse(Room room) {
        List<Bed> beds = bedRepository.findByRoomId(room.getId());
        List<BedResponse> bedResponses = beds.stream()
            .map(this::mapToBedResponse)
            .collect(Collectors.toList());

        return RoomResponse.builder()
            .id(room.getId())
            .propertyId(room.getProperty().getId())
            .roomNumber(room.getRoomNumber())
            .roomType(room.getRoomType())
            .floorNumber(room.getFloorNumber())
            .totalBeds(room.getTotalBeds())
            .availableBeds(room.getAvailableBeds())
            .rentPerBed(room.getRentPerBed())
            .hasAttachedBathroom(room.getHasAttachedBathroom())
            .hasAc(room.getHasAc())
            .hasBalcony(room.getHasBalcony())
            .roomSizeSqft(room.getRoomSizeSqft())
            .description(room.getDescription())
            .isActive(room.getIsActive())
            .beds(bedResponses)
            .build();
    }

    private BedResponse mapToBedResponse(Bed bed) {
        return BedResponse.builder()
            .id(bed.getId())
            .bedNumber(bed.getBedNumber())
            .status(bed.getStatus())
            .occupiedFrom(bed.getOccupiedFrom())
            .expectedCheckout(bed.getExpectedCheckout())
            .build();
    }
}