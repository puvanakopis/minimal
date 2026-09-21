package com.example.minimal.security;

import com.example.minimal.model.User;
import com.example.minimal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        User.Role role = user.getRole() != null ? user.getRole() : User.Role.user;
        String authority = "ROLE_" + role.name().toUpperCase();

        boolean enabled = user.isEmailVerified() && !user.isBlocked();
        boolean accountNonLocked = !user.isBlocked();

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                enabled,
                true,
                true,
                accountNonLocked,
                Collections.singletonList(new SimpleGrantedAuthority(authority))
        );
    }
}
