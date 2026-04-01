import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

// Configure Google Sign-In
// Note: webClientId is required for Firebase to work. 
// You can find this in your google-services.json file as 'client_id' of type 3.
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
  offlineAccess: true,
});

export const AuthService = {
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
