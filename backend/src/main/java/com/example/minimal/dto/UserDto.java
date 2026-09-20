package com.example.minimal.dto;

import com.example.minimal.model.User;
import com.example.minimal.model.User.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean emailVerified;
    private String role;
    private String phoneNumber;
    private String shippingAddress;
    private String avatar;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .role(user.getRole() != null ? user.getRole().name() : Role.user.name())
                .phoneNumber(user.getPhoneNumber())
                .shippingAddress(user.getShippingAddress())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
