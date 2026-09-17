package com.example.minimal.repository;

import com.example.minimal.model.Otp;
import com.example.minimal.model.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findTopByEmailIgnoreCaseAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
            String email, OtpPurpose purpose);

    Optional<Otp> findTopByEmailIgnoreCaseAndPurposeAndVerifiedTrueOrderByCreatedAtDesc(
            String email, OtpPurpose purpose);

    List<Otp> findAllByEmailIgnoreCaseAndPurposeAndVerifiedFalse(
            String email, OtpPurpose purpose);

    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiresAt < :now")
    void deleteExpiredOtps(@Param("now") LocalDateTime now);
}
