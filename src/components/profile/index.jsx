import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';

const { User, Mail, Phone, Save, Lock, Eye, EyeOff } = LucideIcons;

// Profile Form Component
export function ProfileForm() {
  const { user, updateProfile } = useAuthStore();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Load user metadata from auth
        setProfile({
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: ''
        });
        
        // Try to load additional profile data from the database
        const profileData = await db.getUserProfile(user.id);
        if (profileData) {
          setProfile(prev => ({
            ...prev,
            phone: profileData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update user metadata in auth
      await updateProfile({
        first_name: profile.firstName,
        last_name: profile.lastName
      });
      
      // Update additional profile data in database
      await db.updateUserProfile(user.id, {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone
      });
      
      toast.success('บันทึกข้อมูลโปรไฟล์สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ข้อมูลส่วนตัว</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">ชื่อ</Label>
              <div className="relative">
                <SafeIcon icon={User} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="firstName" 
                  placeholder="ชื่อ" 
                  value={profile.firstName} 
                  onChange={(e) => handleChange('firstName', e.target.value)} 
                  className="pl-10" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">นามสกุล</Label>
              <div className="relative">
                <SafeIcon icon={User} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="lastName" 
                  placeholder="นามสกุล" 
                  value={profile.lastName} 
                  onChange={(e) => handleChange('lastName', e.target.value)} 
                  className="pl-10" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <SafeIcon icon={Mail} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  value={profile.email} 
                  disabled 
                  className="pl-10 bg-muted" 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ไม่สามารถเปลี่ยนแปลงอีเมลได้
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <div className="relative">
                <SafeIcon icon={Phone} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  placeholder="เบอร์โทรศัพท์" 
                  value={profile.phone} 
                  onChange={(e) => handleChange('phone', e.target.value)} 
                  className="pl-10" 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              <SafeIcon icon={Save} className="mr-2 h-4 w-4" />
              {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Security Form Component
export function SecurityForm() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwords.new !== passwords.confirm) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    
    if (passwords.new.length < 6) {
      setError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    setLoading(true);
    try {
      // First try to sign in with current password to verify
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.getUser()?.data?.user?.email,
        password: passwords.current,
      });
      
      if (signInError) {
        throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
      }
      
      // Then update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
      
      // Clear form
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });
    } catch (error) {
      setError(error.message);
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
              <div className="relative">
                <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="currentPassword" 
                  type={showPasswords.current ? 'text' : 'password'} 
                  placeholder="รหัสผ่านปัจจุบัน" 
                  value={passwords.current} 
                  onChange={(e) => handleChange('current', e.target.value)} 
                  className="pl-10 pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('current')} 
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <SafeIcon icon={showPasswords.current ? EyeOff : Eye} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
              <div className="relative">
                <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="newPassword" 
                  type={showPasswords.new ? 'text' : 'password'} 
                  placeholder="รหัสผ่านใหม่" 
                  value={passwords.new} 
                  onChange={(e) => handleChange('new', e.target.value)} 
                  className="pl-10 pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('new')} 
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <SafeIcon icon={showPasswords.new ? EyeOff : Eye} className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
              <div className="relative">
                <SafeIcon icon={Lock} className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type={showPasswords.confirm ? 'text' : 'password'} 
                  placeholder="ยืนยันรหัสผ่านใหม่" 
                  value={passwords.confirm} 
                  onChange={(e) => handleChange('confirm', e.target.value)} 
                  className="pl-10 pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('confirm')} 
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <SafeIcon icon={showPasswords.confirm ? EyeOff : Eye} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <SafeIcon icon={Save} className="mr-2 h-4 w-4" />
              {loading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}