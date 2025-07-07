import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
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

  async createSubcategory(subcategory) {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([subcategory])
      .select()
      .single();
    
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

  async createCourse(course) {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();
    
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

  async createQuizSet(quizSet) {
    const { data, error } = await supabase
      .from('quiz_sets')
      .insert([quizSet])
      .select()
      .single();
    
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

  async createQuestion(question) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();
    
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

  async updateQuizAttempt(id, updates) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .update(updates)
      .eq('id', id)
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
    
    if (error) throw error;
    return data;
  },

  async updateUserPoints(userId, points, transactionType, description) {
    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('total_points')
      .eq('user_id', userId)
      .single();

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
  }
};