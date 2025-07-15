import React from 'react';
import GlobalHeader from './Sidebar'; // Re-using Sidebar file for the new GlobalHeader

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <GlobalHeader />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;