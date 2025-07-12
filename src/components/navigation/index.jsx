import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { ChevronRight, Home, Folder, FileText, Clock, BookOpen, Users, Star, BarChart3, Trophy } = LucideIcons;

// Breadcrumb Component
export function Breadcrumb({ 
  category, 
  subcategory, 
  course, 
  quizSet,
  onCategoryClick,
  onSubcategoryClick,
  onCourseClick,
  onHomeClick
}) {
  const items = [
    { label: 'หน้าแรก', onClick: onHomeClick, icon: Home }
  ];
  
  if (category) {
    items.push({ label: category.name, onClick: onCategoryClick });
  }
  
  if (subcategory) {
    items.push({ label: subcategory.name, onClick: onSubcategoryClick });
  }
  
  if (course) {
    items.push({ label: course.name, onClick: onCourseClick });
  }
  
  if (quizSet) {
    items.push({ label: quizSet.name });
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <SafeIcon icon={ChevronRight} className="h-4 w-4" />}
          
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
            >
              {item.icon && <SafeIcon icon={item.icon} className="h-4 w-4 mr-1" />}
              {item.label}
            </Button>
          ) : (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Category Grid Component
export function CategoryGrid({ categories, onCategorySelect }) {
  const getIcon = (iconName) => {
    const iconMap = {
      'book': BookOpen,
      'users': Users,
      'trending': BarChart3, 
      'award': Trophy
    };
    return iconMap[iconName] || BookOpen;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <SafeIcon icon={getIcon(category.icon)} className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {category.subcategory_count || 0} หมวดย่อย
              </span>
              <Button 
                onClick={() => onCategorySelect(category)} 
                size="sm"
              >
                เข้าสู่หมวด
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Subcategory Grid Component
export function SubcategoryGrid({ subcategories, onSubcategorySelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subcategories.map((subcategory) => (
        <Card 
          key={subcategory.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/50 rounded-lg">
                <SafeIcon icon={Folder} className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">{subcategory.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{subcategory.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FileText} className="h-4 w-4" />
                  <span>{subcategory.course_count || 0} คอร์ส</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={Clock} className="h-4 w-4" />
                  <span>{subcategory.quiz_count || 0} ชุดข้อสอบ</span>
                </div>
              </div>
              
              <Button 
                onClick={() => onSubcategorySelect(subcategory)} 
                size="sm"
              >
                เลือก
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Course Grid Component
export function CourseGrid({ courses, onCourseSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/50 rounded-lg">
                <SafeIcon icon={BookOpen} className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon 
                        key={i}
                        icon={Star}
                        className={`h-3 w-3 ${i < (course.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({course.review_count || 0})
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={Clock} className="h-4 w-4" />
                  <span>{course.quiz_count || 0} ชุดข้อสอบ</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={Users} className="h-4 w-4" />
                  <span>{course.student_count || 0} นักเรียน</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">
                {course.price > 0 ? `${course.price} คะแนน` : 'ฟรี'}
              </span>
              
              <Button 
                onClick={() => onCourseSelect(course)} 
                size="sm"
              >
                เข้าเรียน
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Quiz Set Grid Component
export function QuizSetGrid({ quizSets, onQuizSetSelect }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'medium': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return 'ไม่ระบุ';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizSets.map((quizSet) => (
        <Card 
          key={quizSet.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <SafeIcon icon={FileText} className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{quizSet.name}</CardTitle>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quizSet.difficulty)}`}>
                {getDifficultyText(quizSet.difficulty)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 line-clamp-2">{quizSet.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={FileText} className="h-4 w-4 text-muted-foreground" />
                <span>{quizSet.question_count || 0} ข้อ</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={Clock} className="h-4 w-4 text-muted-foreground" />
                <span>{quizSet.time_limit || 0} นาที</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={BarChart3} className="h-4 w-4 text-muted-foreground" />
                <span>{quizSet.pass_score || 0}% ผ่าน</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={Trophy} className="h-4 w-4 text-muted-foreground" />
                <span>{quizSet.points || 0} คะแนน</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                ทำแล้ว {quizSet.attempt_count || 0} ครั้ง
              </div>
              
              <Button 
                onClick={() => onQuizSetSelect(quizSet)} 
                size="sm"
              >
                เริ่มทำ
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}