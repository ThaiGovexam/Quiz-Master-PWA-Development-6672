import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePointStore } from '../store/pointStore';
import { Button } from '../components/ui/button';
import { FiUser, FiLogOut, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { userPoints, loadUserPoints } = usePointStore();
  const [showSidebar, setShowSidebar] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadUserPoints(user.id);
    }
  }, [user, loadUserPoints]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                Quiz Master v2.0
              </h1>
              
              {user && userPoints !== undefined && (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">คะแนน:</span>
                  <span className="text-sm font-semibold text-primary">
                    {new Intl.NumberFormat('th-TH').format(userPoints)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="md:hidden"
                  >
                    <SafeIcon icon={showSidebar ? FiX : FiMenu} className="h-4 w-4" />
                  </Button>
                  
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      สวัสดี, {user.user_metadata?.first_name || user.email}
                    </span>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/profile')}
                    >
                      <SafeIcon icon={FiUser} className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/settings')}
                    >
                      <SafeIcon icon={FiSettings} className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                    >
                      <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => navigate('/auth/login')}>
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      {showSidebar && user && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowSidebar(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-64 bg-card border-l border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">เมนู</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
              </Button>
            </div>
            
            {userPoints !== undefined && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">คะแนนของคุณ</div>
                <div className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('th-TH').format(userPoints)}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                สวัสดี, {user.user_metadata?.first_name || user.email}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  navigate('/profile');
                  setShowSidebar(false);
                }}
              >
                <SafeIcon icon={FiUser} className="h-4 w-4 mr-2" />
                โปรไฟล์
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  navigate('/points');
                  setShowSidebar(false);
                }}
              >
                <SafeIcon icon={FiUser} className="h-4 w-4 mr-2" />
                ประวัติคะแนน
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  navigate('/settings');
                  setShowSidebar(false);
                }}
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4 mr-2" />
                ตั้งค่า
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <SafeIcon icon={FiLogOut} className="h-4 w-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Quiz Master v2.0 &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}