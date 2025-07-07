import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { calculateQuizScore, formatPoints } from '../../lib/utils';

const { Trophy, Target, Clock, RotateCcw, Home } = LucideIcons;

export default function QuizResult({ 
  quiz, 
  questions, 
  answers, 
  timeSpent,
  onRetry,
  onBackToHome 
}) {
  const score = calculateQuizScore(answers, questions);
  const passed = score.percentage >= (quiz.pass_score || 60);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} นาที ${secs} วินาที`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Result Header */}
      <Card className={`mb-6 ${passed ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <SafeIcon icon={Trophy} className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl mb-2">
              {passed ? 'ยินดีด้วย! คุณสอบผ่าน' : 'เสียใจด้วย คุณสอบไม่ผ่าน'}
            </CardTitle>
            <p className="text-muted-foreground">
              {quiz.name}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {score.percentage}%
              </div>
              <div className="text-sm text-muted-foreground">คะแนนรวม</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {score.correct}
              </div>
              <div className="text-sm text-muted-foreground">ตอบถูก</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {score.total - score.correct}
              </div>
              <div className="text-sm text-muted-foreground">ตอบผิด</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {formatPoints(score.points)}
              </div>
              <div className="text-sm text-muted-foreground">คะแนนที่ได้</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SafeIcon icon={Target} className="h-5 w-5" />
            <span>สถิติการทำข้อสอบ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={Clock} className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">เวลาที่ใช้</div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(timeSpent)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={Target} className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">เกณฑ์ผ่าน</div>
                <div className="text-sm text-muted-foreground">
                  {quiz.pass_score || 60}%
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={Trophy} className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">สถานะ</div>
                <div className={`text-sm font-medium ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>รายละเอียดคำตอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-2">{question.question_text}</div>
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => {
                          const isUserChoice = userAnswer === choiceIndex;
                          const isCorrectChoice = question.correct_answer === choiceIndex;
                          
                          return (
                            <div
                              key={choiceIndex}
                              className={`p-2 rounded ${
                                isCorrectChoice
                                  ? 'bg-green-100 border border-green-300'
                                  : isUserChoice
                                  ? 'bg-red-100 border border-red-300'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + choiceIndex)}.
                                </span>
                                <span>{choice}</span>
                                {isCorrectChoice && (
                                  <span className="text-green-600 text-xs font-medium">
                                    (คำตอบที่ถูก)
                                  </span>
                                )}
                                {isUserChoice && !isCorrectChoice && (
                                  <span className="text-red-600 text-xs font-medium">
                                    (คำตอบของคุณ)
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={onBackToHome}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={Home} className="h-4 w-4" />
          <span>กลับหน้าหลัก</span>
        </Button>
        <Button
          onClick={onRetry}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={RotateCcw} className="h-4 w-4" />
          <span>ทำข้อสอบใหม่</span>
        </Button>
      </div>
    </div>
  );
}