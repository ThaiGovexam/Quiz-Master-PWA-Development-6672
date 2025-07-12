import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FiBookOpen, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function HomePage() {
  const navigate = useNavigate();
  const { 
    categories, 
    loading, 
    error, 
    loadCategories, 
    setCurrentCategory 
  } = useQuizStore();
  
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    navigate(`/category/${category.id}`);
  };
  
  const getIcon = (iconName) => {
    const iconMap = {
      'book': FiBookOpen,
      'users': FiUsers,
      'trending': FiTrendingUp,
      'award': FiAward
    };
    
    return iconMap[iconName] || FiBookOpen;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCategorySelect(category)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <SafeIcon 
                    icon={getIcon(category.icon)} 
                    className="h-6 w-6 text-primary" 
                  />
                </div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">{category.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {category.subcategory_count || 0} หมวดย่อย
                </span>
                
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(category);
                  }} 
                  size="sm"
                >
                  เข้าสู่หมวด
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}