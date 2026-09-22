package com.example.minimal;

import com.example.minimal.dto.AdminUpdateUserRequest;
import com.example.minimal.dto.LoginRequest;
import com.example.minimal.model.User;
import com.example.minimal.model.User.Role;
import com.example.minimal.repository.UserRepository;
import com.example.minimal.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String userToken;
    private String adminToken;
    private User regularUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        userRepository.deleteAll();

        regularUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .emailVerified(true)
                .role(Role.user)
                .blocked(false)
                .build();
        userRepository.save(regularUser);

        adminUser = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .emailVerified(true)
                .role(Role.admin)
                .blocked(false)
                .build();
        userRepository.save(adminUser);

        userToken = jwtService.generateToken(regularUser.getEmail());
        adminToken = jwtService.generateToken(adminUser.getEmail());
    }

    // ==========================================
    // USER PROFILE TESTS
    // ==========================================

    @Test
    void testGetProfile_Success() throws Exception {
        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("John"))
                .andExpect(jsonPath("$.data.lastName").value("Doe"));
    }

    @Test
    void testUpdateProfile_Success() throws Exception {
        String requestBody = "{\"firstName\":\"Johnny\",\"lastName\":\"Smith\",\"phoneNumber\":\"+1234567890\",\"shippingAddress\":\"123 Main St, Springfield\",\"avatar\":\"data:image/png;base64,sampleImageData\"}";

        mockMvc.perform(put("/api/user/profile")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Johnny"))
                .andExpect(jsonPath("$.data.lastName").value("Smith"))
                .andExpect(jsonPath("$.data.phoneNumber").value("+1234567890"))
                .andExpect(jsonPath("$.data.shippingAddress").value("123 Main St, Springfield"))
                .andExpect(jsonPath("$.data.avatar").value("data:image/png;base64,sampleImageData"));
    }

    @Test
    void testUpdateProfile_Unauthenticated() throws Exception {
        String requestBody = "{\"firstName\":\"Johnny\"}";

        mockMvc.perform(put("/api/user/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUploadAvatar_Success() throws Exception {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "dummy image content".getBytes()
        );

        mockMvc.perform(multipart("/api/user/upload-avatar")
                        .file(mockFile)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.avatarUrl").exists());
    }

    // ==========================================
    // ADMIN USER MANAGEMENT TESTS
    // ==========================================

    @Test
    void testGetAllUsers_AdminSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void testGetAllUsers_ForbiddenForRegularUser() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetUserById_Success() throws Exception {
        mockMvc.perform(get("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("john.doe@example.com"));
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        AdminUpdateUserRequest updateRequest = AdminUpdateUserRequest.builder()
                .firstName("UpdatedCustomer")
                .lastName("UpdatedLast")
                .role("admin")
                .phoneNumber("+1999999999")
                .shippingAddress("456 Admin St")
                .build();

        mockMvc.perform(put("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("UpdatedCustomer"))
                .andExpect(jsonPath("$.data.role").value("admin"))
                .andExpect(jsonPath("$.data.phoneNumber").value("+1999999999"));
    }

    @Test
    void testBlockUser_And_PreventLogin() throws Exception {
        // 1. Block regular user
        mockMvc.perform(put("/api/admin/users/" + regularUser.getId() + "/block")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"blocked\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.blocked").value(true));

        // 2. Attempt login as blocked user -> should be 403 Forbidden
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Your account has been blocked. Please contact support."));

        // 3. Unblock regular user
        mockMvc.perform(put("/api/admin/users/" + regularUser.getId() + "/block")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"blocked\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.blocked").value(false));

        // 4. Attempt login again -> should succeed
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    void testAdminCannotBlockThemselves() throws Exception {
        mockMvc.perform(put("/api/admin/users/" + adminUser.getId() + "/block")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"blocked\":true}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("You cannot block your own account"));
    }

    @Test
    void testAdminCannotDemoteThemselves() throws Exception {
        AdminUpdateUserRequest updateRequest = AdminUpdateUserRequest.builder()
                .role("user")
                .build();

        mockMvc.perform(put("/api/admin/users/" + adminUser.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("You cannot change your own admin role"));
    }

    @Test
    void testDeleteUser_Success_And_SelfDeletePrevented() throws Exception {
        // Self deletion rejected
        mockMvc.perform(delete("/api/admin/users/" + adminUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("You cannot delete your own account"));

        // Regular user deletion succeeds
        mockMvc.perform(delete("/api/admin/users/" + regularUser.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
