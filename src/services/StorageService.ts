import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@user_session';
const ORDERS_KEY = '@active_orders';

export interface ActiveOrder {
  id: string;
  partnerId: string;
  partnerName: string;
  serviceName: string;
  totalAmount: number;
  status: 'Pesanan Diterima' | 'Penjemputan' | 'Proses' | 'Pengantaran' | 'Selesai';
  date: string;
  estimatedPoints: number;
}

export interface UserSession {
  id?: string;
  name?: string;
  email: string;
  type: 'customer' | 'partner';
  loginDate: string;
  balance: number;
  loyaltyPoints: number;
}

export const StorageService = {
  /**
   * Saves the user session to persistent storage
   */
  async setUserSession(session: UserSession): Promise<void> {
    try {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem(SESSION_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving session:', e);
    }
  },

  /**
   * Retrieves the user session from storage
   */
  async getUserSession(): Promise<UserSession | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(SESSION_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving session:', e);
      return null;
    }
  },

  /**
   * Clears the current session (Logout)
   */
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  },

  /**
   * Saves a list of active orders
   */
  async setActiveOrders(orders: ActiveOrder[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(orders);
      await AsyncStorage.setItem(ORDERS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  },

  /**
   * Retrieves all active orders
   */
  async getActiveOrders(): Promise<ActiveOrder[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ORDERS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error retrieving orders:', e);
      return [];
    }
  },

  /**
   * Adds a single active order
   */
  async addActiveOrder(order: ActiveOrder): Promise<void> {
    try {
      const orders = await this.getActiveOrders();
      orders.unshift(order); // Add new order to the top
      await this.setActiveOrders(orders);
    } catch (e) {
      console.error('Error adding active order:', e);
    }
  },
};
