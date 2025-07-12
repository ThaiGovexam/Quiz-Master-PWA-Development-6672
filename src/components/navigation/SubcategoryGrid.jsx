import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { Folder, FileText, Clock } = LucideIcons;

export default function SubcategoryGrid({ subcategories, onSubcategorySelect }) {
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