import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import { usePointStore } from '../store/pointStore';
import QuizInterface from '../components/quiz/QuizInterface';
import LoadingScreen from '../components/ui/LoadingScreen';
import { generateQuizId } from '../lib/utils';
import { db } from '../lib/supabase';
import AuthGuard from '../components/auth/AuthGuard';

export default function QuizPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPoints } = usePointStore();
  const { 
    currentQuiz, 
    questions, 
    loading, 
    error, 
    endQuiz 
  } = useQuizStore();
  const [resultId, setResultId] = useState(null);

  useEffect(() => {
    // If there's no quiz loaded, redirect to home
    if (!currentQuiz && !loading) {
      navigate('/');
    }
  }, [currentQuiz, loading, navigate]);

  const handleQuizComplete = async (result) => {
    if (!user || !currentQuiz) return;
    
    try {
      // Calculate score
      let correctCount = 0;
      Object.entries(result.answers).forEach(([index, answer]) => {
        if (answer === questions[index].correct_answer) {
          correctCount++;
        }
      });
      
      const totalQuestions = questions.length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const passed = percentage >= currentQuiz.pass_score;
      const pointsEarned = passed ? currentQuiz.points : 0;
      
      // Create the result object
      const quizAttempt = {
        user_id: user.id,
        quiz_set_id: currentQuiz.id,
        answers: result.answers,
        score: correctCount,
        percentage: percentage,
        time_spent: result.timeSpent,
        passed: passed,
        points_earned: pointsEarned,
        started_at: new Date(Date.now() - result.timeSpent * 1000).toISOString(),
        completed_at: result.completedAt
      };
      
      // Save to database
      const savedAttempt = await db.createQuizAttempt(quizAttempt);
      
      // Add points if passed
      if (passed && pointsEarned > 0) {
        await addPoints(
          user.id, 
          pointsEarned, 
          'earn', 
          `ทำข้อสอบ ${currentQuiz.name} สำเร็จ`
        );
      }
      
      // Generate a result ID
      const newResultId = generateQuizId();
      setResultId(newResultId);
      
      // Store the result in localStorage for the result page
      localStorage.setItem(`quiz_result_${newResultId}`, JSON.stringify({
        quiz: currentQuiz,
        questions,
        answers: result.answers,
        timeSpent: result.timeSpent,
        score: {
          correct: correctCount,
          total: totalQuestions,
          percentage,
          passed,
          pointsEarned
        }
      }));
      
      // End the quiz in store
      endQuiz();
      
      // Navigate to result page
      navigate(`/result/${newResultId}`);
    } catch (error) {
      console.error("Error completing quiz:", error);
    }
  };

  const handleQuizExit = () => {
    endQuiz();
    navigate('/');
  };

  if (loading || !currentQuiz) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button onClick={handleQuizExit}>กลับไปหน้าหลัก</button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <QuizInterface
        quiz={currentQuiz}
        questions={questions}
        onQuizComplete={handleQuizComplete}
        onQuizExit={handleQuizExit}
      />
    </AuthGuard>
  );
}