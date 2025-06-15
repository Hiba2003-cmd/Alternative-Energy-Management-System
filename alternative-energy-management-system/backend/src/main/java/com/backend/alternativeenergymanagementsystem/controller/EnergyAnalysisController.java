package com.backend.alternativeenergymanagementsystem.controller;

import com.backend.alternativeenergymanagementsystem.model.EnergyReport;
import com.backend.alternativeenergymanagementsystem.service.EnergyAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/energy-analysis")
public class EnergyAnalysisController {

    private final EnergyAnalysisService energyAnalysisService;

    @Autowired
    public EnergyAnalysisController(EnergyAnalysisService energyAnalysisService) {
        this.energyAnalysisService = energyAnalysisService;
    }

    @GetMapping("/daily/{userId}")
    public EnergyReport getDailyReport(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return energyAnalysisService.getDailyReport(userId);
    }

    @GetMapping("/weekly/{userId}")
    public List<EnergyReport> getWeeklyReport(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return energyAnalysisService.getWeeklyReport(userId);
    }

    @GetMapping("/monthly/{userId}")
    public List<EnergyReport> getMonthlyReport(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return energyAnalysisService.getMonthlyReport(userId);
    }

    @GetMapping("/insight/{userId}")
    public EnergyReport.EnergyInsight getInsight(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return energyAnalysisService.getEnergyInsight(userId);
    }

    @GetMapping("/recommendation/{userId}")
    public EnergyReport.EnergyRecommendation getRecommendation(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return energyAnalysisService.getEnergyRecommendation(userId);
    }
}
