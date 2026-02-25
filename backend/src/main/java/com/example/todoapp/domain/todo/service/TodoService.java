package com.example.todoapp.domain.todo.service;

import com.example.todoapp.domain.todo.dto.TodoCreateRequest;
import com.example.todoapp.domain.todo.dto.TodoResponse;
import com.example.todoapp.domain.todo.dto.TodoUpdateRequest;
import com.example.todoapp.domain.todo.entity.Todo;
import com.example.todoapp.global.config.SupabaseProperties;
import com.example.todoapp.global.exception.TodoNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties;

    private String baseUrl() {
        return supabaseProperties.url() + "/rest/v1/todos";
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseProperties.serviceRoleKey());
        headers.set("Authorization", "Bearer " + supabaseProperties.serviceRoleKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public List<TodoResponse> getAll(String userId) {
        ResponseEntity<Todo[]> response = restTemplate.exchange(
                baseUrl() + "?user_id=eq." + userId + "&select=*",
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                Todo[].class
        );
        Todo[] todos = response.getBody();
        if (todos == null) return List.of();
        return Arrays.stream(todos).map(TodoResponse::from).toList();
    }

    public TodoResponse getById(String id, String userId) {
        ResponseEntity<Todo[]> response = restTemplate.exchange(
                baseUrl() + "?id=eq." + id + "&user_id=eq." + userId + "&select=*",
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                Todo[].class
        );
        Todo[] todos = response.getBody();
        if (todos == null || todos.length == 0) {
            throw new TodoNotFoundException(id);
        }
        return TodoResponse.from(todos[0]);
    }

    public TodoResponse create(TodoCreateRequest request, String userId) {
        HttpHeaders headers = headers();
        headers.set("Prefer", "return=representation");

        Map<String, Object> body = new HashMap<>();
        body.put("title", request.title());
        body.put("user_id", userId);

        ResponseEntity<Todo[]> response = restTemplate.exchange(
                baseUrl(),
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Todo[].class
        );
        return TodoResponse.from(Objects.requireNonNull(response.getBody())[0]);
    }

    public TodoResponse update(String id, TodoUpdateRequest request, String userId) {
        getById(id, userId); // 소유권 검증

        HttpHeaders headers = headers();
        headers.set("Prefer", "return=representation");

        Map<String, Object> body = new HashMap<>();
        if (request.title() != null) body.put("title", request.title());
        if (request.completed() != null) body.put("completed", request.completed());

        ResponseEntity<Todo[]> response = restTemplate.exchange(
                baseUrl() + "?id=eq." + id + "&user_id=eq." + userId,
                HttpMethod.PATCH,
                new HttpEntity<>(body, headers),
                Todo[].class
        );
        return TodoResponse.from(Objects.requireNonNull(response.getBody())[0]);
    }

    public void delete(String id, String userId) {
        getById(id, userId); // 소유권 검증

        restTemplate.exchange(
                baseUrl() + "?id=eq." + id + "&user_id=eq." + userId,
                HttpMethod.DELETE,
                new HttpEntity<>(headers()),
                Void.class
        );
    }
}
