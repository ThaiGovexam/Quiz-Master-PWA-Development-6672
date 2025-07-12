import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import QuizSetGrid from '../components/navigation/QuizSetGrid';
import Breadcrumb from '../components/navigation/Breadcrumb';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';

export default function CoursePage() {
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