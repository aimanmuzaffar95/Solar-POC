import React from 'react';
import { useAppData } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Settings, Shield, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const { overridePreMeter, setOverridePreMeter } = useAppData();
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Pipeline Rules</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Pre-meter Override</p>
              <p className="text-xs text-muted-foreground">Allow moving jobs to "Installed" without pre-meter approval</p>
            </div>
            <button
              onClick={() => isAdmin && setOverridePreMeter(!overridePreMeter)}
              disabled={!isAdmin}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                overridePreMeter ? "bg-primary" : "bg-muted",
                !isAdmin && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-card shadow-sm absolute top-0.5 transition-transform",
                overridePreMeter ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Bell className="w-4 h-4 text-solar-amber" />
          <h3 className="text-sm font-semibold text-foreground">Alert Configuration</h3>
        </div>
        <div className="p-4 space-y-3 text-sm">
          {[
            ['Pre-meter pending threshold', '7 days'],
            ['Install warning threshold', '3 days before'],
            ['Post-meter submission deadline', '2 days after install'],
            ['Invoice overdue threshold', '14 days'],
            ['Max jobs per team per day', '2'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-foreground">{label}</span>
              <span className="text-muted-foreground font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">System Info</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground space-y-1">
          <p>Version: POC 1.0</p>
          <p>Data: In-memory seed data (22 jobs, 10 customers)</p>
          <p>Authentication: Mock role-based</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
