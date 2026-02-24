package com.example.todoapp.global.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableConfigurationProperties(SupabaseProperties.class)
public class SupabaseConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
