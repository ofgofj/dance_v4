import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Parent, Student, DanceClass, Payment, AttendanceRecord, AttendanceStatus } from '../../types';
import Card from '../../components/ui/Card';
import { ICONS } from '../../constants';

const ParentDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { students, classes, payments, attendance } = useData();

  const parent = currentUser?.user as Parent;

  const myStudents = useMemo(() => {
    return students.filter(s => parent.studentIds.includes(s.id));
  }, [students, parent]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(myStudents[0]?.id || '');
  
  const selectedStudent = useMemo(() => {
    return myStudents.find(s => s.id === selectedStudentId);
  }, [myStudents, selectedStudentId]);

  const studentClasses = useMemo(() => {
    if (!selectedStudent) return [];
    return classes.filter(c => selectedStudent.classIds.includes(c.id));
  }, [classes, selectedStudent]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const currentMonthPayment = useMemo(() => {
    if (!selectedStudent) return null;
    const paymentRecord = payments.find(p => p.studentId === selectedStudent.id && p.year === year && p.month === month);
    const totalFee = studentClasses.reduce((sum, c) => sum + c.monthlyFee, 0);
    return {
      amount: totalFee,
      paid: paymentRecord ? paymentRecord.paid : false,
      paymentDate: paymentRecord?.paymentDate,
    };
  }, [payments, selectedStudent, studentClasses, year, month]);

  const recentAttendance = useMemo(() => {
    if (!selectedStudent) return [];
    return attendance
      .filter(a => a.studentId === selectedStudent.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [attendance, selectedStudent]);
  
  const dayOfWeekJapanese = {
    Monday: '月', Tuesday: '火', Wednesday: '水', Thursday: '木',
    Friday: '金', Saturday: '土', Sunday: '日'
  };


  if (!selectedStudent) {
    return (
        <div className="container mx-auto p-6 sm:p-8">
            <Card>
                <p className="text-center text-gray-500">生徒情報が登録されていません。</p>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {selectedStudent.lastName} {selectedStudent.firstName} 様のページ
          </h1>
          <p className="text-slate-500 mt-1">ようこそ、{parent.name}様</p>
        </div>
        {myStudents.length > 1 && (
          <div>
            <label htmlFor="student-select" className="sr-only">お子様を選択</label>
            <select
                id="student-select"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            >
                {myStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>
                ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Schedule & Payments */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="レッスンスケジュール">
            {studentClasses.length > 0 ? (
                <div className="space-y-4">
                {studentClasses.map(c => (
                    <div key={c.id} className="p-4 border rounded-lg flex items-start space-x-4">
                        <div className="bg-pink-100 text-pink-600 p-3 rounded-lg">
                            {ICONS.calendarCard}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{c.name}</p>
                            <p className="text-sm text-gray-500">{c.instructor} • {c.location}</p>
                            <p className="text-sm text-gray-500">{dayOfWeekJapanese[c.dayOfWeek]}曜日 / {c.time}</p>
                        </div>
                    </div>
                ))}
                </div>
            ) : <p className="text-gray-500">受講中のクラスはありません。</p>}
          </Card>
          <Card title="最近の出席記録">
             {recentAttendance.length > 0 ? (
                <ul className="space-y-3">
                    {recentAttendance.map((rec, i) => (
                        <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-700">{rec.date} ({classes.find(c=>c.id === rec.classId)?.name})</span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                rec.status === AttendanceStatus.Present ? 'bg-green-100 text-green-800' :
                                rec.status === AttendanceStatus.Absent ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>{rec.status}</span>
                        </li>
                    ))}
                </ul>
             ) : <p className="text-gray-500">出席記録はありません。</p>}
          </Card>
        </div>

        {/* Right Column: Payment Status */}
        <div className="lg:col-span-1">
          <Card title={`${year}年${month}月のお支払い`}>
             {currentMonthPayment ? (
                 <div className="text-center">
                    <p className="text-sm text-gray-500">請求額</p>
                    <p className="text-4xl font-bold my-2">{currentMonthPayment.amount.toLocaleString()}円</p>
                    {currentMonthPayment.paid ? (
                         <div className="inline-flex items-center gap-2 px-4 py-2 text-lg font-semibold rounded-full bg-green-100 text-green-800">
                            支払済み
                         </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-lg font-semibold rounded-full bg-red-100 text-red-800">
                            未払い
                        </div>
                    )}
                    {currentMonthPayment.paymentDate && <p className="text-xs text-gray-400 mt-2">支払日: {currentMonthPayment.paymentDate}</p>}
                    <p className="text-xs text-gray-500 mt-4">お支払いに関するお問い合わせは教室までご連絡ください。</p>
                 </div>
             ) : <p className="text-gray-500">支払い情報はありません。</p>}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardPage;
