import { create } from 'zustand';
import { db } from '../lib/supabase';

export const usePointStore = create((set, get) => ({
  userPoints: 0,
  transactions: [],
  loading: false,
  error: null,
  
  loadUserPoints: async (userId) => {
    set({ loading: true, error: null });
    try {
      const pointsData = await db.getUserPoints(userId);
      set({ userPoints: pointsData?.total_points || 0, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  loadTransactions: async (userId) => {
    set({ loading: true, error: null });
    try {
      const transactions = await db.getUserTransactions(userId);
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addPoints: async (userId, points, transactionType, description) => {
    try {
      const result = await db.updateUserPoints(userId, points, transactionType, description);
      set({ userPoints: result.total_points });
      // Reload transactions to show the new one
      get().loadTransactions(userId);
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  deductPoints: async (userId, points, transactionType, description) => {
    try {
      const result = await db.updateUserPoints(userId, -points, transactionType, description);
      set({ userPoints: result.total_points });
      // Reload transactions to show the new one
      get().loadTransactions(userId);
      return result;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));