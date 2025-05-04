package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.SignInRequest;
import com.quickcommerce.backend.dto.SignInResponse;
import com.quickcommerce.backend.dto.SignUpRequest;
import com.quickcommerce.backend.dto.GoogleTokenRequest;
import com.quickcommerce.backend.exception.EmailAlreadyExistsException;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.UserRepository;
import com.quickcommerce.backend.security.JwtTokenProvider;

// Google Imports
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory; // Using GsonFactory

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID; // Import UUID

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Value("${google.client.id}") // Inject Google Client ID from properties
    private String googleClientId;

    public User registerUser(SignUpRequest signUpRequest) {
        logger.debug("Processing user registration for email: {}", signUpRequest.getEmail());
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            logger.info("Registration failed: Email already exists: {}", signUpRequest.getEmail());
            throw new EmailAlreadyExistsException("Email Address already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        // Set default role later if needed
        // user.setRole(UserRole.CUSTOMER);

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: ID={}, Name={}, Email={}", 
                   savedUser.getId(), savedUser.getName(), savedUser.getEmail());

        return savedUser;
    }

    public SignInResponse authenticateUser(SignInRequest signInRequest) {
        logger.debug("Authentication attempt for email: {}", signInRequest.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signInRequest.getEmail(),
                            signInRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get authenticated user details
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication.getName());
            
            logger.info("User authenticated successfully: ID={}, Email={}", user.getId(), user.getEmail());
            
            // Return response with user details
            return new SignInResponse(
                jwt, 
                user.getEmail(), 
                user.getName(), 
                user.getRoles(), 
                user.getId()
            );
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}", signInRequest.getEmail(), e);
            throw e;
        }
    }

    @Transactional // Needed because we might save a new user
    public SignInResponse loginOrRegisterGoogleUser(GoogleTokenRequest googleTokenRequest) 
            throws GeneralSecurityException, IOException, IllegalArgumentException {
        
        logger.debug("Processing Google authentication");
        
        String idTokenString = googleTokenRequest.getToken();
        
        // 1. Verify Google Token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleClientId))
            .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            logger.warn("Invalid Google ID token provided");
            throw new IllegalArgumentException("Invalid Google ID token.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        // 2. Extract user info
        String userId = payload.getSubject(); // Google's unique ID for the user
        String email = payload.getEmail();
        boolean emailVerified = payload.getEmailVerified();
        String name = (String) payload.get("name");
        // String pictureUrl = (String) payload.get("picture"); // Can store if needed

        if (email == null || !emailVerified) {
            logger.warn("Google account email not verified or unavailable");
            throw new IllegalArgumentException("Google account email not verified or unavailable.");
        }

        logger.info("Google authentication - verified token for email: {}", email);

        // 3. Find or Create User
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            // User exists, log them in
            user = userOptional.get();
            logger.info("Found existing user via Google Sign-In: ID={}, Email={}", user.getId(), email);
        } else {
            // User does not exist, create a new user
            logger.info("Creating new user via Google Sign-In: {}", email);
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Google User"); // Use name from Google or a default
            // Set an unusable placeholder password to satisfy NOT NULL constraint
            String placeholderPassword = UUID.randomUUID().toString(); 
            user.setPassword(passwordEncoder.encode(placeholderPassword)); 
            // Add default customer role
            user.addRole("ROLE_CUSTOMER");
            user = userRepository.save(user);
            logger.info("New user created via Google Sign-In: ID={}, Email={}", user.getId(), email);
        }

        // 4. Generate Application JWT
        String jwt = tokenProvider.generateToken(user.getEmail()); 
        logger.info("JWT token generated for Google user: {}", email);

        // Return response with user details
        return new SignInResponse(
            jwt, 
            user.getEmail(), 
            user.getName(), 
            user.getRoles(), 
            user.getId()
        );
    }
    
    // Update user roles and save
    @Transactional
    public User updateUserRoles(User user) {
        logger.debug("Updating roles for user: ID={}, Email={}, Roles={}", 
                    user.getId(), user.getEmail(), user.getRoles());
        User updatedUser = userRepository.save(user);
        logger.info("Updated roles for user: ID={}, Roles={}", user.getId(), user.getRoles());
        return updatedUser;
    }
    
    // Helper method for registration password (if needed for Google users)
    // private String generateRandomPassword() { ... }
} 