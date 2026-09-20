package com.example.minimal;

import com.example.minimal.dto.*;
import com.example.minimal.model.User;
import com.example.minimal.repository.UserRepository;
import com.example.minimal.security.JwtService;
import com.example.minimal.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class AuthControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        userRepository.deleteAll();
    }

    @Test
    void testRegisterEndpoint_ValidRequest_ReturnsCreated() throws Exception {
        String jsonRequest = "{\"firstName\":\"Alice\",\"lastName\":\"Wonder\",\"email\":\"alice@example.com\",\"password\":\"Password123!\",\"confirmPassword\":\"Password123!\"}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testRegisterEndpoint_WeakPassword_ReturnsBadRequest() throws Exception {
        String jsonRequest = "{\"firstName\":\"Alice\",\"lastName\":\"Wonder\",\"email\":\"alice@example.com\",\"password\":\"weak\",\"confirmPassword\":\"weak\"}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testProtectedEndpoint_WithoutJwt_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testProtectedEndpoint_WithValidJwt_ReturnsUser() throws Exception {
        User user = User.builder()
                .firstName("Bob")
                .lastName("Builder")
                .email("bob@example.com")
                .password(passwordEncoder.encode("Password123!"))
                .emailVerified(true)
                .role(com.example.minimal.model.Role.user)
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("bob@example.com"))
                .andExpect(jsonPath("$.data.firstName").value("Bob"));
    }

    @Test
    void testProtectedEndpoint_WithInvalidJwt_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }
}
