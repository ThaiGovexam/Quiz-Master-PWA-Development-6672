import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import CourseGrid from '../components/navigation/CourseGrid';
import Breadcrumb from '../components/navigation/Breadcrumb';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';

export default function SubcategoryPage() {
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