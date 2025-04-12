package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example")
@EntityScan(basePackages = {
    "com.example.demo.asset.model",
    "com.example.demo.auth",
    "com.example.review.model",
    "com.example.rating.model"
})
@EnableJpaRepositories(basePackages = {
	"com.example.review.repository",
	"com.example.rating.repository",
	"com.example.demo.asset.repository",
	"com.example.demo.auth"

})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
