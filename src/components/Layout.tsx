import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Kanban, CalendarDays, Users, BarChart3,
  Settings, LogOut, Menu, X, Sun, Smartphone, ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-50 h-full flex flex-col gradient-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-sidebar-border", !sidebarOpen && "justify-center px-2")}>
          <div className="w-8 h-8 rounded-lg gradient-solar flex items-center justify-center flex-shrink-0">
            <Sun className="w-5 h-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-sidebar-primary-foreground">Fordan Solar</h1>
              <p className="text-[10px] text-sidebar-foreground">Operations CRM</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
              </Link>
            );
          })}

          <Link
            to="/mobile-view"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              location.pathname === '/mobile-view'
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !sidebarOpen && "justify-center px-2"
            )}
          >
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="animate-fade-in">Mobile View</span>}
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-3">
          {sidebarOpen && user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-sidebar-foreground capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
            </button>
            <button
              onClick={logout}
              className={cn("flex items-center gap-2 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors", !sidebarOpen && "mx-auto")}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span className="text-xs">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {user && (
            <span className="text-xs text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user.name}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium uppercase">{user.role}</span>
            </span>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
