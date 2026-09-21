package com.example.minimal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateUserRequest {
    private Long id;
    private String firstName;
    private String lastName;
    private String role; // "user" or "admin"
    private Boolean blocked;
    private Boolean emailVerified;
    private String phoneNumber;
    private String shippingAddress;
    private String avatar;
}
