# Quiz Master v2.0 - Progressive Web Application

## Overview
Quiz Master v2.0 is a comprehensive online quiz system with point-based rewards and PromptPay integration for purchasing additional points.

## Features

### Phase 1: Core System ✅
- [x] 4-Level Navigation (Category → Subcategory → Course → Quiz Set)
- [x] Point System with display and history
- [x] User Authentication & Profile Management
- [x] Quiz Taking Interface with Auto-save
- [x] Responsive Design

### Phase 2: In Progress
- [ ] Ksher PromptPay Integration
- [ ] Admin Panel for Content Management
- [ ] AI Question Generation System
- [ ] Real-time Analytics

### Phase 3: Planned
- [ ] PWA Features (Service Worker, Offline Support)
- [ ] Advanced Analytics Dashboard
- [ ] Push Notifications
- [ ] Certificate Generation

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Ksher PromptPay
- **AI**: OpenAI GPT-4
- **Build Tool**: Vite

## Setup Instructions

### 1. Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `src/database/schema.sql`
4. This will create all necessary tables and sample data

### 3. Development
```bash
npm install
npm run dev
```

### 4. Production Build
```bash
npm run build
```

## Database Schema

### Core Tables
- `categories` - Main subject categories
- `subcategories` - Subject subcategories
- `courses` - Individual courses
- `quiz_sets` - Quiz collections
- `questions` - Individual questions
- `quiz_attempts` - User quiz attempts
- `user_points` - User point balances
- `point_transactions` - Point transaction history

### Features Tables
- `payment_transactions` - PromptPay transactions
- `ai_generation_logs` - AI usage tracking
- `user_profiles` - Extended user information

## User Instructions

### For Students
1. **Registration**: Create account with email/password
2. **Browse Content**: Navigate through categories → subcategories → courses → quiz sets
3. **Take Quizzes**: Complete timed quizzes to earn points
4. **Track Progress**: View your scores and point history
5. **Purchase Points**: Use PromptPay to buy additional points (coming soon)

### For Administrators
1. **Content Management**: Add/edit categories, courses, and questions
2. **User Management**: View user statistics and activity
3. **Analytics**: Monitor quiz performance and user engagement
4. **AI Generation**: Create questions using AI assistance

## Current Status

### ✅ Completed
- Database schema and setup
- User authentication system
- 4-level navigation system
- Quiz taking interface
- Point system with history
- Responsive design
- Basic UI components

### 🔄 In Progress
- Admin panel development
- Payment integration
- AI question generation

### 📋 Next Steps
1. Complete admin panel for content management
2. Integrate Ksher PromptPay for point purchases
3. Add AI question generation system
4. Implement PWA features
5. Add advanced analytics

## Contributing
This is a private project. Contact the development team for contribution guidelines.

## License
Proprietary - All rights reserved