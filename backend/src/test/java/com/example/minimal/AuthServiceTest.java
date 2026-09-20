package com.example.minimal;

import com.example.minimal.dto.*;
import com.example.minimal.model.Otp;
import com.example.minimal.model.OtpPurpose;
import com.example.minimal.model.Role;
import com.example.minimal.model.User;
import com.example.minimal.repository.OtpRepository;
import com.example.minimal.repository.UserRepository;
import com.example.minimal.security.JwtService;
import com.example.minimal.service.AuthService;
import com.example.minimal.service.EmailService;
import com.example.minimal.service.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

        @Autowired
        private AuthService authService;

        @Autowired
        private OtpService otpService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private OtpRepository otpRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtService jwtService;

        @MockitoBean
        private EmailService emailService;

        @BeforeEach
        void setUp() {
                otpRepository.deleteAll();
                userRepository.deleteAll();
        }

        @Test
        void testRegister_Success() {
                RegisterRequest request = RegisterRequest.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password("Password123!")
                                .confirmPassword("Password123!")
                                .build();

                authService.register(request);

                User user = userRepository.findByEmailIgnoreCase("john@example.com").orElse(null);
                assertNotNull(user);
                assertEquals("John", user.getFirstName());
                assertEquals("Doe", user.getLastName());
                assertEquals(Role.user, user.getRole());
                assertFalse(user.isEmailVerified());
                assertTrue(passwordEncoder.matches("Password123!", user.getPassword()));

                Otp otp = otpRepository.findTopByEmailIgnoreCaseAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                                "john@example.com", OtpPurpose.ACCOUNT_VERIFICATION).orElse(null);
                assertNotNull(otp);
        }

        @Test
        void testRegister_PasswordMismatch_ThrowsException() {
                RegisterRequest request = RegisterRequest.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password("Password123!")
                                .confirmPassword("DifferentPassword123!")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.register(request));
        }

        @Test
        void testRegister_DuplicateEmail_Verified_ThrowsException() {
                User existingUser = User.builder()
                                .firstName("Jane")
                                .lastName("Doe")
                                .email("jane@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(true)
                                .role(Role.user)
                                .build();
                userRepository.save(existingUser);

                RegisterRequest request = RegisterRequest.builder()
                                .firstName("Jane")
                                .lastName("Smith")
                                .email("jane@example.com")
                                .password("Password123!")
                                .confirmPassword("Password123!")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.register(request));
        }

        @Test
        void testVerifyEmail_Success() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(false)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                Otp otp = Otp.builder()
                                .email("john@example.com")
                                .otp(passwordEncoder.encode("123456"))
                                .purpose(OtpPurpose.ACCOUNT_VERIFICATION)
                                .expiresAt(LocalDateTime.now().plusMinutes(10))
                                .verified(false)
                                .attemptCount(0)
                                .build();
                otpRepository.save(otp);

                VerifyEmailRequest request = VerifyEmailRequest.builder()
                                .email("john@example.com")
                                .otp("123456")
                                .build();

                UserDto userDto = authService.verifyEmail(request);
                assertTrue(userDto.isEmailVerified());

                User updatedUser = userRepository.findByEmailIgnoreCase("john@example.com").orElseThrow();
                assertTrue(updatedUser.isEmailVerified());
        }

        @Test
        void testVerifyEmail_IncorrectOtp_ThrowsException() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(false)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                Otp otp = Otp.builder()
                                .email("john@example.com")
                                .otp(passwordEncoder.encode("123456"))
                                .purpose(OtpPurpose.ACCOUNT_VERIFICATION)
                                .expiresAt(LocalDateTime.now().plusMinutes(10))
                                .verified(false)
                                .attemptCount(0)
                                .build();
                otpRepository.save(otp);

                VerifyEmailRequest request = VerifyEmailRequest.builder()
                                .email("john@example.com")
                                .otp("999999")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.verifyEmail(request));
        }

        @Test
        void testVerifyEmail_ExpiredOtp_ThrowsException() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(false)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                Otp otp = Otp.builder()
                                .email("john@example.com")
                                .otp(passwordEncoder.encode("123456"))
                                .purpose(OtpPurpose.ACCOUNT_VERIFICATION)
                                .expiresAt(LocalDateTime.now().minusMinutes(1))
                                .verified(false)
                                .attemptCount(0)
                                .build();
                otpRepository.save(otp);

                VerifyEmailRequest request = VerifyEmailRequest.builder()
                                .email("john@example.com")
                                .otp("123456")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.verifyEmail(request));
        }

        @Test
        void testLogin_Success() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(true)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                LoginRequest request = LoginRequest.builder()
                                .email("john@example.com")
                                .password("Password123!")
                                .build();

                AuthResponse response = authService.login(request);
                assertNotNull(response.getToken());
                assertEquals("john@example.com", response.getUser().getEmail());
        }

        @Test
        void testLogin_UnverifiedEmail_ThrowsException() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(false)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                LoginRequest request = LoginRequest.builder()
                                .email("john@example.com")
                                .password("Password123!")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.login(request));
        }

        @Test
        void testLogin_IncorrectPassword_ThrowsException() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("Password123!"))
                                .emailVerified(true)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                LoginRequest request = LoginRequest.builder()
                                .email("john@example.com")
                                .password("WrongPassword123!")
                                .build();

                assertThrows(RuntimeException.class, () -> authService.login(request));
        }

        @Test
        void testForgotPassword_And_ResetPassword_Flow() {
                User user = User.builder()
                                .firstName("John")
                                .lastName("Doe")
                                .email("john@example.com")
                                .password(passwordEncoder.encode("OldPassword123!"))
                                .emailVerified(true)
                                .role(Role.user)
                                .build();
                userRepository.save(user);

                // 1. Request forgot password
                authService.forgotPassword(ForgotPasswordRequest.builder().email("john@example.com").build());

                // Save deterministic OTP for testing
                Otp otp = Otp.builder()
                                .email("john@example.com")
                                .otp(passwordEncoder.encode("654321"))
                                .purpose(OtpPurpose.PASSWORD_RESET)
                                .expiresAt(LocalDateTime.now().plusMinutes(10))
                                .verified(false)
                                .attemptCount(0)
                                .build();
                otpRepository.save(otp);

                // 2. Verify OTP
                String resetToken = authService.verifyResetOtp(VerifyResetOtpRequest.builder()
                                .email("john@example.com")
                                .otp("654321")
                                .build());
                assertNotNull(resetToken);

                // 3. Reset Password
                authService.resetPassword(ResetPasswordRequest.builder()
                                .email("john@example.com")
                                .resetToken(resetToken)
                                .newPassword("NewPassword123!")
                                .confirmPassword("NewPassword123!")
                                .build());

                // 4. Verify user can log in with new password
                AuthResponse loginResponse = authService.login(LoginRequest.builder()
                                .email("john@example.com")
                                .password("NewPassword123!")
                                .build());
                assertNotNull(loginResponse.getToken());
        }
}
