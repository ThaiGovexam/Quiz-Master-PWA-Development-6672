import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';

const { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } = LucideIcons;

export default function QuizInterface({ 
  quiz, 
  questions, 
  onQuizComplete,
  onQuizExit 
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit * 60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    const result = {
      answers,
      timeSpent: (quiz.time_limit * 60) - timeRemaining,
      completedAt: new Date().toISOString()
    };
    onQuizComplete(result);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{quiz.name}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExitConfirm(true)}
            >
              ออกจากข้อสอบ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={Clock} className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={CheckCircle} className="h-5 w-5 text-green-600" />
              <span>ตอบแล้ว {getAnsweredCount()}/{questions.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={AlertCircle} className="h-5 w-5 text-orange-600" />
              <span>เหลือ {questions.length - getAnsweredCount()} ข้อ</span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            ข้อที่ {currentQuestionIndex + 1}. {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`choice-button ${
                  answers[currentQuestionIndex] === index ? 'selected' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestionIndex] === index 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300'
                  }`} />
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{choice}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <SafeIcon icon={ChevronLeft} className="h-4 w-4 mr-2" />
          ข้อก่อนหน้า
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleQuizComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            ส่งข้อสอบ
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            ข้อถัดไป
            <SafeIcon icon={ChevronRight} className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">แผนที่ข้อสอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground border-primary'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>ยืนยันการออกจากข้อสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                คุณแน่ใจหรือไม่ที่จะออกจากข้อสอบ? ข้อมูลที่ตอบไว้จะไม่ถูกบันทึก
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="destructive"
                  onClick={onQuizExit}
                  className="flex-1"
                >
                  ออกจากข้อสอบ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}