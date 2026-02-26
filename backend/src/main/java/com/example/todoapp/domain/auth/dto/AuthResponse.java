package com.example.todoapp.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "인증 응답")
public record AuthResponse(
        @Schema(description = "JWT 액세스 토큰") String accessToken,
        @Schema(description = "토큰 타입", example = "bearer") String tokenType,
        @Schema(description = "만료 시간 (초)", example = "3600") int expiresIn,
        @Schema(description = "사용자 UUID") String userId,
        @Schema(description = "이메일", example = "user@example.com") String email,
        @Schema(description = "이메일 인증 필요 여부", example = "false") boolean needsEmailConfirmation
) {}
