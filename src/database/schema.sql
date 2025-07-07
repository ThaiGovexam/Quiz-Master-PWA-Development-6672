-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories table
CREATE TABLE subcategories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz sets table
CREATE TABLE quiz_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) DEFAULT 'medium',
    question_count INTEGER DEFAULT 0,
    time_limit INTEGER DEFAULT 30,
    pass_score INTEGER DEFAULT 60,
    points INTEGER DEFAULT 100,
    attempt_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_set_id UUID NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    choices JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    order_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_set_id UUID NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_spent INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    points_earned INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User points table
CREATE TABLE user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Point transactions table
CREATE TABLE point_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table (for Ksher PromptPay)
CREATE TABLE payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    points INTEGER NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'promptpay',
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    payment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generation logs table
CREATE TABLE ai_generation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT,
    model VARCHAR(100),
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes for better performance
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_courses_subcategory_id ON courses(subcategory_id);
CREATE INDEX idx_quiz_sets_course_id ON quiz_sets(course_id);
CREATE INDEX idx_questions_quiz_set_id ON questions(quiz_set_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_set_id ON quiz_attempts(quiz_set_id);
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_ai_generation_logs_user_id ON ai_generation_logs(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, subcategories, courses, quiz_sets, questions
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read access for courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read access for quiz_sets" ON quiz_sets FOR SELECT USING (true);
CREATE POLICY "Public read access for questions" ON questions FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attempts" ON quiz_attempts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own points" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own points record" ON user_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own points" ON user_points FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions" ON point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON point_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own payments" ON payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payments" ON payment_transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI logs" ON ai_generation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own AI logs" ON ai_generation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Sample data
INSERT INTO categories (name, description, icon) VALUES 
('ภาษาไทย', 'ข้อสอบและแบบฝึกหัดภาษาไทย', 'book'),
('คณิตศาสตร์', 'ข้อสอบและแบบฝึกหัดคณิตศาสตร์', 'trending'),
('วิทยาศาสตร์', 'ข้อสอบและแบบฝึกหัดวิทยาศาสตร์', 'award'),
('สังคมศึกษา', 'ข้อสอบและแบบฝึกหัดสังคมศึกษา', 'users');

INSERT INTO subcategories (category_id, name, description) VALUES 
((SELECT id FROM categories WHERE name = 'ภาษาไทย'), 'ไวยากรณ์', 'ไวยากรณ์ภาษาไทย'),
((SELECT id FROM categories WHERE name = 'ภาษาไทย'), 'วรรณคดี', 'วรรณคดีไทย'),
((SELECT id FROM categories WHERE name = 'คณิตศาสตร์'), 'พีชคณิต', 'พีชคณิตพื้นฐาน'),
((SELECT id FROM categories WHERE name = 'คณิตศาสตร์'), 'เรขาคณิต', 'เรขาคณิตพื้นฐาน');

INSERT INTO courses (subcategory_id, name, description, price, rating, review_count, student_count) VALUES 
((SELECT id FROM subcategories WHERE name = 'ไวยากรณ์'), 'ไวยากรณ์พื้นฐาน', 'เรียนรู้ไวยากรณ์ภาษาไทยเบื้องต้น', 0, 4.5, 150, 1200),
((SELECT id FROM subcategories WHERE name = 'วรรณคดี'), 'วรรณคดีไทยคลาสสิก', 'ศึกษาวรรณคดีไทยที่สำคัญ', 50, 4.8, 89, 650),
((SELECT id FROM subcategories WHERE name = 'พีชคณิต'), 'พีชคณิตพื้นฐาน', 'เรียนรู้พีชคณิตเบื้องต้น', 0, 4.3, 200, 1500),
((SELECT id FROM subcategories WHERE name = 'เรขาคณิต'), 'เรขาคณิตระนาบ', 'ศึกษาเรขาคณิตในระนาบ', 30, 4.6, 120, 800);

INSERT INTO quiz_sets (course_id, name, description, difficulty, question_count, time_limit, pass_score, points) VALUES 
((SELECT id FROM courses WHERE name = 'ไวยากรณ์พื้นฐาน'), 'ทดสอบไวยากรณ์ชุดที่ 1', 'ทดสอบความรู้พื้นฐานเรื่องไวยากรณ์', 'easy', 10, 15, 60, 100),
((SELECT id FROM courses WHERE name = 'วรรณคดีไทยคลาสสิก'), 'ทดสอบวรรณคดีชุดที่ 1', 'ทดสอบความรู้เรื่องวรรณคดีไทย', 'medium', 15, 20, 70, 150),
((SELECT id FROM courses WHERE name = 'พีชคณิตพื้นฐาน'), 'ทดสอบพีชคณิตชุดที่ 1', 'ทดสอบความรู้พีชคณิตเบื้องต้น', 'easy', 12, 18, 60, 120),
((SELECT id FROM courses WHERE name = 'เรขาคณิตระนาบ'), 'ทดสอบเรขาคณิตชุดที่ 1', 'ทดสอบความรู้เรื่องเรขาคณิตระนาบ', 'hard', 20, 30, 80, 200);

-- Sample questions for quiz sets
INSERT INTO questions (quiz_set_id, question_text, choices, correct_answer, explanation, order_number) VALUES 
((SELECT id FROM quiz_sets WHERE name = 'ทดสอบไวยากรณ์ชุดที่ 1'), 'ข้อใดต่อไปนี้เป็นคำกริยา?', '["วิ่ง", "สวย", "ใหญ่", "ดี"]', 0, 'วิ่ง เป็นคำกริยาที่แสดงการกระทำ', 1),
((SELECT id FROM quiz_sets WHERE name = 'ทดสอบไวยากรณ์ชุดที่ 1'), 'ข้อใดต่อไปนี้เป็นคำคุณศัพท์?', '["กิน", "นอน", "สวย", "เดิน"]', 2, 'สวย เป็นคำคุณศัพท์ที่บอกคุณภาพ', 2),
((SELECT id FROM quiz_sets WHERE name = 'ทดสอบพีชคณิตชุดที่ 1'), '2x + 3 = 7 แล้ว x เท่ากับเท่าใด?', '["1", "2", "3", "4"]', 1, '2x = 7 - 3 = 4, ดังนั้น x = 2', 1),
((SELECT id FROM quiz_sets WHERE name = 'ทดสอบพีชคณิตชุดที่ 1'), 'ถ้า x = 5 แล้ว 3x - 2 เท่ากับเท่าใด?', '["13", "15", "17", "19"]', 0, '3(5) - 2 = 15 - 2 = 13', 2);