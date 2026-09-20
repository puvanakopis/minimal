package com.example.minimal.repository;

import com.example.minimal.model.Otp;
import com.example.minimal.model.Otp.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findTopByEmailIgnoreCaseAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
            String email,
            OtpPurpose purpose
    );

    List<Otp> findAllByEmailIgnoreCaseAndPurposeAndVerifiedFalse(
            String email,
            OtpPurpose purpose
    );
}
