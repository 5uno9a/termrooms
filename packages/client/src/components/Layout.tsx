import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="bg-black">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
