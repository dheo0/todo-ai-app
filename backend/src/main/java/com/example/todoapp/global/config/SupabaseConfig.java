package com.example.todoapp.global.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableConfigurationProperties(SupabaseProperties.class)
public class SupabaseConfig {

    @Bean
    public RestTemplate restTemplate() {
        // HttpURLConnection은 PATCH를 지원하지 않으므로 Apache HttpClient 5 사용
        return new RestTemplate(new HttpComponentsClientHttpRequestFactory());
    }
}
