import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePointStore } from '../store/pointStore';
import PointDisplay from '../components/point/PointDisplay';
import PointHistory from '../components/point/PointHistory';
import AuthGuard from '../components/auth/AuthGuard';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';

export default function PointHistoryPage() {
  const { user } = useAuthStore();
  const { 
    userPoints, 
    transactions, 
    loading, 
    error, 
    loadUserPoints, 
    loadTransactions 
  } = usePointStore();

  useEffect(() => {
    if (user) {
      loadUserPoints(user.id);
      loadTransactions(user.id);
    }
  }, [user, loadUserPoints, loadTransactions]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => {
          loadUserPoints(user.id);
          loadTransactions(user.id);
        }}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ประวัติคะแนน</h1>
          <p className="text-muted-foreground">
            ดูประวัติการได้รับและใช้คะแนนทั้งหมดของคุณ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PointDisplay points={userPoints} showDetails={true} />
          </div>
          
          <div className="md:col-span-2">
            <PointHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}