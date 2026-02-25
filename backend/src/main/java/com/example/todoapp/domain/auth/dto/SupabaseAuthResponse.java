package com.example.todoapp.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SupabaseAuthResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("token_type") String tokenType,
        @JsonProperty("expires_in") int expiresIn,
        @JsonProperty("refresh_token") String refreshToken,
        SupabaseUser user
) {}
