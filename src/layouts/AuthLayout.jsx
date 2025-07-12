import { Outlet, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">Quiz Master v2.0</h1>
          </Link>
          <p className="text-muted-foreground mt-2">ระบบข้อสอบออนไลน์ที่ทันสมัย</p>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Outlet />
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Quiz Master v2.0 &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}