package com.example.todoapp.domain.todo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Todo(
        String id,
        @JsonProperty("user_id") String userId,
        String title,
        boolean completed,
        @JsonProperty("created_at") String createdAt,
        @JsonProperty("updated_at") String updatedAt
) {}
