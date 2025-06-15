package com.backend.alternativeenergymanagementsystem.model;
import java.util.Date;
import java.util.List;

public class User {
    private String id;
    private String name;
    private String email;
    private String location;
    private Date registrationDate;
    private List<String> deviceIds;
    private List<String> solarPanelIds;
    private NotificationPreferences notificationPreferences = new NotificationPreferences();

    public User() {}

    public User(String id, String name, String email, String location) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.location = location;
        this.registrationDate = new Date();
    }

    public static class NotificationPreferences {
        private boolean lowProductionWarnings;
        private boolean overconsumptionAlerts;
        private boolean weeklyEnergyReports;
        private boolean monthlyEnergyReports;

        public NotificationPreferences() {}

        public NotificationPreferences(boolean receiveEmailAlerts, boolean lowProductionWarnings,
                                       boolean overconsumptionAlerts, boolean weeklyEnergyReports,
                                       boolean monthlyEnergyReports) {
            this.lowProductionWarnings = lowProductionWarnings;
            this.overconsumptionAlerts = overconsumptionAlerts;
            this.weeklyEnergyReports = weeklyEnergyReports;
            this.monthlyEnergyReports = monthlyEnergyReports;
        }


        public boolean isLowProductionWarnings() {
            return lowProductionWarnings;
        }

        public void setLowProductionWarnings(boolean lowProductionWarnings) {
            this.lowProductionWarnings = lowProductionWarnings;
        }

        public boolean isOverconsumptionAlerts() {
            return overconsumptionAlerts;
        }

        public void setOverconsumptionAlerts(boolean overconsumptionAlerts) {
            this.overconsumptionAlerts = overconsumptionAlerts;
        }

        public boolean isWeeklyEnergyReports() {
            return weeklyEnergyReports;
        }

        public void setWeeklyEnergyReports(boolean weeklyEnergyReports) {
            this.weeklyEnergyReports = weeklyEnergyReports;
        }

        public boolean isMonthlyEnergyReports() {
            return monthlyEnergyReports;
        }

        public void setMonthlyEnergyReports(boolean monthlyEnergyReports) {
            this.monthlyEnergyReports = monthlyEnergyReports;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Date getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(Date registrationDate) { this.registrationDate = registrationDate; }

    public List<String> getDeviceIds() { return deviceIds; }
    public void setDeviceIds(List<String> deviceIds) { this.deviceIds = deviceIds; }

    public List<String> getSolarPanelIds() { return solarPanelIds; }
    public void setSolarPanelIds(List<String> solarPanelIds) { this.solarPanelIds = solarPanelIds; }

    public NotificationPreferences getNotificationPreferences() {
        return notificationPreferences;
    }

    public void setNotificationPreferences(NotificationPreferences notificationPreferences) {
        this.notificationPreferences = notificationPreferences;
    }
}