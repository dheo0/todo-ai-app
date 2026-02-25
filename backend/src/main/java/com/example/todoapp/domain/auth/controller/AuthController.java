package com.example.todoapp.domain.auth.controller;

import com.example.todoapp.domain.auth.dto.AuthResponse;
import com.example.todoapp.domain.auth.dto.LoginRequest;
import com.example.todoapp.domain.auth.dto.SignupRequest;
import com.example.todoapp.domain.auth.service.AuthService;
import com.example.todoapp.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.ok(authService.signup(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
    }
}
