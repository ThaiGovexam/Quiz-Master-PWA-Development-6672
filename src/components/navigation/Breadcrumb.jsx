import React from 'react';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { ChevronRight, Home } = LucideIcons;

export default function Breadcrumb({ 
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