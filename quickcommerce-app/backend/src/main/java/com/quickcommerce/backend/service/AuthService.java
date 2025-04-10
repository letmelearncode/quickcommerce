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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID; // Import UUID

@Service
public class AuthService {

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
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
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

        return savedUser;
    }

    public SignInResponse authenticateUser(SignInRequest signInRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signInRequest.getEmail(),
                        signInRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Pass username (email) directly
        String jwt = tokenProvider.generateToken(authentication.getName()); 
        return new SignInResponse(jwt);
    }

    @Transactional // Needed because we might save a new user
    public SignInResponse loginOrRegisterGoogleUser(GoogleTokenRequest googleTokenRequest) 
            throws GeneralSecurityException, IOException, IllegalArgumentException {
        
        String idTokenString = googleTokenRequest.getToken();
        
        // 1. Verify Google Token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleClientId))
            .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
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
            throw new IllegalArgumentException("Google account email not verified or unavailable.");
        }

        // 3. Find or Create User
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            // User exists, log them in
            user = userOptional.get();
            System.out.println("Found existing user via Google Sign-In: " + email);
        } else {
            // User does not exist, create a new user
            System.out.println("Creating new user via Google Sign-In: " + email);
            user = new User();
            user.setEmail(email);
            user.setName(name != null ? name : "Google User"); // Use name from Google or a default
            // Set an unusable placeholder password to satisfy NOT NULL constraint
            String placeholderPassword = UUID.randomUUID().toString(); 
            user.setPassword(passwordEncoder.encode(placeholderPassword)); 
            // Roles could be assigned here if needed
            user = userRepository.save(user);
        }

        // 4. Generate Application JWT
        // Pass username (email) directly
        String jwt = tokenProvider.generateToken(user.getEmail()); 

        return new SignInResponse(jwt);
    }
    
    // Helper method for registration password (if needed for Google users)
    // private String generateRandomPassword() { ... }
} 