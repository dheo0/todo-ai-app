package com.example.todoapp.domain.todo.dto;

import com.example.todoapp.domain.todo.entity.Todo;

public record TodoResponse(
        String id,
        String title,
        boolean completed,
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
