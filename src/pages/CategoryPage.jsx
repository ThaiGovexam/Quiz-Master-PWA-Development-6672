import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import SubcategoryGrid from '../components/navigation/SubcategoryGrid';
import Breadcrumb from '../components/navigation/Breadcrumb';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';

export default function CategoryPage() {
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