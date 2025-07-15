import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

const navItems = [
  { path: '/dashboard', label: 'ダッシュボード', icon: ICONS.dashboard },
  { path: '/students', label: '生徒一覧', icon: ICONS.students },
  { path: '/parents', label: '保護者管理', icon: ICONS.parents },
  { path: '/classes', label: 'レッスンスケジュール', icon: ICONS.classes },
  { path: '/attendance', label: '出席管理', icon: ICONS.attendance },
  { path: '/payments', label: 'お支払い情報', icon: ICONS.payments },
  { path: '/admin-settings', label: '管理者設定', icon: ICONS.adminManagement },
];

const GlobalHeader: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const baseLinkClasses = "flex items-center space-x-2 py-4 border-b-2 text-gray-500 hover:text-pink-500 transition-colors";
  const activeLinkClasses = "border-pink-500 text-pink-500 font-semibold";
  const userName = currentUser?.user?.name || '';
  const userInitial = userName ? userName.charAt(0) : '';

  return (
    <header className="bg-white sticky top-0 z-40">
      {/* Top Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-pink-500">logo</div>
            <h1 className="text-lg text-gray-600 hidden sm:block">生徒管理システム</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {userInitial}
              </span>
              <span className="text-gray-700 font-medium">{userName}</span>
            </div>
             <Button onClick={handleLogout} variant="secondary" size="sm" className="flex items-center space-x-1.5">
                {ICONS.logout}
                <span>ログアウト</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 shadow-sm">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : 'border-transparent'}`}
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-pink-500' : 'text-gray-400'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
        </div>
      </nav>
    </header>
  );
};

export default GlobalHeader;