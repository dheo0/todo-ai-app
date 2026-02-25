package com.example.todoapp.domain.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        int expiresIn,
        String userId,
        String email
) {}
