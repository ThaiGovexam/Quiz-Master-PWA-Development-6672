import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../ui/LoadingScreen';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { Mail, Lock, Eye, EyeOff, User } = LucideIcons;

// Auth Guard Component
export function AuthGuard({ children }) {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to login but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}

// Login Form Component
export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <SafeIcon icon={Mail} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="กรอกอีเมลของคุณ" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <div className="relative">
              <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="กรอกรหัสผ่าน" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-10 pr-10" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <SafeIcon icon={showPassword ? EyeOff : Eye} className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <button 
              type="button" 
              onClick={onSwitchToRegister} 
              className="text-primary hover:underline"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Register Form Component
export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }
    
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      onSuccess?.();
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">สมัครสมาชิก</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">ชื่อ</Label>
              <div className="relative">
                <SafeIcon icon={User} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="ชื่อ" 
                  value={formData.firstName} 
                  onChange={(e) => handleChange('firstName', e.target.value)} 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">นามสกุล</Label>
              <Input 
                id="lastName" 
                type="text" 
                placeholder="นามสกุล" 
                value={formData.lastName} 
                onChange={(e) => handleChange('lastName', e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <SafeIcon icon={Mail} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="กรอกอีเมลของคุณ" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <div className="relative">
              <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="กรอกรหัสผ่าน" 
                value={formData.password} 
                onChange={(e) => handleChange('password', e.target.value)} 
                className="pl-10 pr-10" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <SafeIcon icon={showPassword ? EyeOff : Eye} className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <div className="relative">
              <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="ยืนยันรหัสผ่าน" 
                value={formData.confirmPassword} 
                onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                className="pl-10 pr-10" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <SafeIcon icon={showConfirmPassword ? EyeOff : Eye} className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            มีบัญชีแล้ว?{' '}
            <button 
              type="button" 
              onClick={onSwitchToLogin} 
              className="text-primary hover:underline"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}