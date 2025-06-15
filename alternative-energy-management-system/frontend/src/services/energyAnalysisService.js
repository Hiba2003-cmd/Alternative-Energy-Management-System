import axios from 'axios';

const API_URL = 'http://localhost:8080/api/energy-analysis';

export const energyAnalysisService = {
  getDailyReport: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/daily/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily energy report:', error);
      throw error;
    }
  },

  getWeeklyReport: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/weekly/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly energy reports:', error);
      throw error;
    }
  },
  getMonthlyReport: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/monthly/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly energy reports:', error);
      throw error;
    }
  },

  getEnergyInsight: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/insight/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching energy insight:', error);
      throw error;
    }
  },

  getEnergyRecommendation: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/recommendation/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching energy recommendation:', error);
      throw error;
    }
  },

};

export default energyAnalysisService;
