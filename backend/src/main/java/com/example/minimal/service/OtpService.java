package com.example.minimal.service;

import com.example.minimal.exception.AppException;
import com.example.minimal.model.Otp;
import com.example.minimal.model.Otp.OtpPurpose;
import com.example.minimal.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int OTP_EXPIRATION_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void generateAndSendOtp(String email, OtpPurpose purpose) {
        String normalizedEmail = email.toLowerCase().trim();

        // 1. Check cooldown on latest OTP
        Optional<Otp> latestOtp = otpRepository.findTopByEmailIgnoreCaseAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                normalizedEmail, purpose);

        if (latestOtp.isPresent()) {
            LocalDateTime createdAt = latestOtp.get().getCreatedAt();
            if (createdAt != null && createdAt.plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(LocalDateTime.now())) {
                throw new AppException("Please wait before requesting a new OTP. A cooldown is active.", HttpStatus.TOO_MANY_REQUESTS);
            }
        }

        // 2. Invalidate previous active OTPs
        List<Otp> previousOtps = otpRepository.findAllByEmailIgnoreCaseAndPurposeAndVerifiedFalse(normalizedEmail, purpose);
        for (Otp old : previousOtps) {
            old.setVerified(true); // Mark invalidated so they cannot be reused
        }
        otpRepository.saveAll(previousOtps);

        // 3. Generate secure 6-digit numeric OTP
        int numericOtp = 100000 + secureRandom.nextInt(900000);
        String plainOtp = String.valueOf(numericOtp);

        // 4. Save new OTP record (hashed)
        Otp newOtp = Otp.builder()
                .email(normalizedEmail)
                .otp(passwordEncoder.encode(plainOtp))
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES))
                .verified(false)
                .attemptCount(0)
                .build();

        otpRepository.save(newOtp);

        // 5. Send Email based on purpose
        if (purpose == OtpPurpose.ACCOUNT_VERIFICATION) {
            emailService.sendVerificationOtp(normalizedEmail, plainOtp);
        } else if (purpose == OtpPurpose.PASSWORD_RESET) {
            emailService.sendPasswordResetOtp(normalizedEmail, plainOtp);
        }
    }

    @Transactional
    public void verifyOtp(String email, String plainOtp, OtpPurpose purpose) {
        String normalizedEmail = email.toLowerCase().trim();

        Otp otpRecord = otpRepository.findTopByEmailIgnoreCaseAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                normalizedEmail, purpose
        ).orElseThrow(() -> new AppException("No valid OTP request found. Please request a new OTP.", HttpStatus.BAD_REQUEST));

        // Check expiration
        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException("OTP has expired. Please request a new one.", HttpStatus.BAD_REQUEST);
        }

        // Check max attempts
        if (otpRecord.getAttemptCount() >= MAX_ATTEMPTS) {
            otpRecord.setVerified(true); // Invalidate due to too many failed attempts
            otpRepository.save(otpRecord);
            throw new AppException("Too many failed attempts. This OTP is now invalid. Please request a new one.", HttpStatus.BAD_REQUEST);
        }

        // Verify matches
        if (!passwordEncoder.matches(plainOtp, otpRecord.getOtp())) {
            otpRecord.setAttemptCount(otpRecord.getAttemptCount() + 1);
            otpRepository.save(otpRecord);
            int remaining = MAX_ATTEMPTS - otpRecord.getAttemptCount();
            throw new AppException(String.format("Invalid OTP. %d attempt(s) remaining.", remaining), HttpStatus.BAD_REQUEST);
        }

        // Mark verified
        otpRecord.setVerified(true);
        otpRepository.save(otpRecord);
    }

    @Transactional
    public void invalidateOtpState(String email, OtpPurpose purpose) {
        String normalizedEmail = email.toLowerCase().trim();
        List<Otp> otps = otpRepository.findAllByEmailIgnoreCaseAndPurposeAndVerifiedFalse(normalizedEmail, purpose);
        for (Otp o : otps) {
            o.setVerified(true);
        }
        otpRepository.saveAll(otps);
    }
}