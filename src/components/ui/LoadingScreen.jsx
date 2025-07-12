import React from 'react';
import { cn } from '../../lib/utils';

export default function LoadingScreen({ className }) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-background",
      className
    )}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    </div>
  );
}