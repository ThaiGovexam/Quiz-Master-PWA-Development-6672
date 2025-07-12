import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import { 
  HomePage, 
  CategoryPage, 
  SubcategoryPage, 
  CoursePage, 
  QuizSetPage, 
  QuizPage, 
  ResultPage, 
  ProfilePage, 
  PointHistoryPage, 
  AuthPage, 
  NotFoundPage 
} from './pages/index';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import { AuthGuard } from './components/auth/index';

function App() {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while auth is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="subcategory/:subcategoryId" element={<SubcategoryPage />} />
        <Route path="course/:courseId" element={<CoursePage />} />
        <Route path="quiz-set/:quizSetId" element={<QuizSetPage />} />
        
        {/* Protected Routes */}
        <Route path="quiz/:quizId" element={<AuthGuard><QuizPage /></AuthGuard>} />
        <Route path="result/:resultId" element={<AuthGuard><ResultPage /></AuthGuard>} />
        <Route path="profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
        <Route path="points" element={<AuthGuard><PointHistoryPage /></AuthGuard>} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;