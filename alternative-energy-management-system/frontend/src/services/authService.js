import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseService";
import { userService } from "./userService";

export const authService = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = await userService.getUserByEmail(email);

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  register: async (name, email, password, location) => {
    try {
      const userData = await userService.registerUser(
        name,
        email,
        password,
        location
      );

      return {
        ...userData,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },
};
