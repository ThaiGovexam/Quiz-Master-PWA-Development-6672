import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import { usePointStore } from '../store/pointStore';
import { Button } from '../components/ui/index';
import { Breadcrumb, CategoryGrid, SubcategoryGrid, CourseGrid, QuizSetGrid } from '../components/navigation/index';
import { QuizInterface, QuizResult } from '../components/quiz/index';
import { PointDisplay, PointHistory } from '../components/point/index';
import { ProfileForm, SecurityForm } from '../components/profile/index';
import { LoginForm, RegisterForm, AuthGuard } from '../components/auth/index';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/index';
import { generateQuizId } from '../lib/utils';
import { db, supabase } from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const { 
  BookOpen, Users, TrendingUp, Award, User, LogOut, 
  Settings, Home, CreditCard, FileText, Clock, BarChart3, Trophy,
  Info, AlertTriangle
} = LucideIcons;

// Home Page
export function HomePage() {
  const navigate = useNavigate();
  const { categories, loading, error, loadCategories, setCurrentCategory } = useQuizStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    navigate(`/category/${category.id}`);
  };

  const getIcon = (iconName) => {
    const iconMap = {
      'book': BookOpen,
      'users': Users,
      'trending': TrendingUp,
      'award': Award
    };
    return iconMap[iconName] || BookOpen;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadCategories}>ลองใหม่</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">เลือกหมวดหมู่</h2>
      <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
    </div>
  );
}

