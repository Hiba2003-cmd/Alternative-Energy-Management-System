package com.backend.alternativeenergymanagementsystem.service;

import com.backend.alternativeenergymanagementsystem.model.Device;
import com.backend.alternativeenergymanagementsystem.model.User;
import com.backend.alternativeenergymanagementsystem.repository.DeviceRepository;
import com.backend.alternativeenergymanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    public Device addDevice(Device device) throws ExecutionException, InterruptedException {
        Device savedDevice = deviceRepository.save(device);
        device.setId(savedDevice.getId());

        User user = userRepository.findById(device.getUserId());
        if (user != null) {
            if (user.getDeviceIds() == null) {
                user.setDeviceIds(List.of(savedDevice.getId()));
            } else {
                user.getDeviceIds().add(savedDevice.getId());
            }
            userRepository.save(user);
        }

        return device;
    }

    public Device getDeviceById(String id) throws ExecutionException, InterruptedException {
        return deviceRepository.findById(id);
    }

    public List<Device> getAllDevices() throws ExecutionException, InterruptedException {
        return deviceRepository.findAll();
    }

    public List<Device> getDevicesByUserId(String userId) throws ExecutionException, InterruptedException {
        return deviceRepository.findByUserId(userId);
    }

    public List<Device> getDevicesByUserIdAndCategory(String userId, String category)
            throws ExecutionException, InterruptedException {
        return deviceRepository.findByUserIdAndCategory(userId, category);
    }

    public Device updateDevice(Device device) throws ExecutionException, InterruptedException {
        Device existingDevice = deviceRepository.findById(device.getId());
        if (existingDevice == null) {
            throw new IllegalArgumentException("Device not found with ID: " + device.getId());
        }

        deviceRepository.save(device);
        return device;
    }

    public void deleteDevice(String id) throws ExecutionException, InterruptedException {
        Device device = deviceRepository.findById(id);
        if (device == null) {
            throw new IllegalArgumentException("Device not found with ID: " + id);
        }
        User user = userRepository.findById(device.getUserId());
        if (user != null && user.getDeviceIds() != null) {
            user.getDeviceIds().remove(id);
            userRepository.save(user);
        }

        deviceRepository.delete(id);
    }

    public double calculateDailyEnergyConsumption(String userId) throws ExecutionException, InterruptedException {
        List<Device> devices = getDevicesByUserId(userId);
        double totalDailyConsumption = 0.0;

        for (Device device : devices) {
            double dailyConsumption = device.getPowerConsumption() * device.getDailyUsageHours();
            totalDailyConsumption += dailyConsumption;
        }

        return totalDailyConsumption; // in Watt-hours
    }

    public double calculateCategoryDailyConsumption(String userId, String category)
            throws ExecutionException, InterruptedException {
        List<Device> devices = getDevicesByUserIdAndCategory(userId, category);
        double categoryConsumption = 0.0;

        for (Device device : devices) {
            double dailyConsumption = device.getPowerConsumption() * device.getDailyUsageHours();
            categoryConsumption += dailyConsumption;
        }

        return categoryConsumption; // in Watt-hours
    }

}