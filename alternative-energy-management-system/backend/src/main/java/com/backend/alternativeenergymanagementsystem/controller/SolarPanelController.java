package com.backend.alternativeenergymanagementsystem.controller;

import com.backend.alternativeenergymanagementsystem.model.SolarPanel;
import com.backend.alternativeenergymanagementsystem.service.SolarPanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/solar-panels")
public class SolarPanelController {

    @Autowired
    private SolarPanelService solarPanelService;

    @PostMapping
    public ResponseEntity<SolarPanel> addSolarPanel(@RequestBody SolarPanel panel) {
        try {
            SolarPanel savedPanel = solarPanelService.addSolarPanel(panel);
            return new ResponseEntity<>(savedPanel, HttpStatus.CREATED);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolarPanel> getSolarPanelById(@PathVariable String id) {
        try {
            SolarPanel panel = solarPanelService.getSolarPanelById(id);
            if (panel != null) {
                return new ResponseEntity<>(panel, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<SolarPanel>> getAllSolarPanels() {
        try {
            List<SolarPanel> panels = solarPanelService.getAllSolarPanels();
            return new ResponseEntity<>(panels, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SolarPanel>> getSolarPanelsByUserId(@PathVariable String userId) {
        try {
            List<SolarPanel> panels = solarPanelService.getSolarPanelsByUserId(userId);
            return new ResponseEntity<>(panels, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolarPanel> updateSolarPanel(@PathVariable String id, @RequestBody SolarPanel panel) {
        try {
            // Ensure the path ID matches the panel ID
            if (!id.equals(panel.getId())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            SolarPanel updatedPanel = solarPanelService.updateSolarPanel(panel);
            return new ResponseEntity<>(updatedPanel, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSolarPanel(@PathVariable String id) {
        try {
            solarPanelService.deleteSolarPanel(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}/production")
    public ResponseEntity<Double> calculateDailyEnergyProduction(@PathVariable String userId) {
        try {
            double production = solarPanelService.calculateDailyEnergyProduction(userId);
            return new ResponseEntity<>(production, HttpStatus.OK);
        } catch (ExecutionException | InterruptedException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}