package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.SolarPanel;
import com.backend.alternativeenergymanagementsystem.model.User;
import com.backend.alternativeenergymanagementsystem.repository.SolarPanelRepository;
import com.backend.alternativeenergymanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class SolarPanelService {

    @Autowired
    private SolarPanelRepository solarPanelRepository;

    @Autowired
    private UserRepository userRepository;

    public SolarPanel addSolarPanel(SolarPanel panel) throws ExecutionException, InterruptedException {
        SolarPanel panelSaved = solarPanelRepository.save(panel);
        panel.setId(panelSaved.getId());
        User user = userRepository.findById(panel.getUserId());
        if (user != null) {
            if (user.getSolarPanelIds() == null) {
                user.setSolarPanelIds(List.of(panelSaved.getId()));
            } else {
                user.getSolarPanelIds().add(panelSaved.getId());
            }
            userRepository.save(user);
        }

        return panel;
    }

    public List<SolarPanel> getAllSolarPanels() throws ExecutionException, InterruptedException {
        return solarPanelRepository.findAll();
    }

    public SolarPanel getSolarPanelById(String id) throws ExecutionException, InterruptedException {
        return solarPanelRepository.findById(id);
    }

    public List<SolarPanel> getSolarPanelsByUserId(String userId) throws ExecutionException, InterruptedException {
        return solarPanelRepository.findByUserId(userId);
    }

    public SolarPanel updateSolarPanel(SolarPanel panel) throws ExecutionException, InterruptedException {
        SolarPanel existingPanel = solarPanelRepository.findById(panel.getId());
        if (existingPanel == null) {
            throw new IllegalArgumentException("Solar panel not found with ID: " + panel.getId());
        }

        solarPanelRepository.save(panel);
        return panel;
    }

    public void deleteSolarPanel(String id) throws ExecutionException, InterruptedException {
        SolarPanel panel = solarPanelRepository.findById(id);
        if (panel == null) {
            throw new IllegalArgumentException("Solar panel not found with ID: " + id);
        }
        User user = userRepository.findById(panel.getUserId());
        if (user != null && user.getSolarPanelIds() != null) {
            user.getSolarPanelIds().remove(id);
            userRepository.save(user);
        }

        solarPanelRepository.delete(id);
    }

    public double calculateDailyEnergyProduction(String userId) throws ExecutionException, InterruptedException {
        List<SolarPanel> panels = getSolarPanelsByUserId(userId);
        double totalDailyProduction = 0.0;

        for (SolarPanel panel : panels) {
            double panelPower = panel.getVoltage() * panel.getCurrent();
            double efficiencyDecimal = panel.getEfficiency() / 100.0;

            double sunlightHours = getEstimatedSunlightHours(panel.getLocation(), panel.getOrientation());
            double dailyProduction = panelPower * efficiencyDecimal * panel.getQuantity() * sunlightHours;

            totalDailyProduction += dailyProduction;
        }

        return totalDailyProduction;
    }

    public String getSeason(int month) {
        if (month >= 5 && month <= 8) {
            return "SUMMER";
        } else if (month >= 2 && month <= 4) {
            return "SPRING";
        } else if (month >= 9 && month <= 10) {
            return "FALL";
        } else {
            return "WINTER";
        }
    }

    private double getEstimatedSunlightHours(String location, String orientation) {
        Calendar calendar = Calendar.getInstance();
        int month = calendar.get(Calendar.MONTH);
        String season = getSeason(month);

        double baseHours = getSyrianSeasonalSunlightHours(season);

        if ("south".equalsIgnoreCase(orientation)) {
            baseHours += 1.5;
        } else if ("north".equalsIgnoreCase(orientation)) {
            baseHours -= 1.5;
        } else if ("east".equalsIgnoreCase(orientation) || "west".equalsIgnoreCase(orientation)) {
            baseHours -= 0.5;
        }

        baseHours *= getSyrianWeatherFactor(month);

        return Math.max(baseHours, 1.0);
    }

    private double getSyrianSeasonalSunlightHours(String season) {
        switch (season) {
            case "SUMMER":
                return 9.5;
            case "WINTER":
                return 5.5;
            case "SPRING":
                return 8.0;
            case "FALL":
                return 7.0;
            default:
                return 7.5;
        }
    }

    private double getSyrianWeatherFactor(int month) {
        double[] monthlyWeatherFactors = {
                0.85,  // Jan: Some rain and clouds
                0.87,  // Feb: Some rain and clouds
                0.92,  // Mar: Improving weather
                0.95,  // Apr: Generally clear
                0.98,  // May: Mostly clear
                1.0,   // Jun: Very clear, dry
                1.0,   // Jul: Very clear, dry
                1.0,   // Aug: Very clear, dry
                0.99,  // Sep: Very clear, dry
                0.95,  // Oct: Some clouds begin
                0.9,   // Nov: More clouds, some rain
                0.85   // Dec: Winter rain season
        };

        return monthlyWeatherFactors[month];
    }

}