import { Platform } from 'react-native';

// When running on a physical device, replace '10.0.2.2' or 'localhost' 
// with your computer's local IP address (e.g., '192.168.1.5').

// Android Emulator: 10.0.2.2 points to the host machine's localhost
// iOS Simulator: 127.0.0.1 or localhost points to the host machine's localhost

const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const PORT = 4000;

export const BASE_URL = `http://${LOCALHOST}:${PORT}`;
export const API_URL = `${BASE_URL}/api`;

export const API_CONFIG = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
};
