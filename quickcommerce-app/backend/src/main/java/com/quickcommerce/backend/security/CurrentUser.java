package com.quickcommerce.backend.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

/**
 * Custom annotation to access the current authenticated user
 */
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : ((com.quickcommerce.backend.security.CustomUserDetailsService$UserPrincipal) #this).getUser()")
public @interface CurrentUser {
} 