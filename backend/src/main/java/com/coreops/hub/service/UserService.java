package com.coreops.hub.service;

import com.coreops.hub.model.User;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private static final List<User> USERS = Arrays.asList(
        new User("designer1", "password123", "designer"),
        new User("viewer1", "password123", "viewer")
    );
    
    public Optional<User> findByUsername(String username) {
        return USERS.stream()
            .filter(user -> user.getUsername().equals(username))
            .findFirst();
    }
    
    public boolean validatePassword(User user, String password) {
        return user.getPassword().equals(password);
    }
}
