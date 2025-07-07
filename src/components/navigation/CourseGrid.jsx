import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { BookOpen, Clock, Users, Star } = LucideIcons;

export default function CourseGrid({ courses, onCourseSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                        className={`h-3 w-3 ${
                          i < (course.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
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