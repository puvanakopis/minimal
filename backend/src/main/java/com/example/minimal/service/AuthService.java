package com.example.minimal.service;

import com.example.minimal.dto.*;
import com.example.minimal.exception.AppException;
import com.example.minimal.model.OtpPurpose;
import com.example.minimal.model.User;
import com.example.minimal.repository.UserRepository;
import com.example.minimal.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        String email = request.getEmail().toLowerCase().trim();
        Optional<User> existingUserOpt = userRepository.findByEmailIgnoreCase(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.isEmailVerified()) {
                throw new AppException("An account with this email already exists", HttpStatus.CONFLICT);
            } else {
                // Update unverified user details and password
                existingUser.setFirstName(request.getFirstName().trim());
                existingUser.setLastName(request.getLastName().trim());
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(existingUser);
            }
        } else {
            User newUser = User.builder()
                    .firstName(request.getFirstName().trim())
                    .lastName(request.getLastName().trim())
                    .email(email)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .emailVerified(false)
                    .role("ROLE_USER")
                    .build();
            userRepository.save(newUser);
        }

        // Generate and send verification OTP
        otpService.generateAndSendOtp(email, OtpPurpose.ACCOUNT_VERIFICATION);
    }

    @Transactional
    public UserDto verifyEmail(VerifyEmailRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (user.isEmailVerified()) {
            return UserDto.fromEntity(user);
        }

        otpService.verifyOtp(email, request.getOtp(), OtpPurpose.ACCOUNT_VERIFICATION);

        user.setEmailVerified(true);
        User savedUser = userRepository.save(user);

        return UserDto.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!user.isEmailVerified()) {
            throw new AppException("Your email is not verified. Please verify your email first.", HttpStatus.FORBIDDEN);
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.of(token, UserDto.fromEntity(user));
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent() && userOpt.get().isEmailVerified()) {
            otpService.generateAndSendOtp(email, OtpPurpose.PASSWORD_RESET);
        } else {
            log.info("Password reset requested for non-existent or unverified email: {}", email);
        }
    }

    @Transactional
    public String verifyResetOtp(VerifyResetOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("Invalid request", HttpStatus.BAD_REQUEST));

        otpService.verifyOtp(email, request.getOtp(), OtpPurpose.PASSWORD_RESET);

        return jwtService.generatePasswordResetToken(email);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        String email = request.getEmail().toLowerCase().trim();

        if (!jwtService.validatePasswordResetToken(request.getResetToken(), email)) {
            throw new AppException("Invalid or expired password reset session. Please restart the reset process.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpService.invalidateOtpState(email, OtpPurpose.PASSWORD_RESET);
    }

    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (request.getPurpose() == OtpPurpose.ACCOUNT_VERIFICATION) {
            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
            if (user.isEmailVerified()) {
                throw new AppException("Account is already verified. Please sign in.", HttpStatus.BAD_REQUEST);
            }
        } else if (request.getPurpose() == OtpPurpose.PASSWORD_RESET) {
            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
            if (!user.isEmailVerified()) {
                throw new AppException("Account is not verified.", HttpStatus.BAD_REQUEST);
            }
        }

        otpService.generateAndSendOtp(email, request.getPurpose());
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return UserDto.fromEntity(user);
    }
}
