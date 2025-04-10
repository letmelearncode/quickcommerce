package com.quickcommerce.backend.security;

import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList; // Use this for empty authorities list for now
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> 
                        new UsernameNotFoundException("User not found with email : " + email)
                );

        return new UserPrincipal(user);
    }

    // Used by JWTAuthenticationFilter
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new UsernameNotFoundException("User not found with id : " + id)
        );
        return new UserPrincipal(user);
    }
    
    /**
     * Custom UserDetails implementation that wraps a User entity
     */
    public static class UserPrincipal implements UserDetails {
        private final User user;
        
        public UserPrincipal(User user) {
            this.user = user;
        }
        
        // This is the property referenced by @AuthenticationPrincipal(expression = "user")
        public User getUser() {
            return user;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return new ArrayList<>(); // Empty authorities for now
        }
        
        @Override
        public String getPassword() {
            return user.getPassword();
        }
        
        @Override
        public String getUsername() {
            return user.getEmail();
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return true;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
        
        @Override
        public boolean isEnabled() {
            return true;
        }
    }
} 