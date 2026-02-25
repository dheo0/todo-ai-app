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
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAll(
            @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getAll(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getById(
            @PathVariable String id,
            @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getById(id, userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> create(
            @Valid @RequestBody TodoCreateRequest request,
            @RequestAttribute("userId") String userId) {
        return ResponseEntity.status(201).body(ApiResponse.ok(todoService.create(request, userId)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> update(
            @PathVariable String id,
            @RequestBody TodoUpdateRequest request,
            @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.update(id, request, userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @RequestAttribute("userId") String userId) {
        todoService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
