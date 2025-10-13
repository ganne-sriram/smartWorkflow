package com.coreops.hub.config;

import com.coreops.hub.model.User;
import com.coreops.hub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing default users...");
        
        if (userRepository.count() == 0) {
            createDefaultUser("designer1", "password123", "designer1@coreops.com", "DESIGNER");
            createDefaultUser("viewer1", "password123", "viewer1@coreops.com", "VIEWER");
            createDefaultUser("admin", "password123", "admin@coreops.com", "ADMIN");
            
            logger.info("Default users created successfully");
        } else {
            logger.info("Users already exist, skipping initialization");
        }
    }
    
    private void createDefaultUser(String username, String password, String email, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        user.setEnabled(true);
        userRepository.save(user);
        logger.info("Created user: {}", username);
    }
}
