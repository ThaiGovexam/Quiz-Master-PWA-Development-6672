import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizResult from '../components/quiz/QuizResult';
import LoadingScreen from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/button';
import AuthGuard from '../components/auth/AuthGuard';

export default function ResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResult = () => {
      try {
        const resultData = localStorage.getItem(`quiz_result_${resultId}`);
        
        if (!resultData) {
          throw new Error('ไม่พบผลลัพธ์ข้อสอบ');
        }
        
        setResult(JSON.parse(resultData));
      } catch (error) {
        setError(error.message || 'เกิดข้อผิดพลาดในการโหลดผลลัพธ์ข้อสอบ');
      } finally {
        setLoading(false);
      }
    };
    
    loadResult();
  }, [resultId]);

  const handleRetry = () => {
    if (result?.quiz) {
      navigate(`/quiz-set/${result.quiz.id}`);
    } else {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !result) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error || 'ไม่พบผลลัพธ์ข้อสอบ'}</p>
        <Button onClick={handleBackToHome}>กลับไปหน้าหลัก</Button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <QuizResult 
        quiz={result.quiz}
        questions={result.questions}
        answers={result.answers}
        timeSpent={result.timeSpent}
        onRetry={handleRetry}
        onBackToHome={handleBackToHome}
      />
    </AuthGuard>
  );
}