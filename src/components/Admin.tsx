import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </>
  );
};

export default Admin;