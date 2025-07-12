import { create } from 'zustand';
import { db } from '../lib/supabase';

export const useQuizStore = create((set, get) => ({
  // Navigation state
  currentCategory: null,
  currentSubcategory: null,
  currentCourse: null,
  currentQuizSet: null,
  
  // Data
  categories: [],
  subcategories: [],
  courses: [],
  quizSets: [],
  questions: [],
  
  // Quiz state
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: 0,
  quizStartTime: null,
  
  // Loading states
  loading: false,
  error: null,
  
  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Navigation actions
  setCurrentCategory: (category) => set({
    currentCategory: category,
    currentSubcategory: null,
    currentCourse: null,
    currentQuizSet: null
  }),
  
  setCurrentSubcategory: (subcategory) => set({
    currentSubcategory: subcategory,
    currentCourse: null,
    currentQuizSet: null
  }),
  
  setCurrentCourse: (course) => set({
    currentCourse: course,
    currentQuizSet: null
  }),
  
  setCurrentQuizSet: (quizSet) => set({
    currentQuizSet: quizSet
  }),
  
  // Data loading actions
  loadCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await db.getCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  loadSubcategories: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const subcategories = await db.getSubcategories(categoryId);
      set({ subcategories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  loadCourses: async (subcategoryId) => {
    set({ loading: true, error: null });
    try {
      const courses = await db.getCourses(subcategoryId);
      set({ courses, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  loadQuizSets: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const quizSets = await db.getQuizSets(courseId);
      set({ quizSets, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  loadQuestions: async (quizSetId) => {
    set({ loading: true, error: null });
    try {
      const questions = await db.getQuestions(quizSetId);
      set({ questions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Quiz actions
  startQuiz: (quizSet, questions) => {
    set({
      currentQuiz: quizSet,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: quizSet.time_limit * 60, // Convert minutes to seconds
      quizStartTime: new Date()
    });
  },
  
  answerQuestion: (questionIndex, answer) => {
    const { answers } = get();
    set({ answers: { ...answers, [questionIndex]: answer } });
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
  
  setCurrentQuestion: (index) => {
    set({ currentQuestionIndex: index });
  },
  
  updateTimer: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
  
  endQuiz: () => {
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      quizStartTime: null
    });
  }
}));