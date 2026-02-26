import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/data/models';
import { env } from '@/config/env';
import { Sun } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-solar flex items-center justify-center mx-auto mb-4 glow-amber">
            <Sun className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{env.appName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Operations Control System</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <button
            onClick={() => handleLogin('admin')}
            className="w-full py-3 px-4 rounded-lg gradient-solar text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-amber"
          >
            Login as CEO / Admin
          </button>

        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">POC — Mock Authentication</p>
      </div>
    </div>
  );
};

export default LoginPage;
