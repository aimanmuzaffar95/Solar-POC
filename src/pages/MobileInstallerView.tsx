import React from 'react';
import { useAppData } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Sun, Battery, Zap, MapPin, Calendar, CheckCircle2, Upload, StickyNote, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileInstallerView: React.FC = () => {
  const { jobs, customers, updateJob, addNote, addFile } = useAppData();
  const { user, logout } = useAuth();

  // Show jobs assigned to installer's team
  const myJobs = jobs.filter(j => j.assignedTeam === user?.team && ['scheduled', 'pre_meter_approved', 'installed'].includes(j.pipelineStage));

  const getIcon = (type: string) => {
    if (type === 'solar') return <Sun className="w-4 h-4 text-solar-amber" />;
    if (type === 'battery') return <Battery className="w-4 h-4 text-solar-teal" />;
    return <Zap className="w-4 h-4 text-solar-amber-light" />;
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Mobile View</h1>
            <p className="text-xs text-muted-foreground">{user?.name} · {user?.team}</p>
          </div>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground px-1">Your assigned jobs ({myJobs.length})</p>

      {myJobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No jobs assigned</div>
      )}

      {myJobs.map(job => {
        const customer = customers.find(c => c.id === job.customerId);
        return (
          <div key={job.id} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{customer?.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                  {job.pipelineStage.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{customer?.address}</p>
                <p className="flex items-center gap-1.5">{getIcon(job.systemType)} {job.systemType} · {job.systemSizeKw}kW</p>
                {job.installDate && <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />Install: {job.installDate}</p>}
              </div>
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              {job.pipelineStage !== 'installed' && (
                <button
                  onClick={() => updateJob(job.id, { pipelineStage: 'installed', jobStatus: 'Installed' })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-solar-success text-primary-foreground text-xs font-medium"
                >
                  <CheckCircle2 className="w-3 h-3" /> Mark Complete
                </button>
              )}
              <button
                onClick={() => addFile({
                  id: `f_${Date.now()}`, jobId: job.id, category: 'photos',
                  filename: `photo_${Date.now()}.jpg`, uploadedAt: new Date().toISOString(),
                  uploadedBy: user?.name || '', url: '#',
                })}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-secondary text-secondary-foreground text-xs"
              >
                <Upload className="w-3 h-3" /> Photo
              </button>
              <Link
                to={`/job/${job.id}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-secondary text-secondary-foreground text-xs"
              >
                <StickyNote className="w-3 h-3" /> Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileInstallerView;
