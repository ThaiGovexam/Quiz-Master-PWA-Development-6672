import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SafeIcon from '../../common/SafeIcon';
import * as LucideIcons from 'lucide-react';
import { formatDate, formatPoints } from '../../lib/utils';

const { History, Plus, Minus, Gift, Trophy } = LucideIcons;

export default function PointHistory({ transactions }) {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earn': return Plus;
      case 'spend': return Minus;
      case 'bonus': return Gift;
      case 'reward': return Trophy;
      default: return History;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'earn': return 'text-green-600';
      case 'spend': return 'text-red-600';
      case 'bonus': return 'text-blue-600';
      case 'reward': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionText = (type) => {
    switch (type) {
      case 'earn': return 'ได้รับ';
      case 'spend': return 'ใช้';
      case 'bonus': return 'โบนัส';
      case 'reward': return 'รางวัล';
      default: return 'ธุรกรรม';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SafeIcon icon={History} className="h-5 w-5" />
          <span>ประวัติคะแนน</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              ยังไม่มีประวัติการใช้คะแนน
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTransactionColor(transaction.transaction_type)} bg-opacity-10`}>
                    <SafeIcon 
                      icon={getTransactionIcon(transaction.transaction_type)} 
                      className={`h-4 w-4 ${getTransactionColor(transaction.transaction_type)}`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                  {transaction.points > 0 ? '+' : ''}{formatPoints(transaction.points)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}