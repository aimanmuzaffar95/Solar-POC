import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { PIPELINE_STAGES } from '@/data/models';
import type { PipelineStage, TeamAssignment, MeterStatus, FileCategory } from '@/data/models';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, User, MapPin, Phone, Mail, Sun, Battery, Zap,
  Calendar, Users, CheckCircle2, XCircle, Clock, Upload,
  FileText, MessageSquare, StickyNote, AlertTriangle, ChevronDown
} from 'lucide-react';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, teams, customers, getJobMeters, getJobNotes, getJobComments, getJobFiles, getJobTimeline, getJobAlerts, updateJob, updateMeter, addNote, addComment, addFile, addTimelineEvent, moveJobStage } = useAppData();
  const { user, isAdmin } = useAuth();

  const [newNote, setNewNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const job = jobs.find(j => j.id === id);
  if (!job) return <div className="p-8 text-center text-muted-foreground">Job not found</div>;

  const customer = customers.find(c => c.id === job.customerId);
  const meters = getJobMeters(job.id);
  const jobNotes = getJobNotes(job.id);
  const jobComments = getJobComments(job.id);
  const jobFiles = getJobFiles(job.id);
  const jobTimeline = getJobTimeline(job.id);
  const jobAlerts = getJobAlerts(job.id);

  const preMeter = meters.find(m => m.type === 'pre_meter');
  const postMeter = meters.find(m => m.type === 'post_meter');

  const handleMeterAction = (meterId: string, status: MeterStatus) => {
    updateMeter(meterId, {
      status,
      approvalDate: status === 'approved' ? new Date().toISOString().split('T')[0] : null,
      rejectionReason: status === 'rejected' ? 'Rejected by admin' : undefined,
    });
    addTimelineEvent({
      id: `te_${Date.now()}`, jobId: job.id,
      eventType: status === 'approved' ? 'meter_approved' : 'meter_rejected',
      description: `Meter application ${status}`,
      createdAt: new Date().toISOString(), createdBy: user?.name || '',
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote({ id: `n_${Date.now()}`, jobId: job.id, text: newNote, createdAt: new Date().toISOString(), createdBy: user?.name || '' });
    setNewNote('');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment({ id: `cm_${Date.now()}`, jobId: job.id, text: newComment, createdAt: new Date().toISOString(), createdBy: user?.name || '' });
    setNewComment('');
  };

  const handleMockUpload = (category: FileCategory) => {
    addFile({
      id: `f_${Date.now()}`, jobId: job.id, category,
      filename: `${category}_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.name || '', url: '#',
    });
  };

  const handleStageChange = (stage: PipelineStage) => {
    if (user) moveJobStage(job.id, stage, user.name);
    setShowStageDropdown(false);
  };

  const handleTeamChange = (team: TeamAssignment) => {
    if (team === job.assignedTeam) {
      setShowTeamDropdown(false);
      return;
    }
    updateJob(job.id, { assignedTeam: team });
    addTimelineEvent({
      id: `te_${Date.now()}`,
      jobId: job.id,
      eventType: 'assignment_change',
      description: `Assigned to ${team}`,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || '',
    });
    setShowTeamDropdown(false);
  };

  const getSystemIcon = () => {
    if (job.systemType === 'solar') return <Sun className="w-4 h-4 text-solar-amber" />;
    if (job.systemType === 'battery') return <Battery className="w-4 h-4 text-solar-teal" />;
    return <Zap className="w-4 h-4 text-solar-amber-light" />;
  };

  const meterStatusColor = (status: MeterStatus) => {
    if (status === 'approved') return 'text-solar-success';
    if (status === 'rejected') return 'text-destructive';
    return 'text-solar-warning';
  };

  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-card rounded-xl border border-border shadow-card">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <Link to="/pipeline" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </Link>

      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{customer?.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{customer?.address}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer?.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer?.email}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTeamDropdown(false);
                    setShowStageDropdown(!showStageDropdown);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  {PIPELINE_STAGES.find(s => s.key === job.pipelineStage)?.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStageDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10 py-1">
                    {PIPELINE_STAGES.map(s => (
                      <button
                        key={s.key}
                        onClick={() => handleStageChange(s.key)}
                        className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors", s.key === job.pipelineStage && "text-primary font-medium")}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStageDropdown(false);
                    setShowTeamDropdown(!showTeamDropdown);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  {job.assignedTeam}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showTeamDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-10 py-1">
                    {teams.map((team: TeamAssignment) => (
                      <button
                        key={team}
                        onClick={() => handleTeamChange(team)}
                        className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors", team === job.assignedTeam && "text-primary font-medium")}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {jobAlerts.length > 0 && (
        <div className="space-y-2">
          {jobAlerts.map(a => (
            <div key={a.id} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              {a.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Job Summary */}
        <Section title="Job Summary" icon={getSystemIcon()}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['System', `${job.systemType} — ${job.systemSizeKw}kW`],
              ['Price', `$${job.projectPrice.toLocaleString()}`],
              ['Team', job.assignedTeam],
              ['Install Date', job.installDate || 'Not set'],
              ['ETA', job.etaCompletionDate],
              ['Deposit', job.depositPaid ? `$${job.depositAmount.toLocaleString()}` : 'Not paid'],
              ['Invoice', job.invoiceStatus.replace(/_/g, ' ')],
              ['Contract', job.contractSigned ? 'Signed' : 'Not signed'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
              {job.invoiceStatus === 'not_invoiced' && (
                <button onClick={() => updateJob(job.id, { invoiceStatus: 'invoiced', invoiceDate: new Date().toISOString().split('T')[0], invoiceDueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] })} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Mark Invoiced</button>
              )}
              {job.invoiceStatus === 'invoiced' && (
                <button onClick={() => updateJob(job.id, { invoiceStatus: 'paid', paidDate: new Date().toISOString().split('T')[0] })} className="px-3 py-1.5 rounded-lg bg-solar-success text-primary-foreground text-xs font-medium">Mark Paid</button>
              )}
            </div>
          )}
        </Section>

        {/* Pre-Meter */}
        <Section title="Pre-Meter Application" icon={<FileText className="w-4 h-4 text-solar-info" />}>
          {preMeter ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><p className={cn("font-medium capitalize", meterStatusColor(preMeter.status))}>{preMeter.status}</p></div>
                <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium text-foreground">{preMeter.dateSubmitted}</p></div>
                <div><p className="text-xs text-muted-foreground">By</p><p className="font-medium text-foreground">{preMeter.submittedBy}</p></div>
                {preMeter.approvalDate && <div><p className="text-xs text-muted-foreground">Approved</p><p className="font-medium text-foreground">{preMeter.approvalDate}</p></div>}
              </div>
              {isAdmin && preMeter.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleMeterAction(preMeter.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-solar-success text-primary-foreground text-xs font-medium"><CheckCircle2 className="w-3 h-3" />Approve</button>
                  <button onClick={() => handleMeterAction(preMeter.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium"><XCircle className="w-3 h-3" />Reject</button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pre-meter application submitted</p>
          )}
        </Section>

        {/* Post-Meter */}
        <Section title="Post-Meter Application" icon={<FileText className="w-4 h-4 text-solar-teal" />}>
          {postMeter ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Status</p><p className={cn("font-medium capitalize", meterStatusColor(postMeter.status))}>{postMeter.status}</p></div>
                <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium text-foreground">{postMeter.dateSubmitted}</p></div>
                <div><p className="text-xs text-muted-foreground">By</p><p className="font-medium text-foreground">{postMeter.submittedBy}</p></div>
                {postMeter.approvalDate && <div><p className="text-xs text-muted-foreground">Approved</p><p className="font-medium text-foreground">{postMeter.approvalDate}</p></div>}
              </div>
              {isAdmin && postMeter.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleMeterAction(postMeter.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-solar-success text-primary-foreground text-xs font-medium"><CheckCircle2 className="w-3 h-3" />Approve</button>
                  <button onClick={() => handleMeterAction(postMeter.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium"><XCircle className="w-3 h-3" />Reject</button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No post-meter application submitted</p>
          )}
        </Section>

        {/* Notes */}
        <Section title="Notes" icon={<StickyNote className="w-4 h-4 text-solar-amber" />}>
          <div className="space-y-3">
            {jobNotes.map(n => (
              <div key={n.id} className="p-2 rounded-lg bg-muted/50 text-sm">
                <p className="text-foreground">{n.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.createdBy} · {new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground" onKeyDown={e => e.key === 'Enter' && handleAddNote()} />
              <button onClick={handleAddNote} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Add</button>
            </div>
          </div>
        </Section>

        {/* Comments */}
        <Section title="Internal Comments" icon={<MessageSquare className="w-4 h-4 text-solar-info" />}>
          <div className="space-y-3">
            {jobComments.map(c => (
              <div key={c.id} className="p-2 rounded-lg bg-muted/50 text-sm">
                <p className="text-foreground">{c.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{c.createdBy} · {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground" onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
              <button onClick={handleAddComment} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Add</button>
            </div>
          </div>
        </Section>

        {/* Files */}
        <Section title="File Uploads" icon={<Upload className="w-4 h-4 text-solar-teal" />}>
          <div className="space-y-3">
            {jobFiles.map(f => (
              <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate">{f.filename}</p>
                  <p className="text-[10px] text-muted-foreground">{f.category} · {f.uploadedBy}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {(['photos', 'signed_paperwork', 'meter_docs', 'other'] as FileCategory[]).map(cat => (
                <button key={cat} onClick={() => handleMockUpload(cat)} className="px-3 py-1.5 rounded-lg border border-border bg-secondary text-secondary-foreground text-xs hover:bg-accent transition-colors capitalize">
                  Upload {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="Status Timeline" icon={<Clock className="w-4 h-4 text-muted-foreground" />}>
          <div className="space-y-3">
            {jobTimeline.length === 0 && <p className="text-sm text-muted-foreground">No events yet</p>}
            {jobTimeline.map(t => (
              <div key={t.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{t.description}</p>
                  <p className="text-[10px] text-muted-foreground">{t.createdBy} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default JobDetail;
