
package com.backend.alternativeenergymanagementsystem.model;

public class Device {
    private String id;
    private String userId;
    private String category;
    private String modelBrand;
    private double powerConsumption;
    private double dailyUsageHours;
    private int priority;

    public Device() {}

    public Device(String id, String userId, String category, String modelBrand, 
                 double powerConsumption, double dailyUsageHours, int priority) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.modelBrand = modelBrand;
        this.powerConsumption = powerConsumption;
        this.dailyUsageHours = dailyUsageHours;
        this.priority = priority;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getModelBrand() { return modelBrand; }
    public void setModelBrand(String modelBrand) { this.modelBrand = modelBrand; }

    public double getPowerConsumption() { return powerConsumption; }
    public void setPowerConsumption(double powerConsumption) { this.powerConsumption = powerConsumption; }

    public double getDailyUsageHours() { return dailyUsageHours; }
    public void setDailyUsageHours(double dailyUsageHours) { this.dailyUsageHours = dailyUsageHours; }

    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public double calculateDailyConsumption() {
        return (powerConsumption * dailyUsageHours) / 1000.0; // Convert to kWh
    }
}