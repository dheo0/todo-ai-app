package com.example.todoapp.domain.todo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record TodoCreateRequest(
        @Schema(description = "할 일 제목", example = "장보기", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank String title
) {}
