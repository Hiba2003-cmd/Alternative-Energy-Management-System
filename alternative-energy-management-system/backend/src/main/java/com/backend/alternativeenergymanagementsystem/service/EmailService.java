package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.User;
import com.backend.alternativeenergymanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import java.util.concurrent.ExecutionException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendAlertEmail(String userId, String subject, String message)
            throws ExecutionException, InterruptedException {
        User user = userRepository.findById(userId);
        if (user != null && user.getEmail() != null) {
            sendEmail(user.getEmail(), subject, message);
        }
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}