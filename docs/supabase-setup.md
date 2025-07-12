# คู่มือการตั้งค่า Supabase สำหรับ Quiz Master v2.0

## 1. การเชื่อมต่อกับ Supabase

Quiz Master v2.0 ใช้ Supabase เป็นแพลตฟอร์มแบ็กเอนด์สำหรับฐานข้อมูลและการยืนยันตัวตน โปรเจคได้ถูกกำหนดค่าให้ใช้โปรเจค Supabase ที่มีอยู่แล้ว แต่คุณสามารถเปลี่ยนให้ใช้โปรเจค Supabase ของคุณเองได้

### ข้อมูลเชื่อมต่อปัจจุบัน

```
Project URL: https://oezstedvzmizmwcgqpyd.supabase.co
Project ID: oezstedvzmizmwcgqpyd
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lenN0ZWR2em1pem13Y2dxcHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTYyNzcsImV4cCI6MjA2NzQ3MjI3N30.DYvzPd90dbm7FFdD5TGaL8u5K1VkvKsuZ7IXzpnaKTQ
```

## 2. การตั้งค่า Supabase ใหม่

หากต้องการใช้โปรเจค Supabase ของคุณเอง ให้ทำตามขั้นตอนดังนี้:

1. สร้างบัญชี Supabase ที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. เมื่อโปรเจคถูกสร้างเสร็จแล้ว ให้ไปที่หน้า Settings > API
4. คัดลอก Project URL และ `anon` public key
5. อัปเดตไฟล์ `src/lib/supabase.js` ด้วยค่าเหล่านี้:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

## 3. การสร้างโครงสร้างฐานข้อมูล

โปรเจคนี้มีไฟล์ SQL สำหรับสร้างโครงสร้างฐานข้อมูลที่จำเป็นทั้งหมด:

1. ไปที่ Supabase Dashboard > SQL Editor
2. คัดลอกและวางเนื้อหาจากไฟล์ `supabase/migrations/20240101_quiz_schema.sql`
3. กดปุ่ม "Run" เพื่อสร้างตาราง, ดัชนี, นโยบาย RLS และข้อมูลตัวอย่าง

## 4. การตั้งค่าการยืนยันตัวตน

Quiz Master v2.0 ใช้ระบบการยืนยันตัวตนด้วยอีเมลและรหัสผ่านของ Supabase:

1. ไปที่ Supabase Dashboard > Authentication > Providers
2. ตรวจสอบให้แน่ใจว่า Email provider เปิดใช้งานอยู่
3. ปิดการใช้งาน "Confirm email" เพื่อให้ผู้ใช้สามารถเริ่มใช้งานได้ทันทีหลังจากลงทะเบียน (หรือเปิดใช้งานหากต้องการความปลอดภัยเพิ่มเติม)

### การกำหนดค่า Email Provider

1. Email confirmation: Disabled (สามารถเปิดใช้งานได้ตามต้องการ)
2. Secure email change: Enabled
3. Double confirm changes: Enabled
4. PASSWORD AUTH: Enabled

## 5. การตั้งค่า Row Level Security (RLS)

ไฟล์ SQL ที่ให้มาได้กำหนดนโยบาย RLS ที่จำเป็นทั้งหมดแล้ว:

- Public read access สำหรับตาราง categories, subcategories, courses, quiz_sets, questions
- User-specific policies สำหรับข้อมูลส่วนบุคคล เช่น quiz_attempts, user_points, point_transactions, user_profiles

หากต้องการนโยบายเพิ่มเติม:

1. ไปที่ Supabase Dashboard > Database > Tables
2. เลือกตารางที่ต้องการกำหนดนโยบาย
3. ไปที่แท็บ "Policies" และกด "Add Policy"

## 6. การทดสอบการเชื่อมต่อ

หลังจากตั้งค่าทุกอย่างเรียบร้อยแล้ว ให้ทดสอบการเชื่อมต่อโดย:

1. รันแอปพลิเคชันด้วยคำสั่ง `npm run dev`
2. ลงทะเบียนบัญชีผู้ใช้ใหม่
3. ลอกอินและตรวจสอบว่าสามารถดูข้อมูลหมวดหมู่และข้อสอบได้
4. ทดสอบทำข้อสอบและตรวจสอบว่าผลลัพธ์ถูกบันทึกอย่างถูกต้อง

## 7. การแก้ไขปัญหา

หากพบปัญหาในการเชื่อมต่อกับ Supabase:

1. ตรวจสอบว่า URL และ Anon Key ถูกต้อง
2. ตรวจสอบว่าโครงสร้างฐานข้อมูลถูกสร้างอย่างถูกต้อง
3. ตรวจสอบบันทึกการเข้าถึง (Access Logs) ใน Supabase Dashboard
4. ตรวจสอบคอนโซลเบราว์เซอร์เพื่อดูข้อผิดพลาด API

### การตรวจสอบ RLS Policies

หากข้อมูลไม่ปรากฏหรือไม่สามารถบันทึกข้อมูลได้ อาจเป็นเพราะนโยบาย RLS:

```sql
-- ตรวจสอบนโยบาย RLS สำหรับตาราง
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

## 8. การสำรองข้อมูล

Supabase มีระบบสำรองข้อมูลอัตโนมัติ แต่คุณสามารถสำรองข้อมูลเองได้:

1. ไปที่ Supabase Dashboard > Database > Backups
2. กด "Create backup" เพื่อสร้างสำเนาสำรองแบบกำหนดเอง

## 9. การจัดการข้อมูลและการบำรุงรักษา

- **การเพิ่มข้อมูล**: ใช้ SQL Editor หรือ Table Editor ใน Supabase Dashboard
- **การติดตามการใช้งาน**: ตรวจสอบ Usage Metrics ใน Dashboard
- **การอัปเดต Schema**: สร้าง migration ใหม่ในโฟลเดอร์ `supabase/migrations/`

## 10. ทรัพยากรเพิ่มเติม

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)