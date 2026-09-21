package com.example.minimal.service;

import com.example.minimal.dto.UpdateProfileRequest;
import com.example.minimal.dto.UserDto;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.User;
import com.example.minimal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }

        if (request.getShippingAddress() != null) {
            user.setShippingAddress(request.getShippingAddress().trim());
        }

        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar().trim());
        }

        User savedUser = userRepository.save(user);
        log.info("User profile updated successfully for user ID: {}", savedUser.getId());

        return UserDto.fromEntity(savedUser);
    }

    // ==========================================
    // ADMIN USER MANAGEMENT METHODS
    // ==========================================

    @Transactional(readOnly = true)
    public java.util.List<UserDto> getAllUsersAdmin() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserByIdAdmin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateUserAdmin(Long id, com.example.minimal.dto.AdminUpdateUserRequest request, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }

        if (request.getShippingAddress() != null) {
            user.setShippingAddress(request.getShippingAddress().trim());
        }

        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar().trim());
        }

        if (request.getEmailVerified() != null) {
            user.setEmailVerified(request.getEmailVerified());
        }

        if (request.getRole() != null) {
            if (isSelf && !user.getRole().name().equalsIgnoreCase(request.getRole())) {
                throw new AppException("You cannot change your own admin role", HttpStatus.BAD_REQUEST);
            }
            try {
                user.setRole(User.Role.valueOf(request.getRole().toLowerCase()));
            } catch (IllegalArgumentException e) {
                throw new AppException("Invalid role: " + request.getRole(), HttpStatus.BAD_REQUEST);
            }
        }

        if (request.getBlocked() != null) {
            if (isSelf && request.getBlocked()) {
                throw new AppException("You cannot block your own account", HttpStatus.BAD_REQUEST);
            }
            user.setBlocked(request.getBlocked());
        }

        User savedUser = userRepository.save(user);
        log.info("Admin updated user ID: {}", savedUser.getId());
        return UserDto.fromEntity(savedUser);
    }

    @Transactional
    public UserDto toggleBlockUserAdmin(Long id, Boolean blocked, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());

        boolean newBlockedStatus = blocked != null ? blocked : !user.isBlocked();

        if (isSelf && newBlockedStatus) {
            throw new AppException("You cannot block your own account", HttpStatus.BAD_REQUEST);
        }

        user.setBlocked(newBlockedStatus);
        User savedUser = userRepository.save(user);
        log.info("Admin changed blocked status for user ID: {} to {}", savedUser.getId(), newBlockedStatus);
        return UserDto.fromEntity(savedUser);
    }

    @Transactional
    public void deleteUserAdmin(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));

        if (currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail())) {
            throw new AppException("You cannot delete your own account", HttpStatus.BAD_REQUEST);
        }

        userRepository.delete(user);
        log.info("Admin deleted user ID: {}", id);
    }
}
