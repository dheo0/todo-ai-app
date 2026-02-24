package com.example.todoapp.domain.todo.dto;

public record TodoUpdateRequest(
        String title,
        Boolean completed
) {}
