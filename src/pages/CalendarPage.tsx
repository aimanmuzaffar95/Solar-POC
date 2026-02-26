import React, { useState, useMemo } from 'react';
import { useAppData } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const MAX_JOBS_PER_TEAM_PER_DAY = 2;
const TEAM_COLORS = [
  'bg-primary/20 border-primary/40 text-primary',
  'bg-solar-teal/20 border-solar-teal/40 text-solar-teal',
  'bg-solar-info/20 border-solar-info/40 text-solar-info',
  'bg-solar-success/20 border-solar-success/40 text-solar-success',
  'bg-destructive/20 border-destructive/40 text-destructive',
];

const getTeamColor = (team: string, teams: string[]) => {
  const index = teams.indexOf(team);
  return TEAM_COLORS[(index >= 0 ? index : 0) % TEAM_COLORS.length];
};

const CalendarPage: React.FC = () => {
  const { jobs, customers, teams } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const teamList = teams.length > 0 ? teams : Array.from(new Set(jobs.map(j => j.assignedTeam)));

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days: Date[] = [];
    for (let i = -startDay; i < 42 - startDay; i++) {
      const d = new Date(year, month, 1 + i);
      days.push(d);
    }
    return days;
  };

  const days = viewMode === 'week' ? getWeekDays(currentDate) : getMonthDays(currentDate);

  const scheduledJobs = useMemo(() =>
    jobs.filter(j => j.installDate), [jobs]
  );

  const getJobsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledJobs.filter(j => j.installDate === dateStr);
  };

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const today = new Date().toISOString().split('T')[0];

  const formatHeader = () => {
    if (viewMode === 'week') {
      const start = days[0];
      const end = days[6];
      return `${start.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Install Calendar</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setViewMode('week')} className={cn("px-3 py-1.5 text-xs font-medium transition-colors", viewMode === 'week' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted')}>Week</button>
            <button onClick={() => setViewMode('month')} className={cn("px-3 py-1.5 text-xs font-medium transition-colors", viewMode === 'month' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted')}>Month</button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-semibold text-foreground">{formatHeader()}</span>
        <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Team legend */}
      <div className="flex gap-3 flex-wrap">
        {teamList.map(team => (
          <div key={team} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-sm border", getTeamColor(team, teamList))} />
            <span className="text-xs text-muted-foreground">{team}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dateStr = day.toISOString().split('T')[0];
            const dayJobs = getJobsForDate(day);
            const isToday = dateStr === today;
            const kwByTeam: Record<string, number> = {};
            const countByTeam: Record<string, number> = {};
            dayJobs.forEach(j => {
              kwByTeam[j.assignedTeam] = (kwByTeam[j.assignedTeam] || 0) + j.systemSizeKw;
              countByTeam[j.assignedTeam] = (countByTeam[j.assignedTeam] || 0) + 1;
            });
            const totalKw = dayJobs.reduce((s, j) => s + j.systemSizeKw, 0);
            const hasCapacityWarning = teamList.some(t => (countByTeam[t] || 0) > MAX_JOBS_PER_TEAM_PER_DAY);

            return (
              <div key={dateStr} className={cn(
                "bg-card rounded-xl border border-border p-3 min-h-[200px] flex flex-col",
                isToday && "ring-2 ring-primary/30"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                    {day.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' })}
                  </span>
                  {totalKw > 0 && (
                    <span className="text-[10px] font-mono text-muted-foreground">{totalKw}kW</span>
                  )}
                </div>
                {hasCapacityWarning && (
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-solar-warning">
                    <AlertTriangle className="w-3 h-3" /> Over capacity
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  {dayJobs.map(job => {
                    const customer = customers.find(c => c.id === job.customerId);
                    return (
                      <Link
                        key={job.id}
                        to={`/job/${job.id}`}
                        className={cn(
                          "block p-2 rounded-md border text-[10px] transition-all hover:shadow-card-hover",
                          getTeamColor(job.assignedTeam, teamList)
                        )}
                      >
                        <p className="font-semibold truncate">{customer?.name}</p>
                        <p className="opacity-75">{job.systemSizeKw}kW · {job.systemType}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-7 gap-px mb-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
            {days.map(day => {
              const dateStr = day.toISOString().split('T')[0];
              const dayJobs = getJobsForDate(day);
              const isToday = dateStr === today;
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();

              return (
                <div key={dateStr} className={cn(
                  "bg-card p-2 min-h-[100px]",
                  !isCurrentMonth && "opacity-40",
                  isToday && "ring-1 ring-inset ring-primary/30"
                )}>
                  <span className={cn("text-xs", isToday ? "text-primary font-bold" : "text-muted-foreground")}>{day.getDate()}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayJobs.slice(0, 3).map(job => {
                      const customer = customers.find(c => c.id === job.customerId);
                      return (
                        <Link
                          key={job.id}
                          to={`/job/${job.id}`}
                          className={cn("block px-1 py-0.5 rounded text-[9px] truncate border", getTeamColor(job.assignedTeam, teamList))}
                        >
                          {customer?.name}
                        </Link>
                      );
                    })}
                    {dayJobs.length > 3 && <span className="text-[9px] text-muted-foreground">+{dayJobs.length - 3} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
