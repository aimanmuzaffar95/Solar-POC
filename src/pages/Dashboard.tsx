import React from 'react';
import { useAppData } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Briefcase, CalendarDays, Clock, FileWarning, Receipt,
  DollarSign, AlertTriangle, RefreshCw, ArrowRight, Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { jobs, alerts, refreshAlerts, customers } = useAppData();
  const { user } = useAuth();

  const now = new Date();
  const in30 = new Date(); in30.setDate(in30.getDate() + 30);
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);

  const totalJobs = jobs.length;
  const scheduledThisWeek = jobs.filter(j => j.installDate && new Date(j.installDate) >= weekStart && new Date(j.installDate) <= weekEnd).length;
  const waitingPreMeter = jobs.filter(j => {
    const stageIndex = ['lead', 'quoted', 'won', 'pre_meter_submitted', 'pre_meter_approved', 'scheduled'].indexOf(j.pipelineStage);
    return stageIndex >= 0 && stageIndex < 5;
  }).length;
  const waitingPostMeter = jobs.filter(j => j.pipelineStage === 'installed').length;
  const installedNotInvoiced = jobs.filter(j => ['installed', 'post_meter_submitted', 'completed'].includes(j.pipelineStage) && j.invoiceStatus === 'not_invoiced').length;
  const invoicedNotPaid = jobs.filter(j => j.invoiceStatus === 'invoiced').length;
  const revForecast = jobs
    .filter(j => j.installDate && new Date(j.installDate) >= now && new Date(j.installDate) <= in30 && j.invoiceStatus !== 'paid')
    .reduce((sum, j) => sum + j.projectPrice, 0);

  const activeAlerts = alerts.filter(a => !a.resolved);

  const kpis = [
    { label: 'Total Jobs', value: totalJobs, icon: Briefcase, color: 'text-primary' },
    { label: 'Scheduled This Week', value: scheduledThisWeek, icon: CalendarDays, color: 'text-solar-info' },
    { label: 'Waiting Pre-Meter', value: waitingPreMeter, icon: Clock, color: 'text-solar-warning' },
    { label: 'Waiting Post-Meter', value: waitingPostMeter, icon: FileWarning, color: 'text-solar-teal' },
    { label: 'Not Invoiced', value: installedNotInvoiced, icon: Receipt, color: 'text-solar-amber-light' },
    { label: 'Unpaid Invoices', value: invoicedNotPaid, icon: DollarSign, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={refreshAlerts}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Alerts
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Forecast */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg gradient-solar flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue Forecast (Next 30 Days)</p>
            <p className="text-3xl font-bold text-foreground">${revForecast.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Based on scheduled installs with unpaid invoices</p>
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-solar-warning" />
            <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
            {activeAlerts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                {activeAlerts.length}
              </span>
            )}
          </div>
        </div>
        <div className="divide-y divide-border">
          {activeAlerts.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No active alerts</div>
          )}
          {activeAlerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                alert.severity === 'high' ? 'bg-destructive' : alert.severity === 'medium' ? 'bg-solar-warning' : 'bg-solar-teal'
              }`} />
              <p className="flex-1 text-sm text-foreground">{alert.message}</p>
              <Link
                to={`/job/${alert.jobId}`}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Pipeline Activity */}
      <div className="bg-card rounded-xl border border-border shadow-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Pipeline Overview</h2>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {['lead', 'quoted', 'won', 'scheduled', 'installed', 'invoiced', 'paid'].map(stage => {
            const count = jobs.filter(j => j.pipelineStage === stage).length;
            return (
              <div key={stage} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{stage.replace(/_/g, ' ')}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
