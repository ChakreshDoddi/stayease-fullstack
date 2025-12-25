package com.stayease.config;

import com.stayease.entity.Amenity;
import com.stayease.entity.OwnerProfile;
import com.stayease.entity.User;
import com.stayease.enums.Role;
import com.stayease.repository.AmenityRepository;
import com.stayease.repository.OwnerProfileRepository;
import com.stayease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initializeAmenities();
        initializeTestUsers();
    }

    private void initializeAmenities() {
        if (amenityRepository.count() > 0) {
            log.info("Amenities already initialized");
            return;
        }

        List<Amenity> amenities = Arrays.asList(
            createAmenity("WiFi", "wifi", "BASIC"),
            createAmenity("AC", "snowflake", "COMFORT"),
            createAmenity("Hot Water", "fire", "BASIC"),
            createAmenity("Laundry", "shirt", "UTILITY"),
            createAmenity("Parking", "car", "UTILITY"),
            createAmenity("Food Included", "utensils", "FOOD"),
            createAmenity("Power Backup", "zap", "UTILITY"),
            createAmenity("CCTV", "video", "SECURITY"),
            createAmenity("Security Guard", "shield", "SECURITY"),
            createAmenity("Gym", "dumbbell", "COMFORT"),
            createAmenity("TV", "tv", "COMFORT"),
            createAmenity("Refrigerator", "box", "COMFORT"),
            createAmenity("Housekeeping", "home", "UTILITY"),
            createAmenity("Study Table", "book-open", "BASIC"),
            createAmenity("Wardrobe", "archive", "BASIC"),
            createAmenity("Attached Bathroom", "droplet", "BASIC"),
            createAmenity("Balcony", "sun", "COMFORT"),
            createAmenity("Lift", "arrow-up", "UTILITY")
        );

        amenityRepository.saveAll(amenities);
        log.info("Initialized {} amenities", amenities.size());
    }

    private Amenity createAmenity(String name, String icon, String category) {
        return Amenity.builder()
            .name(name)
            .icon(icon)
            .category(category)
            .build();
    }

    private void initializeTestUsers() {
        // Create test user
        if (!userRepository.existsByEmail("user@test.com")) {
            User testUser = User.builder()
                .email("user@test.com")
                .password(passwordEncoder.encode("password123"))
                .firstName("Test")
                .lastName("User")
                .phone("9876543210")
                .role(Role.USER)
                .isActive(true)
                .isVerified(true)
                .build();
            userRepository.save(testUser);
            log.info("Created test user: user@test.com / password123");
        }

        // Create test owner
        if (!userRepository.existsByEmail("owner@test.com")) {
            User testOwner = User.builder()
                .email("owner@test.com")
                .password(passwordEncoder.encode("password123"))
                .firstName("Test")
                .lastName("Owner")
                .phone("9876543211")
                .role(Role.OWNER)
                .isActive(true)
                .isVerified(true)
                .build();
            User savedOwner = userRepository.save(testOwner);

            OwnerProfile ownerProfile = OwnerProfile.builder()
                .user(savedOwner)
                .businessName("Test PG Properties")
                .city("Bangalore")
                .state("Karnataka")
                .build();
            ownerProfileRepository.save(ownerProfile);
            
            log.info("Created test owner: owner@test.com / password123");
        }

        // Create admin
        if (!userRepository.existsByEmail("admin@test.com")) {
            User admin = User.builder()
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .phone("9876543212")
                .role(Role.ADMIN)
                .isActive(true)
                .isVerified(true)
                .build();
            userRepository.save(admin);
            log.info("Created admin: admin@test.com / admin123");
        }
    }
}