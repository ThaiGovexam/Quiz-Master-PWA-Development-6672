import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { BookOpen, Users, TrendingUp, Award } = LucideIcons;

export default function CategoryGrid({ categories, onCategorySelect }) {
  const getIcon = (iconName) => {
    const iconMap = {
      'book': BookOpen,
      'users': Users,
      'trending': TrendingUp,
      'award': Award
    };
    return iconMap[iconName] || BookOpen;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <SafeIcon 
                  icon={getIcon(category.icon)} 
                  className="h-6 w-6 text-primary" 
                />
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