// Category Page
export function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { 
    loadSubcategories, 
    subcategories, 
    loading, 
    error,
    currentCategory,
    setCurrentCategory,
    setCurrentSubcategory
  } = useQuizStore();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we don't have the category in state, fetch it
        if (!currentCategory || currentCategory.id !== categoryId) {
          // In a real app, you would fetch the category by ID
          // For now, let's assume we have a method to get it
          const categoryData = await fetchCategoryById(categoryId);
          setCategory(categoryData);
          setCurrentCategory(categoryData);
        } else {
          setCategory(currentCategory);
        }
        
        await loadSubcategories(categoryId);
      } catch (error) {
        console.error("Error loading category data:", error);
      }
    };
    
    fetchData();
  }, [categoryId, currentCategory, loadSubcategories, setCurrentCategory]);

  const fetchCategoryById = async (id) => {
    // This would be replaced with an actual API call
    // For now, simulate fetching a category
    return {
      id,
      name: "คณิตศาสตร์",
      description: "ข้อสอบและแบบฝึกหัดคณิตศาสตร์"
    };
  };

  const handleSubcategorySelect = (subcategory) => {
    setCurrentSubcategory(subcategory);
    navigate(`/subcategory/${subcategory.id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading || !category) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadSubcategories(categoryId)}>ลองใหม่</Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb 
        category={category}
        onHomeClick={handleBackToHome}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{category.name}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>
      
      {subcategories.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">ไม่พบหมวดย่อย</h3>
          <p className="text-muted-foreground">
            ยังไม่มีหมวดย่อยในหมวดหมู่นี้
          </p>
        </div>
      ) : (
        <SubcategoryGrid 
          subcategories={subcategories} 
          onSubcategorySelect={handleSubcategorySelect}
        />
      )}
    </div>
  );
}

// Subcategory Page
export function SubcategoryPage() {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();
  const { 
    loadCourses, 
    courses, 
    loading, 
    error,
    currentCategory,
    currentSubcategory,
    setCurrentSubcategory,
    setCurrentCourse
  } = useQuizStore();
  const [subcategory, setSubcategory] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we don't have the subcategory in state, fetch it
        if (!currentSubcategory || currentSubcategory.id !== subcategoryId) {
          // In a real app, you would fetch the subcategory by ID
          const subcategoryData = await fetchSubcategoryById(subcategoryId);
          setSubcategory(subcategoryData);
          setCurrentSubcategory(subcategoryData);
          
          // Also fetch the parent category if needed
          if (!currentCategory) {
            const categoryData = await fetchCategoryById(subcategoryData.category_id);
            setCategory(categoryData);
          } else {
            setCategory(currentCategory);
          }
        } else {
          setSubcategory(currentSubcategory);
          setCategory(currentCategory);
        }
        
        await loadCourses(subcategoryId);
      } catch (error) {
        console.error("Error loading subcategory data:", error);
      }
    };
    
    fetchData();
  }, [subcategoryId, currentSubcategory, currentCategory, loadCourses, setCurrentSubcategory]);

  const fetchSubcategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "พีชคณิต",
      description: "พีชคณิตพื้นฐาน",
      category_id: "category-123"
    };
  };

  const fetchCategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "คณิตศาสตร์",
      description: "ข้อสอบและแบบฝึกหัดคณิตศาสตร์"
    };
  };

  const handleCourseSelect = (course) => {
    setCurrentCourse(course);
    navigate(`/course/${course.id}`);
  };

  const handleBackToCategory = () => {
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading || !subcategory) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadCourses(subcategoryId)}>ลองใหม่</Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb 
        category={category}
        subcategory={subcategory}
        onHomeClick={handleBackToHome}
        onCategoryClick={handleBackToCategory}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{subcategory.name}</h2>
          <p className="text-muted-foreground">{subcategory.description}</p>
        </div>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">ไม่พบคอร์ส</h3>
          <p className="text-muted-foreground">
            ยังไม่มีคอร์สในหมวดย่อยนี้
          </p>
        </div>
      ) : (
        <CourseGrid 
          courses={courses} 
          onCourseSelect={handleCourseSelect}
        />
      )}
    </div>
  );
}

// Course Page
export function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { 
    loadQuizSets, 
    quizSets, 
    loading, 
    error,
    currentCategory,
    currentSubcategory,
    currentCourse,
    setCurrentCourse,
    setCurrentQuizSet
  } = useQuizStore();
  const [course, setCourse] = useState(null);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we don't have the course in state, fetch it
        if (!currentCourse || currentCourse.id !== courseId) {
          // In a real app, you would fetch the course by ID
          const courseData = await fetchCourseById(courseId);
          setCourse(courseData);
          setCurrentCourse(courseData);
          
          // Also fetch the parent subcategory and category if needed
          if (!currentSubcategory) {
            const subcategoryData = await fetchSubcategoryById(courseData.subcategory_id);
            setSubcategory(subcategoryData);
            
            if (!currentCategory) {
              const categoryData = await fetchCategoryById(subcategoryData.category_id);
              setCategory(categoryData);
            } else {
              setCategory(currentCategory);
            }
          } else {
            setSubcategory(currentSubcategory);
            setCategory(currentCategory);
          }
        } else {
          setCourse(currentCourse);
          setSubcategory(currentSubcategory);
          setCategory(currentCategory);
        }
        
        await loadQuizSets(courseId);
      } catch (error) {
        console.error("Error loading course data:", error);
      }
    };
    
    fetchData();
  }, [courseId, currentCourse, currentSubcategory, currentCategory, loadQuizSets, setCurrentCourse]);

  const fetchCourseById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "พีชคณิตพื้นฐาน",
      description: "เรียนรู้พีชคณิตเบื้องต้น",
      subcategory_id: "subcategory-123",
      price: 0,
      rating: 4.3,
      review_count: 200,
      student_count: 1500
    };
  };

  const fetchSubcategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "พีชคณิต",
      description: "พีชคณิตพื้นฐาน",
      category_id: "category-123"
    };
  };

  const fetchCategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "คณิตศาสตร์",
      description: "ข้อสอบและแบบฝึกหัดคณิตศาสตร์"
    };
  };

  const handleQuizSetSelect = (quizSet) => {
    setCurrentQuizSet(quizSet);
    navigate(`/quiz-set/${quizSet.id}`);
  };

  const handleBackToSubcategory = () => {
    if (subcategory) {
      navigate(`/subcategory/${subcategory.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToCategory = () => {
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading || !course) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadQuizSets(courseId)}>ลองใหม่</Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb 
        category={category}
        subcategory={subcategory}
        course={course}
        onHomeClick={handleBackToHome}
        onCategoryClick={handleBackToCategory}
        onSubcategoryClick={handleBackToSubcategory}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{course.name}</h2>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>
      
      {quizSets.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">ไม่พบชุดข้อสอบ</h3>
          <p className="text-muted-foreground">
            ยังไม่มีชุดข้อสอบในคอร์สนี้
          </p>
        </div>
      ) : (
        <QuizSetGrid 
          quizSets={quizSets} 
          onQuizSetSelect={handleQuizSetSelect}
        />
      )}
    </div>
  );
}

