package com.example.todoapp.global.exception;

public class TodoNotFoundException extends RuntimeException {

    public TodoNotFoundException(String id) {
        super("Todo를 찾을 수 없습니다. id=" + id);
    }
}
