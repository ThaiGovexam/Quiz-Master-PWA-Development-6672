import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-muted-foreground mb-6">
        หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่
      </p>
      <Link to="/">
        <Button>กลับไปหน้าหลัก</Button>
      </Link>
    </div>
  );
}