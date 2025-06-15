package com.backend.alternativeenergymanagementsystem.model;



public class EnergyReport {
    private String period;
    private double consumption;
    private double production;
    private double netEnergy;
    private EnergyInsight insight;
    private EnergyRecommendation recommendation;

    // Constructors
    public EnergyReport() {}

    public EnergyReport(String period, double consumption, double production) {
        this.period = period;
        this.consumption = consumption;
        this.production = production;
        this.netEnergy = production - consumption;
        this.insight = null;
        this.recommendation = null;
    }

    public EnergyReport(String period, double consumption, double production, double netEnergy,
                        String insightText, String recommendationText) {
        this.period = period;
        this.consumption = consumption;
        this.production = production;
        this.netEnergy = netEnergy;
        this.insight = new EnergyInsight(insightText);
        this.recommendation = new EnergyRecommendation(recommendationText);
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public double getConsumption() { return consumption; }
    public void setConsumption(double consumption) { this.consumption = consumption; }

    public double getProduction() { return production; }
    public void setProduction(double production) { this.production = production; }

    public double getNetEnergy() { return netEnergy; }
    public void setNetEnergy(double netEnergy) { this.netEnergy = netEnergy; }

    public EnergyInsight getInsight() { return insight; }
    public void setInsight(EnergyInsight insight) { this.insight = insight; }

    public EnergyRecommendation getRecommendation() { return recommendation; }
    public void setRecommendation(EnergyRecommendation recommendation) { this.recommendation = recommendation; }

    public static class EnergyInsight {
        private String message;

        public EnergyInsight() {}
        public EnergyInsight(String message) { this.message = message; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class EnergyRecommendation {
        private String message;

        public EnergyRecommendation() {}
        public EnergyRecommendation(String message) { this.message = message; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}

