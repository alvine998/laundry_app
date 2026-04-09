import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { API_URL, API_CONFIG } from '../config/api';

// Configure Google Sign-In
// Note: webClientId is required for Firebase to work. 
// You can find this in your google-services.json file as 'client_id' of type 3.
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
  offlineAccess: true,
});

export const AuthService = {
  /**
   * Registers a new user via the Express Backend
   */
  async register(data: any) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Registration failed');
      }

      return responseData;
    } catch (error) {
      console.error('Register API Error:', error);
      throw error;
    }
  },

  /**
   * Logs a user in via the Express Backend
   */
  async login(data: any) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Login failed');
      }

      // Here you would typically save the JWT token to secure storage
      // e.g., await AsyncStorage.setItem('token', responseData.token);

      return responseData;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  },

  /**
   * Sends or Resends an OTP to a phone number
   */
  async sendOTP(phone: string) {
    try {
      const response = await fetch(`${API_URL}/auth/otp/send`, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify({ phone }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send OTP');
      }

      return responseData;
    } catch (error) {
      console.error('Send OTP API Error:', error);
      throw error;
    }
  },

  /**
   * Verifies an OTP for a phone number
   */
  async verifyOTP(phone: string, otp: string) {
    try {
      const response = await fetch(`${API_URL}/auth/otp/verify`, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'OTP Verification failed');
      }

      return responseData;
    } catch (error) {
      console.error('Verify OTP API Error:', error);
      throw error;
    }
  },

  /**
   * Performs Google Sign-In and authenticates with Firebase.
   */
  async signInWithGoogle() {
    try {
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In: No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      return userCredential.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  /**
   * Signs the user out of Firebase and Google.
   */
  async signOut() {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  },

  /**
   * Returns the current authenticated user.
   */
  getCurrentUser() {
    return auth().currentUser;
  },
};