// Quiz Set Page
export function QuizSetPage() {
  const { quizSetId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    loadQuestions, 
    questions, 
    loading, 
    error,
    currentCategory,
    currentSubcategory,
    currentCourse,
    currentQuizSet,
    setCurrentQuizSet,
    startQuiz
  } = useQuizStore();
  const [quizSet, setQuizSet] = useState(null);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we don't have the quiz set in state, fetch it
        if (!currentQuizSet || currentQuizSet.id !== quizSetId) {
          // In a real app, you would fetch the quiz set by ID
          const quizSetData = await fetchQuizSetById(quizSetId);
          setQuizSet(quizSetData);
          setCurrentQuizSet(quizSetData);
          
          // Also fetch the parent course, subcategory and category if needed
          if (!currentCourse) {
            const courseData = await fetchCourseById(quizSetData.course_id);
            setCourse(courseData);
            
            if (!currentSubcategory) {
              const subcategoryData = await fetchSubcategoryById(courseData.subcategory_id);
              setSubcategory(subcategoryData);
              
              if (!currentCategory) {
                const categoryData = await fetchCategoryById(subcategoryData.category_id);
                setCategory(categoryData);
              } else {
                setCategory(currentCategory);
              }
            } else {
              setSubcategory(currentSubcategory);
              setCategory(currentCategory);
            }
          } else {
            setCourse(currentCourse);
            setSubcategory(currentSubcategory);
            setCategory(currentCategory);
          }
        } else {
          setQuizSet(currentQuizSet);
          setCourse(currentCourse);
          setSubcategory(currentSubcategory);
          setCategory(currentCategory);
        }
        
        await loadQuestions(quizSetId);
      } catch (error) {
        console.error("Error loading quiz set data:", error);
      }
    };
    
    fetchData();
  }, [
    quizSetId, 
    currentQuizSet, 
    currentCourse, 
    currentSubcategory, 
    currentCategory, 
    loadQuestions, 
    setCurrentQuizSet
  ]);

  const fetchQuizSetById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "ทดสอบพีชคณิตชุดที่ 1",
      description: "ทดสอบความรู้พีชคณิตเบื้องต้น",
      course_id: "course-123",
      difficulty: "easy",
      question_count: 12,
      time_limit: 18,
      pass_score: 60,
      points: 120,
      attempt_count: 0
    };
  };

  const fetchCourseById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "พีชคณิตพื้นฐาน",
      description: "เรียนรู้พีชคณิตเบื้องต้น",
      subcategory_id: "subcategory-123"
    };
  };

  const fetchSubcategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "พีชคณิต",
      description: "พีชคณิตพื้นฐาน",
      category_id: "category-123"
    };
  };

  const fetchCategoryById = async (id) => {
    // This would be replaced with an actual API call
    return {
      id,
      name: "คณิตศาสตร์",
      description: "ข้อสอบและแบบฝึกหัดคณิตศาสตร์"
    };
  };

  const handleStartQuiz = () => {
    if (!user) {
      navigate('/auth/login', { 
        state: { from: `/quiz-set/${quizSetId}` }
      });
      return;
    }
    
    const quizId = `${quizSetId}_${Date.now()}`;
    startQuiz(quizSet, questions);
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToCourse = () => {
    if (course) {
      navigate(`/course/${course.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToSubcategory = () => {
    if (subcategory) {
      navigate(`/subcategory/${subcategory.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToCategory = () => {
    if (category) {
      navigate(`/category/${category.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'medium': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return 'ไม่ระบุ';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading || !quizSet) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadQuestions(quizSetId)}>ลองใหม่</Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb 
        category={category}
        subcategory={subcategory}
        course={course}
        quizSet={quizSet}
        onHomeClick={handleBackToHome}
        onCategoryClick={handleBackToCategory}
        onSubcategoryClick={handleBackToSubcategory}
        onCourseClick={handleBackToCourse}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">{quizSet.name}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quizSet.difficulty)}`}>
              {getDifficultyText(quizSet.difficulty)}
            </span>
          </div>
          <p className="text-muted-foreground">{quizSet.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <SafeIcon icon={Info} className="h-5 w-5 text-primary" />
              <span>รายละเอียด</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FileText} className="h-4 w-4 text-muted-foreground" />
                  <span>จำนวนข้อ</span>
                </div>
                <span className="font-medium">{quizSet.question_count} ข้อ</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={Clock} className="h-4 w-4 text-muted-foreground" />
                  <span>เวลาทำข้อสอบ</span>
                </div>
                <span className="font-medium">{quizSet.time_limit} นาที</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={BarChart3} className="h-4 w-4 text-muted-foreground" />
                  <span>เกณฑ์ผ่าน</span>
                </div>
                <span className="font-medium">{quizSet.pass_score}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={Trophy} className="h-4 w-4 text-muted-foreground" />
                  <span>คะแนนที่ได้รับ</span>
                </div>
                <span className="font-medium text-primary">{quizSet.points} คะแนน</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={Users} className="h-4 w-4 text-muted-foreground" />
                  <span>ผู้ทำข้อสอบ</span>
                </div>
                <span className="font-medium">{quizSet.attempt_count} คน</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <SafeIcon icon={AlertTriangle} className="h-5 w-5 text-primary" />
              <span>คำแนะนำ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                เมื่อเริ่มทำข้อสอบ ระบบจะเริ่มนับเวลาทันที คุณมีเวลา {quizSet.time_limit} นาทีในการทำข้อสอบ
                ทั้งหมด {quizSet.question_count} ข้อ
              </p>
              <p>
                คุณสามารถกลับมาแก้ไขคำตอบได้ภายในเวลาที่กำหนด และระบบจะบันทึกคำตอบอัตโนมัติเมื่อหมดเวลา
              </p>
              <p>
                เกณฑ์ผ่านอยู่ที่ {quizSet.pass_score}% และคุณจะได้รับคะแนน {quizSet.points} คะแนนเมื่อทำข้อสอบผ่าน
              </p>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleStartQuiz}
                  className="px-6"
                  size="lg"
                >
                  เริ่มทำข้อสอบ
                </Button>
              </div>
              
              {!user && (
                <p className="text-sm text-center text-muted-foreground">
                  คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถทำข้อสอบได้
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Quiz Page
export function QuizPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPoints } = usePointStore();
  const { 
    currentQuiz, 
    questions, 
    loading, 
    error, 
    endQuiz 
  } = useQuizStore();
  const [resultId, setResultId] = useState(null);

  useEffect(() => {
    // If there's no quiz loaded, redirect to home
    if (!currentQuiz && !loading) {
      navigate('/');
    }
  }, [currentQuiz, loading, navigate]);

  const handleQuizComplete = async (result) => {
    if (!user || !currentQuiz) return;
    
    try {
      // Calculate score
      let correctCount = 0;
      Object.entries(result.answers).forEach(([index, answer]) => {
        if (answer === questions[index].correct_answer) {
          correctCount++;
        }
      });
      
      const totalQuestions = questions.length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const passed = percentage >= currentQuiz.pass_score;
      const pointsEarned = passed ? currentQuiz.points : 0;
      
      // Create the result object
      const quizAttempt = {
        user_id: user.id,
        quiz_set_id: currentQuiz.id,
        answers: result.answers,
        score: correctCount,
        percentage: percentage,
        time_spent: result.timeSpent,
        passed: passed,
        points_earned: pointsEarned,
        started_at: new Date(Date.now() - result.timeSpent * 1000).toISOString(),
        completed_at: result.completedAt
      };
      
      // Save to database
      const savedAttempt = await db.createQuizAttempt(quizAttempt);
      
      // Add points if passed
      if (passed && pointsEarned > 0) {
        await addPoints(
          user.id, 
          pointsEarned, 
          'earn', 
          `ทำข้อสอบ ${currentQuiz.name} สำเร็จ`
        );
      }
      
      // Generate a result ID
      const newResultId = generateQuizId();
      setResultId(newResultId);
      
      // Store the result in localStorage for the result page
      localStorage.setItem(`quiz_result_${newResultId}`, JSON.stringify({
        quiz: currentQuiz,
        questions,
        answers: result.answers,
        timeSpent: result.timeSpent,
        score: {
          correct: correctCount,
          total: totalQuestions,
          percentage,
          passed,
          pointsEarned
        }
      }));
      
      // End the quiz in store
      endQuiz();
      
      // Navigate to result page
      navigate(`/result/${newResultId}`);
    } catch (error) {
      console.error("Error completing quiz:", error);
    }
  };

  const handleQuizExit = () => {
    endQuiz();
    navigate('/');
  };

  if (loading || !currentQuiz) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button onClick={handleQuizExit}>กลับไปหน้าหลัก</button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <QuizInterface
        quiz={currentQuiz}
        questions={questions}
        onQuizComplete={handleQuizComplete}
        onQuizExit={handleQuizExit}
      />
    </AuthGuard>
  );
}

// Result Page
export function ResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResult = () => {
      try {
        const resultData = localStorage.getItem(`quiz_result_${resultId}`);
        
        if (!resultData) {
          throw new Error('ไม่พบผลลัพธ์ข้อสอบ');
        }
        
        setResult(JSON.parse(resultData));
      } catch (error) {
        setError(error.message || 'เกิดข้อผิดพลาดในการโหลดผลลัพธ์ข้อสอบ');
      } finally {
        setLoading(false);
      }
    };
    
    loadResult();
  }, [resultId]);

  const handleRetry = () => {
    if (result?.quiz) {
      navigate(`/quiz-set/${result.quiz.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !result) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error || 'ไม่พบผลลัพธ์ข้อสอบ'}</p>
        <Button onClick={handleBackToHome}>กลับไปหน้าหลัก</Button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <QuizResult 
        quiz={result.quiz}
        questions={result.questions}
        answers={result.answers}
        timeSpent={result.timeSpent}
        onRetry={handleRetry}
        onBackToHome={handleBackToHome}
      />
    </AuthGuard>
  );
}

// Point History Page
export function PointHistoryPage() {
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

// Profile Page
export function ProfilePage() {
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
            <SafeIcon icon={LogOut} className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center">
                  <SafeIcon icon={User} className="mr-2 h-4 w-4" />
                  ข้อมูลส่วนตัว
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <SafeIcon icon={Settings} className="mr-2 h-4 w-4" />
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
                  <SafeIcon icon={CreditCard} className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                  <div>
                    <h3 className="font-medium">เติมคะแนน</h3>
                    <p className="text-sm text-muted-foreground">
                      เติมคะแนนผ่าน PromptPay
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full" onClick={() => navigate('/points/topup')}>
                    เติมคะแนน
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <SafeIcon icon={User} className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
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

// Auth Page
export function AuthPage() {
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
          <p>Quiz Master v2.0 &copy;{new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

// Not Found Page
export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-muted-foreground mb-6">
        หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่
      </p>
      <Link to="/">
        <Button>กลับไปหน้าหลัก</Button>
      </Link>
    </div>
  );
}