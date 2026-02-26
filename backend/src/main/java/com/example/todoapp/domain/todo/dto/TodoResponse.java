package com.example.todoapp.domain.todo.dto;

import com.example.todoapp.domain.todo.entity.Todo;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Todo 응답")
public record TodoResponse(
        @Schema(description = "Todo ID (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
        String id,
        @Schema(description = "할 일 제목", example = "장보기")
        String title,
        @Schema(description = "완료 여부", example = "false")
        boolean completed,
        @Schema(description = "생성 시각 (ISO 8601)", example = "2024-01-15T10:30:00Z")
        String createdAt
) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
                todo.id(),
                todo.title(),
                todo.completed(),
                todo.createdAt()
        );
    }
}
