import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ICONS } from '../constants';
import Button from './ui/Button';
import { Parent } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const ParentLayout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const parentName = currentUser?.role === 'parent' ? (currentUser.user as Parent).name : '';

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
       <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
                <span className="text-pink-500">
                    {/* ダンスや音楽をイメージした音符アイコン */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 17V5l12-2v12" stroke="#ff69b4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="6" cy="18" r="3" fill="#ffb6c1"/>
                        <circle cx="18" cy="16" r="3" fill="#ffb6c1"/>
                    </svg>
                </span>
                <span className="text-2xl font-bold text-pink-500">Dance</span>
            </div>
            <div className="flex items-center space-x-4">
                <h1 className="text-lg text-gray-600 hidden sm:block">保護者ページ</h1>
                <span className="text-gray-700 font-medium">{parentName}様</span>
                <Button onClick={handleLogout} variant="secondary" size="sm" className="flex items-center space-x-1.5">
                    {ICONS.logout}
                    <span>ログアウト</span>
                </Button>
            </div>
            </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default ParentLayout;
