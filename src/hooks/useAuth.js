import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

/**
 * Hook for managing authentication-related functionality
 */
export function useAuth() {
  const { 
    user, 
    session, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    updateProfile 
  } = useAuthStore();
  const navigate = useNavigate();
  
  const login = async (email, password) => {
    try {
      await signIn(email, password);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      return false;
    }
  };
  
  const register = async (email, password, userData) => {
    try {
      await signUp(email, password, userData);
      toast.success('สมัครสมาชิกสำเร็จ');
      return true;
    } catch (error) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      return false;
    }
  };
  
  const logout = async () => {
    try {
      await signOut();
      toast.success('ออกจากระบบสำเร็จ');
      navigate('/');
      return true;
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
      return false;
    }
  };
  
  const updateUserProfile = async (updates) => {
    try {
      await updateProfile(updates);
      toast.success('อัปเดตข้อมูลสำเร็จ');
      return true;
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      return false;
    }
  };
  
  return {
    user,
    session,
    isAuthenticated: !!user,
    isLoading: loading,
    login,
    register,
    logout,
    updateUserProfile
  };
}

export default useAuth;