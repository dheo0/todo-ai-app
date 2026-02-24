package com.example.todoapp.domain.todo.dto;

import jakarta.validation.constraints.NotBlank;

public record TodoCreateRequest(
        @NotBlank String title
) {}
