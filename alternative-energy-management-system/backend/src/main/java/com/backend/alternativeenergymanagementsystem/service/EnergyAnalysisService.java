package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.EnergyReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EnergyAnalysisService {

    private final SolarPanelService solarPanelService;
    private final DeviceService deviceService;

    @Autowired
    public EnergyAnalysisService(SolarPanelService solarPanelService, DeviceService deviceService) {
        this.solarPanelService = solarPanelService;
        this.deviceService = deviceService;
    }

    public EnergyReport getDailyReport(String userId) throws ExecutionException, InterruptedException {
        double consumption = deviceService.calculateDailyEnergyConsumption(userId);
        double production = solarPanelService.calculateDailyEnergyProduction(userId);

        EnergyReport report = new EnergyReport("Daily", consumption, production);
        report.setInsight(createInsight(consumption, production));
        report.setRecommendation(createRecommendation(consumption, production));
        return report;
    }

    public List<EnergyReport> getWeeklyReport(String userId) throws ExecutionException, InterruptedException {
        double baseConsumption = deviceService.calculateDailyEnergyConsumption(userId);
        double baseProduction = solarPanelService.calculateDailyEnergyProduction(userId);

        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        double[] weatherFactors = {1.0, 0.98, 0.99, 1.0, 0.97, 1.0, 0.99};

        List<EnergyReport> reports = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            double consumption = baseConsumption * (0.95 + Math.random() * 0.1);
            double production = baseProduction * weatherFactors[i];

            EnergyReport report = new EnergyReport(days[i], consumption, production);
            report.setInsight(createInsight(consumption, production));
            report.setRecommendation(createRecommendation(consumption, production));

            reports.add(report);
        }

        return reports;
    }

    public List<EnergyReport> getMonthlyReport(String userId) throws ExecutionException, InterruptedException {
        double dailyConsumption = deviceService.calculateDailyEnergyConsumption(userId);
        double dailyProduction = solarPanelService.calculateDailyEnergyProduction(userId);

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        double[] prodFactors = {0.7, 0.75, 0.85, 0.9, 1.0, 1.1, 1.15, 1.15, 1.05, 0.95, 0.8, 0.7};
        double[] consFactors = {1.2, 1.1, 0.9, 0.8, 0.9, 1.2, 1.3, 1.3, 1.1, 0.9, 0.9, 1.1};

        List<EnergyReport> reports = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            int days = getDaysInMonth(i);

            double monthlyConsumption = dailyConsumption * days * consFactors[i];
            double monthlyProduction = dailyProduction * days * prodFactors[i];

            EnergyReport report = new EnergyReport(months[i], monthlyConsumption, monthlyProduction);
            report.setInsight(createInsight(monthlyConsumption, monthlyProduction));
            report.setRecommendation(createRecommendation(monthlyConsumption, monthlyProduction));

            reports.add(report);
        }

        return reports;
    }

    public EnergyReport.EnergyInsight getEnergyInsight(String userId) throws ExecutionException, InterruptedException {
        double consumption = deviceService.calculateDailyEnergyConsumption(userId);
        double production = solarPanelService.calculateDailyEnergyProduction(userId);
        return createInsight(consumption, production);
    }

    public EnergyReport.EnergyRecommendation getEnergyRecommendation(String userId) throws ExecutionException, InterruptedException {
        double consumption = deviceService.calculateDailyEnergyConsumption(userId);
        double production = solarPanelService.calculateDailyEnergyProduction(userId);
        return createRecommendation(consumption, production);
    }

    private EnergyReport.EnergyInsight createInsight(double consumption, double production) {
        String status = (production >= consumption) ? "Positive Energy Balance" : "Negative Energy Balance";
        return new EnergyReport.EnergyInsight(status);
    }

    private EnergyReport.EnergyRecommendation createRecommendation(double consumption, double production) {
        String advice;
        if (production < consumption * 0.8) {
            advice = "Try using fewer devices or install more solar panels.";
        } else if (production > consumption * 1.2) {
            advice = "You have extra energy. Think about storing or selling it.";
        } else {
            advice = "Your energy use and production are balanced. Keep it up!";
        }
        return new EnergyReport.EnergyRecommendation(advice);
    }

    private int getDaysInMonth(int monthIndex) {
        if (monthIndex == 1) return 28;
        if (monthIndex == 0 || monthIndex == 2 || monthIndex == 4 || monthIndex == 6 ||
                monthIndex == 7 || monthIndex == 9 || monthIndex == 11) {
            return 31;
        }
        return 30;
    }
}

