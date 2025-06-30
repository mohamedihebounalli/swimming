package com.example.swimming_courses.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // désactiver CSRF pour les tests
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // autoriser toutes les requêtes
                )
                .httpBasic(Customizer.withDefaults()); // optionnel : permet les appels simples sans authentification

        return http.build();
    }
}
