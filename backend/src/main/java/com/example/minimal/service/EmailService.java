package com.example.minimal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@minimal.com}")
    private String mailFrom;

    public void sendVerificationOtp(String toEmail, String otp) {
        String subject = "Verify your account";
        String body = String.format(
                "Hello,\n\n" +
                "Thank you for registering with Minimal. Your verification code is:\n\n" +
                "    %s\n\n" +
                "This code will expire in 10 minutes.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The Minimal Team",
                otp
        );

        sendEmail(toEmail, subject, body);
    }

    public void sendPasswordResetOtp(String toEmail, String otp) {
        String subject = "Password reset OTP";
        String body = String.format(
                "Hello,\n\n" +
                "We received a request to reset your password. Your password reset code is:\n\n" +
                "    %s\n\n" +
                "This code will expire in 10 minutes.\n" +
                "If you did not request a password reset, please secure your account immediately.\n\n" +
                "Best regards,\n" +
                "The Minimal Team",
                otp
        );

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email successfully dispatched to {}", to);
        } catch (Exception e) {
            log.warn("Failed to send email to {} via SMTP: {}. In local/dev mode, ensure MAIL_USERNAME and MAIL_PASSWORD are configured.", to, e.getMessage());
        }
    }
}
