import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { formatPoints } from '../../lib/utils';

const { Coins, TrendingUp, Gift } = LucideIcons;

export default function PointDisplay({ points, showDetails = false }) {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <SafeIcon icon={Coins} className="h-5 w-5" />
          <span>คะแนนของคุณ</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {formatPoints(points)} คะแนน
        </div>
        
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary-foreground/20">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={TrendingUp} className="h-4 w-4" />
              <div>
                <div className="text-sm opacity-90">สัปดาห์นี้</div>
                <div className="font-semibold">+120</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={Gift} className="h-4 w-4" />
              <div>
                <div className="text-sm opacity-90">โบนัส</div>
                <div className="font-semibold">+50</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}