package com.example.todoapp.domain.todo.controller;

import com.example.todoapp.domain.todo.dto.TodoCreateRequest;
import com.example.todoapp.domain.todo.dto.TodoResponse;
import com.example.todoapp.domain.todo.dto.TodoUpdateRequest;
import com.example.todoapp.domain.todo.service.TodoService;
import com.example.todoapp.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Todo", description = "Todo CRUD API (JWT 인증 필요)")
@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @Operation(summary = "Todo 전체 조회", description = "로그인한 사용자의 Todo 목록을 반환합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAll(
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getAll(userId)));
    }

    @Operation(summary = "Todo 단건 조회")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "존재하지 않는 Todo")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> getById(
            @PathVariable String id,
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getById(id, userId)));
    }

    @Operation(summary = "Todo 생성")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "유효하지 않은 요청")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> create(
            @Valid @RequestBody TodoCreateRequest request,
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.status(201).body(ApiResponse.ok(todoService.create(request, userId)));
    }

    @Operation(summary = "Todo 수정 (부분)")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> update(
            @PathVariable String id,
            @RequestBody TodoUpdateRequest request,
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.update(id, request, userId)));
    }

    @Operation(summary = "Todo 삭제")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제 성공")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        todoService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
