package com.backend.alternativeenergymanagementsystem.model;

import java.util.Date;

public class Alert {
    private String id;
    private String userId;
    private String type;
    private String message;
    private Date timestamp;

    public Alert() {
        this.timestamp = new Date();
    }

    public Alert(String userId, String type, String message) {
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.timestamp = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}