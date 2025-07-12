import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <SafeIcon 
                icon={FiMail} 
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
              />
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
              <SafeIcon 
                icon={FiLock} 
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
              />
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
                <SafeIcon 
                  icon={showPassword ? FiEyeOff : FiEye} 
                  className="h-4 w-4" 
                />
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
            <Link to="/auth/register" className="text-primary hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </form>
      </CardContent>
    </>
  );
}