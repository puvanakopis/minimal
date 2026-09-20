package com.example.minimal.controller;

import com.example.minimal.dto.ApiResponse;
import com.example.minimal.dto.UpdateProfileRequest;
import com.example.minimal.dto.UserDto;
import com.example.minimal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.minimal.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        UserDto userDto = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDto));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        UserDto updatedUser = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            Authentication authentication,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }

        MultipartFile targetFile = file != null ? file : (image != null ? image : avatar);
        if (targetFile == null || targetFile.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please provide a valid image file."));
        }

        String avatarUrl = fileStorageService.storeAvatar(targetFile);
        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", avatarUrl);
        response.put("imageUrl", avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", response));
    }
}
