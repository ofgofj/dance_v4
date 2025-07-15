import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PaymentsPage: React.FC = () => {
  const { getPayments, updatePaymentStatus } = useData();
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const paymentsData = useMemo(() => getPayments(year, month), [getPayments, year, month]);

  const handleMonthChange = (increment: number) => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const handlePaymentToggle = (studentId: string, paid: boolean) => {
    updatePaymentStatus(studentId, year, month, !paid);
  };
  
  const unpaidCount = paymentsData.filter(p => !p.paid).length;
  const totalAmount = paymentsData.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAmount = paymentsData.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <Header title="月謝管理" />
      <Card>
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => handleMonthChange(-1)}>&lt; 前月</Button>
            <span className="text-xl font-semibold w-32 text-center">{year}年 {month}月</span>
            <Button variant="secondary" onClick={() => handleMonthChange(1)}>次月 &gt;</Button>
          </div>
          <div className="text-right">
              <p className="text-sm text-gray-500">未納者数: <span className="font-bold text-red-600">{unpaidCount}人</span></p>
              <p className="text-sm text-gray-500">集金状況: <span className="font-bold text-green-600">{totalPaidAmount.toLocaleString()}円</span> / {totalAmount.toLocaleString()}円</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生徒名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">請求額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支払い状況</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentsData.map(p => (
                <tr key={p.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.amount.toLocaleString()}円</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {p.paid ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        支払済み ({p.paymentDate})
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        未払い
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button 
                      size="sm"
                      variant={p.paid ? 'secondary' : 'primary'}
                      onClick={() => handlePaymentToggle(p.studentId, p.paid)}
                    >
                      {p.paid ? '未払いに変更' : '支払済みにする'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsPage;