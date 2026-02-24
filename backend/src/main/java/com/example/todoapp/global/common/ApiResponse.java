package com.example.todoapp.global.common;

public record ApiResponse<T>(
        boolean success,
        T data,
        String message
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, "요청 성공");
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
