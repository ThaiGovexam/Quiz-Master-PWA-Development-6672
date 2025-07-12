import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  
  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      set({
        session,
        user: session?.user || null,
        loading: false
      });
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          set({
            session,
            user: session?.user || null
          });
          
          // Handle auth events
          if (event === 'SIGNED_IN') {
            toast.success('เข้าสู่ระบบสำเร็จ');
          } else if (event === 'SIGNED_OUT') {
            toast.info('ออกจากระบบสำเร็จ');
          } else if (event === 'USER_UPDATED') {
            toast.success('อัปเดตข้อมูลสำเร็จ');
          }
        }
      );
      
      // Return unsubscribe function
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false });
    }
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    set({ user: null, session: null });
  },
  
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    set({ user: data.user });
    return data;
  },
  
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    return true;
  },
  
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    return data;
  }
}));