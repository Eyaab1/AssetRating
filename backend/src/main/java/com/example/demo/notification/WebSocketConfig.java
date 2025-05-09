package com.example.demo.notification;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
	
	  @Override
	    public void registerStompEndpoints(StompEndpointRegistry registry) {
	        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS(); // or without SockJS if not needed
	    }

	    @Override
	    public void configureMessageBroker(MessageBrokerRegistry registry) {
	        registry.setApplicationDestinationPrefixes("/app");
	        registry.enableSimpleBroker("/topic"); // Where clients subscribe
	    }
}
