import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePointStore } from '../store/pointStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProfileForm from '../components/profile/ProfileForm';
import SecurityForm from '../components/profile/SecurityForm';
import PointDisplay from '../components/point/PointDisplay';
import { FiUser, FiLock, FiCreditCard, FiLogOut } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthGuard from '../components/auth/AuthGuard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const { userPoints } = usePointStore();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('ออกจากระบบสำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };
  
  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>
            <p className="text-muted-foreground">
              จัดการข้อมูลส่วนตัวและตั้งค่าความปลอดภัย
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center"
          >
            <SafeIcon icon={FiLogOut} className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center">
                  <SafeIcon icon={FiUser} className="mr-2 h-4 w-4" />
                  ข้อมูลส่วนตัว
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <SafeIcon icon={FiLock} className="mr-2 h-4 w-4" />
                  ความปลอดภัย
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <ProfileForm />
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <SecurityForm />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <PointDisplay points={userPoints} showDetails={true} />
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <SafeIcon icon={FiCreditCard} className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                  <div>
                    <h3 className="font-medium">เติมคะแนน</h3>
                    <p className="text-sm text-muted-foreground">
                      เติมคะแนนผ่าน PromptPay
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/points/topup')}
                  >
                    เติมคะแนน
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <SafeIcon icon={FiUser} className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                  <div>
                    <h3 className="font-medium">ข้อมูลบัญชี</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    สมัครสมาชิกเมื่อ: {new Date(user?.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}