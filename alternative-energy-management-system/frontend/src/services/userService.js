import axios from 'axios';
import { updatePassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseService';

const API_URL = 'http://localhost:8080/api';

export const userService = {
  registerUser: async (name, email, password, location) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password,
        location
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  },

  updateUserProfile: async (userId, userData) => {
    try {
      const payload = {
        ...userData,
        notificationPreferences: {
          lowProductionWarnings: userData.notificationPreferences.lowProductionWarnings,
          overconsumptionAlerts: userData.notificationPreferences.overconsumptionAlerts,
          weeklyEnergyReports: userData.notificationPreferences.weeklyEnergyReports,
          monthlyEnergyReports: userData.notificationPreferences.monthlyEnergyReports,
        }
      };

      const response = await axios.put(`${API_URL}/users/${userId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is signed in');
      }

      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      await updatePassword(user, newPassword);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
