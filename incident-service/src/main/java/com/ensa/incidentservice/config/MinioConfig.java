package com.ensa.incidentservice.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint("http://localhost:9000") // L'adresse du serveur MinIO
                .credentials("minioadmin", "minioadmin") // User/Password par défaut
                .build();
    }
}