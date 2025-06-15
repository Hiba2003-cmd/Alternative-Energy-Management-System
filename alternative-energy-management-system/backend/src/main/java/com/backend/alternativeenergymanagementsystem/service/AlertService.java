package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.Alert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class AlertService {

    @Autowired
    private EmailService emailService;

    public Alert createAlert(String userId, String type, String message)
            throws ExecutionException, InterruptedException {
        return new Alert(userId, type, message);
    }

    public Alert createOverconsumptionAlert(String userId, double consumption, double threshold)
            throws ExecutionException, InterruptedException {
        String message = String.format("Your energy consumption (%.2f Wh) has exceeded the threshold (%.2f Wh)",
                consumption, threshold);

        Alert alert = createAlert(userId, "OVERCONSUMPTION", message);

        emailService.sendAlertEmail(userId, "Energy Overconsumption Alert", message);

        return alert;
    }

    public Alert createLowProductionAlert(String userId, double production, double expected)
            throws ExecutionException, InterruptedException {
        String message = String.format("Your solar energy production (%.2f Wh) is lower than expected (%.2f Wh)",
                production, expected);

        Alert alert = createAlert(userId, "LOW_PRODUCTION", message);
        emailService.sendAlertEmail(userId, "Low Solar Production Alert", message);

        return alert;
    }
}