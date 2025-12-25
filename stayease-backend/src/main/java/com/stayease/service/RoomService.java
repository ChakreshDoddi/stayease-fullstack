package com.stayease.service;

import com.stayease.dto.request.RoomRequest;
import com.stayease.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {
    
    RoomResponse createRoom(Long propertyId, RoomRequest request, Long ownerId);
    
    RoomResponse updateRoom(Long roomId, RoomRequest request, Long ownerId);
    
    RoomResponse getRoomById(Long roomId);
    
    List<RoomResponse> getRoomsByPropertyId(Long propertyId);
    
    List<RoomResponse> getAvailableRoomsByPropertyId(Long propertyId);
    
    void deleteRoom(Long roomId, Long ownerId);
    
    void toggleRoomStatus(Long roomId, Long ownerId, boolean isActive);
}