import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPoints(points) {
  return new Intl.NumberFormat("th-TH").format(points);
}

export function calculateQuizScore(answers, questions) {
  let correct = 0;
  let total = questions.length;
  
  questions.forEach((question, index) => {
    if (answers[index] === question.correct_answer) {
      correct++;
    }
  });
  
  return {
    correct,
    total,
    percentage: Math.round((correct / total) * 100),
    points: correct * 10 // 10 points per correct answer
  };
}

export function generateQuizId() {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}