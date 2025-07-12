import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nveyzcdghjpqrujukhac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZXl6Y2RnaGpwcXJ1anVraGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzQ4OTEsImV4cCI6MjA2NzkxMDg5MX0.6VgfayZfZS71mMGgWE6wMy8eeYFkU2vMmWUdUPlK8QA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  // Subcategories
  async getSubcategories(categoryId) {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  // Courses
  async getCourses(subcategoryId) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('subcategory_id', subcategoryId)
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  // Quiz Sets
  async getQuizSets(courseId) {
    const { data, error } = await supabase
      .from('quiz_sets')
      .select('*')
      .eq('course_id', courseId)
      .order('name');
    
    if (error) throw error;
    return data;
  },
  
  // Questions
  async getQuestions(quizSetId) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_set_id', quizSetId)
      .order('order_number');
    
    if (error) throw error;
    return data;
  },
  
  // Quiz Attempts
  async createQuizAttempt(attempt) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([attempt])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getUserAttempts(userId) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quiz_sets (
          name,
          courses (
            name,
            subcategories (
              name,
              categories (name)
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // User Points
  async getUserPoints(userId) {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || { total_points: 0 };
  },
  
  async updateUserPoints(userId, points, transactionType, description) {
    // Get current points
    const { data: currentPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', userId)
      .single();
    
    if (pointsError && pointsError.code !== 'PGRST116') throw pointsError;
    
    const newTotal = (currentPoints?.total_points || 0) + points;
    
    // Update user points
    const { error: updateError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: newTotal,
        updated_at: new Date().toISOString()
      });
    
    if (updateError) throw updateError;
    
    // Create transaction record
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert([{
        user_id: userId,
        points: points,
        transaction_type: transactionType,
        description: description
      }]);
    
    if (transactionError) throw transactionError;
    
    return { total_points: newTotal };
  },
  
  // Point Transactions
  async getUserTransactions(userId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // User Profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  async updateUserProfile(userId, profile) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};