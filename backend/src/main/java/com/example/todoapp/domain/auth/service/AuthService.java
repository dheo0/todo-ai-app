package com.example.todoapp.domain.auth.service;

import com.example.todoapp.domain.auth.dto.AuthResponse;
import com.example.todoapp.domain.auth.dto.LoginRequest;
import com.example.todoapp.domain.auth.dto.SignupRequest;
import com.example.todoapp.domain.auth.dto.SupabaseAuthResponse;
import com.example.todoapp.global.config.SupabaseProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabaseProperties;

    private HttpHeaders anonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseProperties.anonKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    /* 이메일/비밀번호 인증 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
    public AuthResponse signup(SignupRequest request) {
        String url = supabaseProperties.url() + "/auth/v1/signup";
        Map<String, String> body = new HashMap<>();
        body.put("email", request.email());
        body.put("password", request.password());
        try {
            ResponseEntity<SupabaseAuthResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, anonHeaders()), SupabaseAuthResponse.class);
            SupabaseAuthResponse raw = response.getBody();

            // access_token이 없으면 이메일 확인이 필요한 경우 (Supabase 이메일 인증 활성화 상태)
            if (raw == null || raw.accessToken() == null) {
                return new AuthResponse(null, null, 0, null, request.email(), true);
            }
            return new AuthResponse(
                    raw.accessToken(), raw.tokenType(), raw.expiresIn(),
                    raw.user().id(), raw.user().email(), false);
        } catch (HttpClientErrorException e) {
            // Supabase 실제 에러 메시지를 그대로 전달 (디버깅용)
            throw new RuntimeException("[Supabase " + e.getStatusCode() + "] " + e.getResponseBodyAsString());
        }
    }

    public AuthResponse login(LoginRequest request) {
        String url = supabaseProperties.url() + "/auth/v1/token?grant_type=password";
        Map<String, String> body = new HashMap<>();
        body.put("email", request.email());
        body.put("password", request.password());
        try {
            ResponseEntity<SupabaseAuthResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, anonHeaders()), SupabaseAuthResponse.class);
            SupabaseAuthResponse raw = response.getBody();
            if (raw == null || raw.user() == null) {
                throw new RuntimeException("로그인 응답을 처리할 수 없습니다.");
            }
            return new AuthResponse(
                    raw.accessToken(), raw.tokenType(), raw.expiresIn(),
                    raw.user().id(), raw.user().email(), false);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
        }
    }
    */
}
