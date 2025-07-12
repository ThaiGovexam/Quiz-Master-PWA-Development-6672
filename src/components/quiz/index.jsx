import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { calculateQuizScore, formatPoints } from '../../lib/utils';

const { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Trophy, Target, RotateCcw, Home } = LucideIcons;

// Quiz Interface Component
export function QuizInterface({ quiz, questions, onQuizComplete, onQuizExit }) {
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
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerIndex }));
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
                className={`choice-button ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${answers[currentQuestionIndex] === index ? 'bg-primary border-primary' : 'border-gray-300'}`} />
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

// Quiz Result Component
export function QuizResult({ quiz, questions, answers, timeSpent, onRetry, onBackToHome }) {
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
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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
                <div className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
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
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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