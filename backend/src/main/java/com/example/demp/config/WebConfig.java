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
	        Path docDir = Paths.get("uploads/docs");
	        String docPath = docDir.toFile().getAbsolutePath();

	        registry.addResourceHandler("/docs/**")
	                .addResourceLocations("file:" + docPath + "/");
	        Path imgDir = Paths.get("uploads/images");
	        String imgPath = imgDir.toFile().getAbsolutePath();

	        registry.addResourceHandler("/images/**")
	                .addResourceLocations("file:" + imgPath + "/");
	    }

}
