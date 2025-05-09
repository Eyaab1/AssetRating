package com.example.demp.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer  {
	 @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
	        Path uploadDir = Paths.get("uploads/docs");
	        String uploadPath = uploadDir.toFile().getAbsolutePath();

	        registry.addResourceHandler("/docs/**")
	                .addResourceLocations("file:" + uploadPath + "/");
	    }

}
