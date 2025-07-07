import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useQuizStore } from './store/quizStore';
import { usePointStore } from './store/pointStore';

// Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Breadcrumb from './components/navigation/Breadcrumb';
import CategoryGrid from './components/navigation/CategoryGrid';
import SubcategoryGrid from './components/navigation/SubcategoryGrid';
import CourseGrid from './components/navigation/CourseGrid';
import QuizSetGrid from './components/navigation/QuizSetGrid';
import QuizInterface from './components/quiz/QuizInterface';
import QuizResult from './components/quiz/QuizResult';
import PointDisplay from './components/point/PointDisplay';
import PointHistory from './components/point/PointHistory';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import SafeIcon from './common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { User, LogOut, Settings, Menu, X } = LucideIcons;

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('categories');
  const [showSidebar, setShowSidebar] = useState(false);
  const [quizState, setQuizState] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const { user, loading, initialize, signOut } = useAuthStore();
  const { 
    categories, 
    subcategories, 
    courses, 
    quizSets, 
    questions,
    currentCategory,
    currentSubcategory,
    currentCourse,
    currentQuizSet,
    loadCategories,
    loadSubcategories,
    loadCourses,
    loadQuizSets,
    loadQuestions,
    setCurrentCategory,
    setCurrentSubcategory,
    setCurrentCourse,
    setCurrentQuizSet
  } = useQuizStore();

  const { userPoints, transactions, loadUserPoints, loadTransactions, addPoints } = usePointStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadUserPoints(user.id);
      loadTransactions(user.id);
      loadCategories();
    }
  }, [user, loadUserPoints, loadTransactions, loadCategories]);

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setCurrentView('categories');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('categories');
    setShowAuth(false);
  };

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setCurrentView('subcategories');
    loadSubcategories(category.id);
  };

  const handleSubcategorySelect = (subcategory) => {
    setCurrentSubcategory(subcategory);
    setCurrentView('courses');
    loadCourses(subcategory.id);
  };

  const handleCourseSelect = (course) => {
    setCurrentCourse(course);
    setCurrentView('quizSets');
    loadQuizSets(course.id);
  };

  const handleQuizSetSelect = async (quizSet) => {
    setCurrentQuizSet(quizSet);
    await loadQuestions(quizSet.id);
    setCurrentView('quiz');
    setQuizState({ quiz: quizSet, questions });
  };

  const handleQuizComplete = async (result) => {
    const score = calculateQuizScore(result.answers, quizState.questions);
    
    // Add points for correct answers
    if (user && score.points > 0) {
      await addPoints(user.id, score.points, 'earn', `ทำข้อสอบ ${currentQuizSet.name}`);
    }

    setQuizResult({
      quiz: quizState.quiz,
      questions: quizState.questions,
      answers: result.answers,
      timeSpent: result.timeSpent,
      score
    });
    setCurrentView('result');
  };

  const handleQuizExit = () => {
    setQuizState(null);
    setCurrentView('quizSets');
  };

  const handleRetryQuiz = () => {
    setQuizResult(null);
    setCurrentView('quiz');
  };

  const handleBackToHome = () => {
    setCurrentView('categories');
    setCurrentCategory(null);
    setCurrentSubcategory(null);
    setCurrentCourse(null);
    setCurrentQuizSet(null);
    setQuizState(null);
    setQuizResult(null);
  };

  const calculateQuizScore = (answers, questions) => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      points: correct * 10
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Quiz Master v2.0</h1>
              {user && (
                <PointDisplay points={userPoints} />
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
                    <SafeIcon icon={showSidebar ? X : Menu} className="h-4 w-4" />
                  </Button>
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      สวัสดี, {user.user_metadata?.first_name || user.email}
                    </span>
                    <Button variant="ghost" size="sm">
                      <SafeIcon icon={Settings} className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <SafeIcon icon={LogOut} className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)}>
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
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-card border-l border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">เมนู</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                <SafeIcon icon={X} className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                สวัสดี, {user.user_metadata?.first_name || user.email}
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <SafeIcon icon={Settings} className="h-4 w-4 mr-2" />
                ตั้งค่า
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
                <SafeIcon icon={LogOut} className="h-4 w-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl">ยินดีต้อนรับสู่ Quiz Master v2.0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  ระบบข้อสอบออนไลน์ที่ทันสมัย พร้อมระบบคะแนนและการจ่ายเงินผ่าน PromptPay
                </p>
                <Button onClick={() => setShowAuth(true)} size="lg">
                  เริ่มต้นใช้งาน
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            {currentView !== 'categories' && (
              <Breadcrumb
                category={currentCategory}
                subcategory={currentSubcategory}
                course={currentCourse}
                quizSet={currentQuizSet}
                onHomeClick={handleBackToHome}
                onCategoryClick={() => setCurrentView('categories')}
                onSubcategoryClick={() => setCurrentView('subcategories')}
                onCourseClick={() => setCurrentView('courses')}
              />
            )}

            {/* Content based on current view */}
            {currentView === 'categories' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">เลือกหมวดหมู่</h2>
                <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
              </div>
            )}

            {currentView === 'subcategories' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">เลือกหมวดหมู่ย่อย</h2>
                <SubcategoryGrid subcategories={subcategories} onSubcategorySelect={handleSubcategorySelect} />
              </div>
            )}

            {currentView === 'courses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">เลือกคอร์สเรียน</h2>
                <CourseGrid courses={courses} onCourseSelect={handleCourseSelect} />
              </div>
            )}

            {currentView === 'quizSets' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">เลือกชุดข้อสอบ</h2>
                <QuizSetGrid quizSets={quizSets} onQuizSetSelect={handleQuizSetSelect} />
              </div>
            )}

            {currentView === 'quiz' && quizState && (
              <QuizInterface
                quiz={quizState.quiz}
                questions={questions}
                onQuizComplete={handleQuizComplete}
                onQuizExit={handleQuizExit}
              />
            )}

            {currentView === 'result' && quizResult && (
              <QuizResult
                quiz={quizResult.quiz}
                questions={quizResult.questions}
                answers={quizResult.answers}
                timeSpent={quizResult.timeSpent}
                onRetry={handleRetryQuiz}
                onBackToHome={handleBackToHome}
              />
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-1 rounded-lg max-w-md w-full mx-4">
            {authMode === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuth(false)}
              >
                ปิด
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;