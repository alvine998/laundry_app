import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types/address';

const SESSION_KEY = '@user_session';
const ORDERS_KEY = '@active_orders';
const ADDRESSES_KEY = '@user_addresses';

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Rumah',
    name: 'Alvin Nugraha',
    phone: '0812-3456-7890',
    address: 'Jl. Sudirman No. 123, RT 05/RW 03, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan 12190',
    isDefault: true,
    icon: 'home-outline',
  },
  {
    id: '2',
    label: 'Kantor',
    name: 'Alvin Nugraha',
    phone: '0812-3456-7890',
    address: 'Gedung Wisma 46, Lantai 21, Jl. Jend. Sudirman Kav. 1, Jakarta Pusat 10220',
    isDefault: false,
    icon: 'office-building-outline',
  },
];

export interface ActiveOrder {
  id: string;
  partnerId: string;
  partnerName: string;
  serviceName: string;
  totalAmount: number;
  status: 'Pesanan Diterima' | 'Penjemputan' | 'Proses' | 'Pengantaran' | 'Selesai';
  date: string;
  estimatedPoints: number;
  weight?: string;
}

export interface UserSession {
  id?: string;
  name?: string;
  email: string;
  type: 'customer' | 'partner';
  loginDate: string;
  balance: number;
  loyaltyPoints: number;
  token?: string;
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

  /**
   * Updates a single active order status and data
   */
  async updateActiveOrder(orderId: string, updates: Partial<ActiveOrder>): Promise<void> {
    try {
      const orders = await this.getActiveOrders();
      const index = orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        await this.setActiveOrders(orders);
      }
    } catch (e) {
      console.error('Error updating active order:', e);
    }
  },

  /**
   * Retrieves all addresses
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ADDRESSES_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      // Return mock data if first time
      await this.setAddresses(MOCK_ADDRESSES);
      return MOCK_ADDRESSES;
    } catch (e) {
      console.error('Error retrieving addresses:', e);
      return [];
    }
  },

  /**
   * Saves the list of addresses
   */
  async setAddresses(addresses: Address[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(addresses);
      await AsyncStorage.setItem(ADDRESSES_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving addresses:', e);
    }
  },

  /**
   * Adds a new address
   */
  async addAddress(address: Address): Promise<void> {
    const addresses = await this.getAddresses();
    if (address.isDefault) {
      addresses.forEach(a => (a.isDefault = false));
    }
    addresses.push(address);
    await this.setAddresses(addresses);
  },

  /**
   * Updates an existing address
   */
  async updateAddress(address: Address): Promise<void> {
    const addresses = await this.getAddresses();
    const index = addresses.findIndex(a => a.id === address.id);
    if (index !== -1) {
      if (address.isDefault) {
        addresses.forEach(a => (a.isDefault = false));
      }
      addresses[index] = address;
      await this.setAddresses(addresses);
    }
  },

  /**
   * Deletes an address
   */
  async deleteAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    const isDefault = addresses.find(a => a.id === id)?.isDefault;
    const filtered = addresses.filter(a => a.id !== id);
    // If we deleted the default one, make the first one default if available
    if (isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    await this.setAddresses(filtered);
  },

  /**
   * Sets an address as default
   */
  async setDefaultAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    addresses.forEach(a => {
      a.isDefault = a.id === id;
    });
    await this.setAddresses(addresses);
  },
};
