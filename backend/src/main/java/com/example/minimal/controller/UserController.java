package com.example.minimal.controller;

import com.example.minimal.dto.AdminUpdateUserRequest;
import com.example.minimal.dto.ApiResponse;
import com.example.minimal.dto.ChangePasswordRequest;
import com.example.minimal.dto.DeleteAccountRequest;
import com.example.minimal.dto.UpdateProfileRequest;
import com.example.minimal.dto.UserDto;
import com.example.minimal.service.FileStorageService;
import com.example.minimal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    // ==========================================
    // USER PROFILE & AVATAR ENDPOINTS
    // ==========================================

    @GetMapping("/api/user/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        UserDto userDto = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDto));
    }

    @PutMapping("/api/user/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        UserDto updatedUser = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @PostMapping("/api/user/upload-avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            Authentication authentication,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
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

    @PutMapping({"/api/user/change-password", "/api/user/password"})
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        userService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully"));
    }

    @PostMapping({"/api/user/delete-account", "/api/user/account/delete"})
    public ResponseEntity<ApiResponse<Void>> deleteAccountPost(
            Authentication authentication,
            @RequestBody(required = false) DeleteAccountRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        userService.deleteAccount(email, request);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully"));
    }

    @DeleteMapping({"/api/user/account", "/api/user/profile", "/api/user/me"})
    public ResponseEntity<ApiResponse<Void>> deleteAccount(
            Authentication authentication,
            @RequestBody(required = false) DeleteAccountRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthenticated"));
        }
        String email = authentication.getName();
        userService.deleteAccount(email, request);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully"));
    }

    // ==========================================
    // ADMIN USER MANAGEMENT ENDPOINTS
    // ==========================================

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsersAdmin();
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }

    @GetMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable("id") Long id) {
        UserDto user = userService.getUserByIdAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", user));
    }

    @PutMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable("id") Long id,
            @RequestBody AdminUpdateUserRequest request,
            Authentication authentication) {
        String currentAdminEmail = authentication != null ? authentication.getName() : null;
        UserDto updated = userService.updateUserAdmin(id, request, currentAdminEmail);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @PutMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserWithoutPathId(
            @RequestBody AdminUpdateUserRequest request,
            Authentication authentication) {
        if (request.getId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User ID is required"));
        }
        String currentAdminEmail = authentication != null ? authentication.getName() : null;
        UserDto updated = userService.updateUserAdmin(request.getId(), request, currentAdminEmail);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @PutMapping("/api/admin/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<UserDto>> toggleBlockUser(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, Boolean> body,
            @RequestParam(value = "blocked", required = false) Boolean blockedParam,
            Authentication authentication) {
        Boolean blocked = blockedParam;
        if (blocked == null && body != null && body.containsKey("blocked")) {
            blocked = body.get("blocked");
        }

        String currentAdminEmail = authentication != null ? authentication.getName() : null;
        UserDto updated = userService.toggleBlockUserAdmin(id, blocked, currentAdminEmail);
        String msg = updated.isBlocked() ? "User blocked successfully" : "User unblocked successfully";
        return ResponseEntity.ok(ApiResponse.success(msg, updated));
    }

    @PatchMapping("/api/admin/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<UserDto>> patchBlockUser(
            @PathVariable("id") Long id,
            @RequestBody(required = false) Map<String, Boolean> body,
            @RequestParam(value = "blocked", required = false) Boolean blockedParam,
            Authentication authentication) {
        return toggleBlockUser(id, body, blockedParam, authentication);
    }

    @DeleteMapping("/api/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(
            @PathVariable("id") Long id,
            Authentication authentication) {
        String currentAdminEmail = authentication != null ? authentication.getName() : null;
        userService.deleteUserAdmin(id, currentAdminEmail);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @DeleteMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteUserByParam(
            @RequestParam("id") Long id,
            Authentication authentication) {
        String currentAdminEmail = authentication != null ? authentication.getName() : null;
        userService.deleteUserAdmin(id, currentAdminEmail);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
