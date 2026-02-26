import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole, TeamAssignment } from '@/data/models';
import { Sun } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole, team?: TeamAssignment) => {
    login(role, team);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-solar flex items-center justify-center mx-auto mb-4 glow-amber">
            <Sun className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Fordan Solar</h1>
          <p className="text-sm text-muted-foreground mt-1">Operations Control System</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <p className="text-sm font-medium text-foreground mb-4">Select your role to continue</p>

          <button
            onClick={() => handleLogin('admin')}
            className="w-full py-3 px-4 rounded-lg gradient-solar text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-amber"
          >
            Login as CEO / Admin
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or select installer team</span></div>
          </div>

          {(['Team 1', 'Team 2', 'Team 3'] as TeamAssignment[]).map(team => (
            <button
              key={team}
              onClick={() => handleLogin('installer', team)}
              className="w-full py-2.5 px-4 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              Login as Installer — {team}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">POC — Mock Authentication</p>
      </div>
    </div>
  );
};

export default LoginPage;
