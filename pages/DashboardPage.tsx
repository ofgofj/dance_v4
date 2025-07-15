import React from 'react';
import { ICONS } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

const StatCard = ({ icon, bgColor, fgColor, title, value, unit, subtext, linkText }: { icon: React.ReactNode, bgColor: string, fgColor: string, title: string, value: string, unit: string, subtext: React.ReactNode, linkText?: string }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
      <div className={`absolute top-4 right-4 ${bgColor} ${fgColor} p-3 rounded-xl`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-4xl font-bold text-slate-800 mt-2">{value} <span className="text-xl font-semibold">{unit}</span></p>
      <div className="text-slate-500 text-sm mt-4 h-5">
        {subtext}
      </div>
      {linkText && (
        <a href="#" className="text-pink-500 text-sm font-semibold mt-2 flex items-center group">
          {linkText}
          <span className="ml-1 transition-transform group-hover:translate-x-1">{ICONS.arrowRight}</span>
        </a>
      )}
    </div>
  );
}

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { students, classes } = useData();
  const today = new Date();
  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 (${['日', '月', '火', '水', '木', '金', '土'][today.getDay()]})`;
  
  const adminName = currentUser?.user.name || '';

  // --- Dynamic Data Calculations ---

  // Today's Classes
  const dayOfWeekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayOfWeekMap[today.getDay()];
  const todaysClasses = classes.filter(c => c.dayOfWeek === todayDayName);

  // Next Class
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const upcomingClasses = todaysClasses
    .filter(c => c.time.split('-')[0] > currentTime)
    .sort((a, b) => a.time.localeCompare(b.time));
  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  let nextClassSubtext;
  if (nextClass) {
    nextClassSubtext = (
      <div className="flex items-center">
        <span className="mr-1.5 text-slate-400">{ICONS.clock}</span>
        <span className="font-medium text-slate-600 mr-1">次回:</span>
        <span>{`${nextClass.name} (${nextClass.time.split('-')[0]}〜)`}</span>
      </div>
    );
  } else if (todaysClasses.length > 0) {
    nextClassSubtext = (
      <div className="flex items-center">
        <span className="mr-1.5 text-slate-400">{ICONS.clock}</span>
        <span>今日のレッスンは終了しました</span>
      </div>
    );
  } else {
    nextClassSubtext = (
      <div className="flex items-center">
        <span className="mr-1.5 text-slate-400">{ICONS.clock}</span>
        <span>今日はレッスンがありません</span>
      </div>
    );
  }

  // Student Stats
  const totalStudents = students.length;
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const newStudentsThisMonth = students.filter(s => {
    const enrollmentD = new Date(s.enrollmentDate);
    return enrollmentD.getFullYear() === currentYear && enrollmentD.getMonth() === currentMonth;
  }).length;
  
  const newStudentsSubtext = (
    <div className="flex items-center text-green-500 font-semibold">
      <span className="mr-1">{ICONS.arrowUp}</span>
      <span>今月の新入生 {newStudentsThisMonth}名</span>
    </div>
  );

  return (
    <div className="container mx-auto p-6 sm:p-8">
      {/* Greeting and Actions */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">こんにちは、{adminName}！</h1>
          <p className="text-slate-500 mt-1">{formattedDate}</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          icon={ICONS.calendarCard}
          bgColor="bg-pink-100"
          fgColor="text-pink-500"
          title="今日のレッスン"
          value={todaysClasses.length.toString()}
          unit="クラス"
          subtext={nextClassSubtext}
        />
        <StatCard 
          icon={ICONS.usersCard}
          bgColor="bg-purple-100"
          fgColor="text-purple-500"
          title="生徒総数"
          value={totalStudents.toString()}
          unit="名"
          subtext={newStudentsSubtext}
        />
      </div>

      {/* Replacement for Chart */}
      <Card className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-pink-50 to-purple-50 !p-8 !rounded-2xl min-h-[360px]">
        <div className="text-pink-400 w-24 h-24 mb-6">
          {ICONS.danceIcon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800">今日も元気に、レッツダンス！</h3>
        <p className="text-slate-500 mt-2 max-w-md">
            スタジオはあなたの情熱を待っています。最高のパフォーマンスで生徒たちを魅了しましょう！
        </p>
      </Card>
    </div>
  );
};

export default DashboardPage;