import React, { useState, useMemo } from 'react';
import { useAppData } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(38, 92%, 50%)', 'hsl(175, 60%, 40%)', 'hsl(205, 85%, 55%)', 'hsl(142, 71%, 45%)', 'hsl(340, 75%, 55%)'];
type DateRange = '30' | '90' | '365';

const ReportsPage: React.FC = () => {
  const { jobs, customers } = useAppData();
  const [range, setRange] = useState<DateRange>('90');

  const rangeStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(range));
    return d;
  }, [range]);

  // Jobs completed per month
  const completedByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    jobs.filter(j => ['completed', 'invoiced', 'paid'].includes(j.pipelineStage) && j.installDate && new Date(j.installDate) >= rangeStart)
      .forEach(j => {
        const m = new Date(j.installDate!).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
        months[m] = (months[m] || 0) + 1;
      });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [jobs, rangeStart]);

  // Revenue per month
  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    jobs.filter(j => j.invoiceStatus === 'paid' && j.paidDate && new Date(j.paidDate) >= rangeStart)
      .forEach(j => {
        const m = new Date(j.paidDate!).toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
        months[m] = (months[m] || 0) + j.projectPrice;
      });
    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  }, [jobs, rangeStart]);

  // Team performance
  const teamPerf = useMemo(() => {
    const teams: Record<string, number> = { 'Team 1': 0, 'Team 2': 0, 'Team 3': 0 };
    jobs.filter(j => ['installed', 'completed', 'invoiced', 'paid'].includes(j.pipelineStage))
      .forEach(j => { teams[j.assignedTeam] = (teams[j.assignedTeam] || 0) + 1; });
    return Object.entries(teams).map(([team, count]) => ({ team, count }));
  }, [jobs]);

  // Conversion rate
  const quotedCount = jobs.filter(j => j.pipelineStage !== 'lead').length;
  const wonCount = jobs.filter(j => !['lead', 'quoted'].includes(j.pipelineStage)).length;
  const conversionRate = quotedCount > 0 ? Math.round((wonCount / quotedCount) * 100) : 0;

  // Avg deposit to install
  const avgDays = useMemo(() => {
    const eligible = jobs.filter(j => j.depositDate && j.installDate);
    if (eligible.length === 0) return 0;
    const total = eligible.reduce((s, j) => {
      return s + Math.floor((new Date(j.installDate!).getTime() - new Date(j.depositDate!).getTime()) / 86400000);
    }, 0);
    return Math.round(total / eligible.length);
  }, [jobs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['30', '90', '365'] as DateRange[]).map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 text-xs font-medium transition-colors ${range === r ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>
              {r === '30' ? '30 days' : r === '90' ? '90 days' : '1 year'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
          <p className="text-[10px] text-muted-foreground">Quoted → Won</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Avg Deposit → Install</p>
          <p className="text-2xl font-bold text-foreground">{avgDays} days</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">
            ${jobs.filter(j => j.invoiceStatus === 'paid').reduce((s, j) => s + j.projectPrice, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold text-foreground">{customers.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Jobs Completed */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Jobs Completed per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completedByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Team Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="team" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={60} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {teamPerf.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pre-Install', value: jobs.filter(j => ['lead', 'quoted', 'won', 'pre_meter_submitted', 'pre_meter_approved', 'scheduled'].includes(j.pipelineStage)).length },
                  { name: 'Installed', value: jobs.filter(j => ['installed', 'post_meter_submitted', 'completed'].includes(j.pipelineStage)).length },
                  { name: 'Invoiced', value: jobs.filter(j => j.pipelineStage === 'invoiced').length },
                  { name: 'Paid', value: jobs.filter(j => j.pipelineStage === 'paid').length },
                ]}
                cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
