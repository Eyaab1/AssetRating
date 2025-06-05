package com.example.demo.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class emailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAccountCreationEmail(String toEmail, String password, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to Veggo Marketplace – Your Account Details");

        String body = """
            Hello,

            Welcome to the Veggo Marketplace platform!

            Your account has been created with the following details:

            Email: %s
            Password: %s
            Role: %s

            You can now log in and start using your account.

            If you have any questions, feel free to reach out to our support team.

            Best regards,  
            The Veggo Team
            """.formatted(toEmail, password, role);

        message.setText(body);
        mailSender.send(message);
    }

}
