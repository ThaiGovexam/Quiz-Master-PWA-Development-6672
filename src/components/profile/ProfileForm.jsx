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

const { User, Mail, Phone, Save } = LucideIcons;

export default function ProfileForm() {
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
                <SafeIcon 
                  icon={User} 
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                />
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
                <SafeIcon 
                  icon={User} 
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                />
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
                <SafeIcon 
                  icon={Mail} 
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                />
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
                <SafeIcon 
                  icon={Phone} 
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" 
                />
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