package com.example.minimal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

@SpringBootApplication
public class MinimalApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(MinimalApplication.class, args);
	}

	private static void loadDotEnv() {
		File envFile = new File(".env");
		if (!envFile.exists()) {
			envFile = new File("backend/.env");
		}
		if (envFile.exists()) {
			try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
				String line;
				while ((line = reader.readLine()) != null) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					int equalIndex = line.indexOf('=');
					if (equalIndex > 0) {
						String key = line.substring(0, equalIndex).trim();
						String value = line.substring(equalIndex + 1).trim();
						if ((value.startsWith("\"") && value.endsWith("\"")) ||
								(value.startsWith("'") && value.endsWith("'"))) {
							if (value.length() >= 2) {
								value = value.substring(1, value.length() - 1);
							}
						}
						if (System.getProperty(key) == null && System.getenv(key) == null) {
							System.setProperty(key, value);
						}
					}
				}
			} catch (Exception ignored) {
			}
		}
	}

}
