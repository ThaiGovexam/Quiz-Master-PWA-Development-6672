import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import Breadcrumb from '../components/navigation/Breadcrumb';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import SafeIcon from '../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { FileText, Clock, BarChart3, Trophy, Info, Users, AlertTriangle } = LucideIcons;

export default function QuizSetPage() {
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