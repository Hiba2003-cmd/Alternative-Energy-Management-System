package com.backend.alternativeenergymanagementsystem.model;

import java.util.Date;

public class SolarPanel {
    private String id;
    private String userId;
    private String type;
    private double voltage;
    private double current;
    private double efficiency;
    private int quantity;
    private String orientation;
    private Date installDate;
    private String location;

    public SolarPanel() {}

    public SolarPanel(String id, String userId, String type, double voltage, double current, 
                     double efficiency, int quantity, String orientation, 
                     Date installDate, String location) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.voltage = voltage;
        this.current = current;
        this.efficiency = efficiency;
        this.quantity = quantity;
        this.orientation = orientation;
        this.installDate = installDate;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getVoltage() { return voltage; }
    public void setVoltage(double voltage) { this.voltage = voltage; }

    public double getCurrent() { return current; }
    public void setCurrent(double current) { this.current = current; }

    public double getEfficiency() { return efficiency; }
    public void setEfficiency(double efficiency) { this.efficiency = efficiency; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getOrientation() { return orientation; }
    public void setOrientation(String orientation) { this.orientation = orientation; }

    public Date getInstallDate() { return installDate; }
    public void setInstallDate(Date installDate) { this.installDate = installDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    // Calculate power output in watts
    public double calculatePowerOutput() {
        return voltage * current * efficiency * quantity;
    }
}