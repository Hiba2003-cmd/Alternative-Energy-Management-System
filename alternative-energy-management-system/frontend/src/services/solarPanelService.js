import axios from 'axios';

const API_URL = 'http://localhost:8080/api/solar-panels';

const helpers = {
    getEstimatedSunlightHours: (orientation) => {
        let baseHours = 5.0;
        if (orientation.toLowerCase() === "south") {
            baseHours += 1.5;
        } else if (orientation.toLowerCase() === "north") {
            baseHours -= 1.5;
        } else if (orientation.toLowerCase() === "east" || orientation.toLowerCase() === "west") {
            baseHours -= 0.5;
        }
        return Math.max(baseHours, 1.0);
    },

    calculateBasePowerProduction: (panel) => {
        return panel.voltage * panel.current * (panel.efficiency / 100) * panel.quantity;
    },

    calculateDailyPowerProduction: (panel) => {
        const basePower = helpers.calculateBasePowerProduction(panel);
        const sunlightHours = helpers.getEstimatedSunlightHours(panel.orientation);
        return basePower * sunlightHours;
    },

    hourlyDistributionData: (dailyTotal) => {
        const hourlyDistribution = [0.02, 0.15, 0.25, 0.28, 0.20, 0.10];
        const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];

        return hours.map((hour, index) => ({
            hour,
            value: parseFloat((dailyTotal * hourlyDistribution[index]).toFixed(1))
        }));
    },

    weeklyVariationData: (dailyTotal) => {
        const dayVariation = [0.95, 1.05, 0.98, 1.02, 1.08, 1.1, 0.90];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return days.map((day, index) => ({
            day,
            value: parseFloat((dailyTotal * dayVariation[index]).toFixed(1))
        }));
    },

    monthlyVariationData: (dailyTotal) => {
        const monthlyFactor = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        return months.map((month, index) => ({
            month,
            value: parseFloat((dailyTotal * 30 * monthlyFactor[index]).toFixed(1))
        }));
    }
};

export const solarPanelService = {
    helpers,

    getAllPanels: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching all panels:', error);
            throw error;
        }
    },
    
    getPanelsByUserId: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching panels for user ${userId}:`, error);
            throw error;
        }
    },
    
    getPanelById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching panel ${id}:`, error);
            throw error;
        }
    },
    
    createPanel: async (panel) => {
        try {
            const response = await axios.post(API_URL, panel);
            return response.data;
        } catch (error) {
            console.error('Error creating panel:', error);
            throw error;
        }
    },
    
    updatePanel: async (panel) => {
        try {
            const response = await axios.put(`${API_URL}/${panel.id}`, panel);
            return response.data;
        } catch (error) {
            console.error(`Error updating panel ${panel.id}:`, error);
            throw error;
        }
    },
    
    deletePanel: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting panel ${id}:`, error);
            throw error;
        }
    },
    
    calculateDailyEnergyProduction: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}/production`);
            return response.data;
        } catch (error) {
            console.error('Error calculating daily energy production:', error);
            throw error;
        }
    },

    getHourlyProduction: async (userId) => {
        try {
            const dailyTotal = await solarPanelService.calculateDailyEnergyProduction(userId);
            return helpers.hourlyDistributionData(dailyTotal);
        } catch (error) {
            console.error('Error calculating hourly production:', error);
            return helpers.hourlyDistributionData(9.0);
        }
    },

    getDailyProductionForWeek: async (userId) => {
        try {
            const dailyTotal = await solarPanelService.calculateDailyEnergyProduction(userId);
            return helpers.weeklyVariationData(dailyTotal);
        } catch (error) {
            console.error('Error calculating weekly production:', error);
            return helpers.weeklyVariationData(9.0);
        }
    },

    getMonthlyProduction: async (userId) => {
        try {
            const dailyTotal = await solarPanelService.calculateDailyEnergyProduction(userId);
            return helpers.monthlyVariationData(dailyTotal);
        } catch (error) {
            console.error('Error calculating monthly production:', error);
            return helpers.monthlyVariationData(9.0);
        }
    }
};
