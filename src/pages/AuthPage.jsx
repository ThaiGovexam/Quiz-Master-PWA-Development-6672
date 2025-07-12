import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page to redirect to after successful login
  const from = location.state?.from?.pathname || '/';
  
  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };
  
  const toggleAuthView = () => {
    setIsLoginView(!isLoginView);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Quiz Master v2.0</h1>
          <p className="text-muted-foreground mt-2">ระบบข้อสอบออนไลน์ที่ทันสมัย</p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isLoginView ? 'login' : 'register'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoginView ? (
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={toggleAuthView}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={toggleAuthView}
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Quiz Master v2.0 &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}