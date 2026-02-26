package com.example.todoapp.domain.todo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record TodoUpdateRequest(
        @Schema(description = "수정할 제목") String title,
        @Schema(description = "완료 여부") Boolean completed
) {}
