package com.example.todoapp.domain.todo.controller;

import com.example.todoapp.domain.todo.dto.TodoCreateRequest;
import com.example.todoapp.domain.todo.dto.TodoResponse;
import com.example.todoapp.domain.todo.dto.TodoUpdateRequest;
import com.example.todoapp.domain.todo.service.TodoService;
import com.example.todoapp.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> create(@Valid @RequestBody TodoCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.ok(todoService.create(request)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> update(
            @PathVariable String id,
            @RequestBody TodoUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
