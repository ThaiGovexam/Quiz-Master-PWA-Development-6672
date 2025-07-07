import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { FileText, Clock, BarChart3, Trophy } = LucideIcons;

export default function QuizSetGrid({ quizSets, onQuizSetSelect }) {
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
        <Card key={quizSet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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