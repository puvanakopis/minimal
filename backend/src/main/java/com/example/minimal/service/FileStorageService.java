package com.example.minimal.service;

import com.example.minimal.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads/products";
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "webp", "gif", "svg", "jfif", "avif"
    );

    public String storeFile(MultipartFile file) {
        return storeFile(file, "products");
    }

    public String storeAvatar(MultipartFile file) {
        return storeFile(file, "avatars");
    }

    public String storeFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            throw new AppException("Failed to store empty file. Please choose an image.", HttpStatus.BAD_REQUEST);
        }

        String directory = (subDir == null || subDir.trim().isEmpty()) ? "products" : subDir.trim();

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        String contentType = file.getContentType();
        boolean isImageMime = contentType != null && contentType.toLowerCase().startsWith("image/");
        boolean isAllowedExt = !extension.isEmpty() && ALLOWED_EXTENSIONS.contains(extension);

        if (!isImageMime && !isAllowedExt) {
            throw new AppException("Invalid file type. Only image files (JPG, PNG, WEBP, GIF, SVG, AVIF) are allowed.", HttpStatus.BAD_REQUEST);
        }

        try {
            Path uploadPath = Paths.get("uploads", directory).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID().toString() + (extension.isEmpty() ? ".jpg" : "." + extension);
            Path targetLocation = uploadPath.resolve(filename);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("File successfully uploaded to {}: {}", directory, filename);
            return "/uploads/" + directory + "/" + filename;
        } catch (IOException ex) {
            log.error("Could not store file in {}", directory, ex);
            throw new AppException("Could not store image file. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
