package com.example.todoapp.global.interceptor;

import com.example.todoapp.global.config.SupabaseProperties;
import com.example.todoapp.global.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Jwks;
import io.jsonwebtoken.security.JwkSet;
import io.jsonwebtoken.security.PublicJwk;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.PublicKey;
import java.util.Base64;

@Component
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthInterceptor implements HandlerInterceptor {

    private final SupabaseProperties supabaseProperties;
    private final RestTemplate restTemplate;

    private volatile PublicKey cachedPublicKey = null;

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("인증 토큰이 없습니다.");
        }
        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .keyLocator(header -> "ES256".equals(header.get("alg"))
                            ? getOrFetchPublicKey()
                            : buildHmacKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            log.info("Authenticated user: {}", userId);
            request.setAttribute("userId", userId);
            return true;
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage(), e);
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");
        }
    }

    private Key getOrFetchPublicKey() {
        if (cachedPublicKey == null) {
            synchronized (this) {
                if (cachedPublicKey == null) {
                    cachedPublicKey = fetchPublicKeyFromJwks();
                }
            }
        }
        return cachedPublicKey;
    }

    private PublicKey fetchPublicKeyFromJwks() {
        String jwksUrl = supabaseProperties.url() + "/auth/v1/.well-known/jwks.json";
        log.info("Supabase JWKS에서 공개키 조회 중: {}", jwksUrl);
        String jwksJson = restTemplate.getForObject(jwksUrl, String.class);
        JwkSet jwkSet = Jwks.setParser().build().parse(jwksJson);
        return jwkSet.getKeys().stream()
                .filter(k -> k instanceof PublicJwk)
                .map(k -> ((PublicJwk<?>) k).toKey())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Supabase JWKS에서 공개키를 찾을 수 없습니다."));
    }

    private SecretKey buildHmacKey() {
        String secret = supabaseProperties.jwtSecret();
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            return new SecretKeySpec(keyBytes, "HmacSHA256");
        } catch (IllegalArgumentException e) {
            return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        }
    }
}
