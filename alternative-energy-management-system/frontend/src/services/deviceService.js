import axios from "axios";

const API_URL = "http://localhost:8080/api/devices";

export const deviceService = {
  getAllDevices: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },

  getDeviceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching device with id ${id}:`, error);
      throw error;
    }
  },

  createDevice: async (device) => {
    try {
      const response = await axios.post(API_URL, device);
      return response.data;
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  },

  updateDevice: async (device) => {
    try {
      const response = await axios.put(`${API_URL}/${device.id}`, device);
      return response.data;
    } catch (error) {
      console.error(`Error updating device with id ${device.id}:`, error);
      throw error;
    }
  },

  deleteDevice: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting device with id ${id}:`, error);
      throw error;
    }
  },

  getConsumptionByCategory: async (userId, category) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/${userId}/category/${category}/consumption`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching category consumption:", error);
      throw error;
    }
  },
  
  calculateDailyEnergyConsumption: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}/consumption`);
      return response.data;
    } catch (error) {
      console.error("Error calculating daily energy consumption:", error);
      throw error;
    }
  },

  calculateCategoryDailyConsumption: async (userId, category) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/${userId}/category/${category}/consumption`
      );
      return response.data;
    } catch (error) {
      console.error(`Error calculating ${category} daily consumption:`, error);
      throw error;
    }
  },


  getHourlyConsumption: async (userId) => {
    try {

      const dailyTotal = await deviceService.calculateDailyEnergyConsumption(userId);

      const hourlyDistribution = [0.10, 0.12, 0.15, 0.17, 0.23, 0.19];
      const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
      
      return hours.map((hour, index) => ({
        hour,
        value: parseFloat((dailyTotal * hourlyDistribution[index]).toFixed(1))
      }));
    } catch (error) {
      console.error("Error calculating hourly consumption:", error);

      return [
        { hour: "6AM", value: 0.8 },
        { hour: "9AM", value: 1.2 },
        { hour: "12PM", value: 1.5 },
        { hour: "3PM", value: 1.7 },
        { hour: "6PM", value: 2.3 },
        { hour: "9PM", value: 1.9 }
      ];
    }
  },

  getDailyConsumptionForWeek: async (userId) => {
    try {

      const dailyTotal = await deviceService.calculateDailyEnergyConsumption(userId);
      
 
      const dayVariation = [1.0, 0.95, 1.05, 0.98, 1.1, 1.25, 0.9];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      return days.map((day, index) => ({
        day,
        value: parseFloat((dailyTotal * dayVariation[index]).toFixed(1))
      }));
    } catch (error) {
      console.error("Error calculating weekly consumption:", error);

      return [
        { day: "Mon", value: 9.2 },
        { day: "Tue", value: 8.7 },
        { day: "Wed", value: 10.3 },
        { day: "Thu", value: 9.5 },
        { day: "Fri", value: 11.2 },
        { day: "Sat", value: 12.5 },
        { day: "Sun", value: 8.9 }
      ];
    }
  },


  getMonthlyConsumption: async (userId) => {
    try {

      const dailyTotal = await deviceService.calculateDailyEnergyConsumption(userId);
      

      const monthlyFactor = [1.2, 1.1, 1.0, 0.9, 1.0, 1.1];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      

      return months.map((month, index) => ({
        month,
        value: parseFloat((dailyTotal * 30 * monthlyFactor[index]).toFixed(1))
      }));
    } catch (error) {
      console.error("Error calculating monthly consumption:", error);

      return [
        { month: "Jan", value: 310 },
        { month: "Feb", value: 290 },
        { month: "Mar", value: 350 },
        { month: "Apr", value: 380 },
        { month: "May", value: 410 },
        { month: "Jun", value: 430 }
      ];
    }
  }
};