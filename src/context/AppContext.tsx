import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Job, Customer, MeterApplication, Note, Comment,
  FileUpload, TimelineEvent, Alert, PipelineStage
} from '@/data/models';
import {
  jobs as seedJobs, customers as seedCustomers,
  meterApplications as seedMeters, notes as seedNotes,
  comments as seedComments, fileUploads as seedFiles,
  timelineEvents as seedTimeline, alerts as seedAlerts
} from '@/data/seedData';

interface AppState {
  jobs: Job[];
  customers: Customer[];
  meters: MeterApplication[];
  notes: Note[];
  comments: Comment[];
  files: FileUpload[];
  timeline: TimelineEvent[];
  alerts: Alert[];
  overridePreMeter: boolean;
  setOverridePreMeter: (v: boolean) => void;
  addCustomer: (customer: Customer) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  moveJobStage: (jobId: string, newStage: PipelineStage, userId: string) => boolean;
  addNote: (note: Note) => void;
  addComment: (comment: Comment) => void;
  addFile: (file: FileUpload) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  updateMeter: (id: string, updates: Partial<MeterApplication>) => void;
  resolveAlert: (id: string) => void;
  refreshAlerts: () => void;
  getCustomer: (id: string) => Customer | undefined;
  getJobMeters: (jobId: string) => MeterApplication[];
  getJobNotes: (jobId: string) => Note[];
  getJobComments: (jobId: string) => Comment[];
  getJobFiles: (jobId: string) => FileUpload[];
  getJobTimeline: (jobId: string) => TimelineEvent[];
  getJobAlerts: (jobId: string) => Alert[];
}

const AppContext = createContext<AppState>({} as AppState);
export const useAppData = () => useContext(AppContext);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [meters, setMeters] = useState<MeterApplication[]>(seedMeters);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [comments, setComments] = useState<Comment[]>(seedComments);
  const [files, setFiles] = useState<FileUpload[]>(seedFiles);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(seedTimeline);
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [overridePreMeter, setOverridePreMeter] = useState(false);

  const addCustomer = useCallback((customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  }, []);

  const moveJobStage = useCallback((jobId: string, newStage: PipelineStage, userId: string): boolean => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return false;

    // Pre-meter lock check
    if (newStage === 'installed' && !overridePreMeter) {
      const preMeter = meters.find(m => m.jobId === jobId && m.type === 'pre_meter');
      if (!preMeter || preMeter.status !== 'approved') return false;
    }

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, pipelineStage: newStage, jobStatus: newStage } : j));
    const te: TimelineEvent = {
      id: `te_${Date.now()}`,
      jobId,
      eventType: 'stage_change',
      description: `Moved to ${newStage.replace(/_/g, ' ')}`,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };
    setTimeline(prev => [...prev, te]);
    return true;
  }, [jobs, meters, overridePreMeter]);

  const addNote = useCallback((note: Note) => setNotes(prev => [...prev, note]), []);
  const addComment = useCallback((comment: Comment) => setComments(prev => [...prev, comment]), []);
  const addFile = useCallback((file: FileUpload) => setFiles(prev => [...prev, file]), []);
  const addTimelineEvent = useCallback((event: TimelineEvent) => setTimeline(prev => [...prev, event]), []);
  const updateMeter = useCallback((id: string, updates: Partial<MeterApplication>) => {
    setMeters(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);
  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }, []);

  const refreshAlerts = useCallback(() => {
    const now = new Date();
    const newAlerts: Alert[] = [];
    const INVOICE_OVERDUE_DAYS = 14;

    jobs.forEach(job => {
      const customer = customers.find(c => c.id === job.customerId);
      const name = customer?.name || 'Unknown';

      // Pre-meter pending > 7 days
      const preMeter = meters.find(m => m.jobId === job.id && m.type === 'pre_meter');
      if (preMeter && preMeter.status === 'pending') {
        const daysPending = Math.floor((now.getTime() - new Date(preMeter.dateSubmitted).getTime()) / 86400000);
        if (daysPending > 7) {
          newAlerts.push({
            id: `alert_pm_${job.id}`, jobId: job.id, type: 'PRE_METER_PENDING_7_DAYS',
            severity: 'high', message: `Pre-meter pending ${daysPending} days — ${name}`,
            createdAt: now.toISOString(), resolved: false,
          });
        }
      }

      // Install within 3 days and pre-meter not approved
      if (job.installDate) {
        const daysToInstall = Math.floor((new Date(job.installDate).getTime() - now.getTime()) / 86400000);
        if (daysToInstall <= 3 && daysToInstall >= 0 && (!preMeter || preMeter.status !== 'approved')) {
          newAlerts.push({
            id: `alert_inst_${job.id}`, jobId: job.id, type: 'INSTALL_WITHIN_3_DAYS_PRE_METER_NOT_APPROVED',
            severity: 'high', message: `Install in ${daysToInstall} days, pre-meter not approved — ${name}`,
            createdAt: now.toISOString(), resolved: false,
          });
        }
      }

      // Post-meter not submitted 2 days after install
      if (job.pipelineStage === 'installed' && job.installDate) {
        const daysSinceInstall = Math.floor((now.getTime() - new Date(job.installDate).getTime()) / 86400000);
        const postMeter = meters.find(m => m.jobId === job.id && m.type === 'post_meter');
        if (daysSinceInstall > 2 && !postMeter) {
          newAlerts.push({
            id: `alert_postm_${job.id}`, jobId: job.id, type: 'POST_METER_NOT_SUBMITTED_2_DAYS_AFTER_INSTALL',
            severity: 'medium', message: `Post-meter not submitted ${daysSinceInstall} days after install — ${name}`,
            createdAt: now.toISOString(), resolved: false,
          });
        }
      }

      // Invoice not paid after X days
      if (job.invoiceStatus === 'invoiced' && job.invoiceDate) {
        const daysSinceInvoice = Math.floor((now.getTime() - new Date(job.invoiceDate).getTime()) / 86400000);
        if (daysSinceInvoice > INVOICE_OVERDUE_DAYS) {
          newAlerts.push({
            id: `alert_inv_${job.id}`, jobId: job.id, type: 'INVOICE_NOT_PAID_AFTER_X_DAYS',
            severity: 'high', message: `Invoice overdue ${daysSinceInvoice} days — ${name} $${job.projectPrice.toLocaleString()}`,
            createdAt: now.toISOString(), resolved: false,
          });
        }
      }
    });

    setAlerts(newAlerts);
  }, [jobs, meters, customers]);

  const getCustomer = useCallback((id: string) => customers.find(c => c.id === id), [customers]);
  const getJobMeters = useCallback((jobId: string) => meters.filter(m => m.jobId === jobId), [meters]);
  const getJobNotes = useCallback((jobId: string) => notes.filter(n => n.jobId === jobId), [notes]);
  const getJobComments = useCallback((jobId: string) => comments.filter(c => c.jobId === jobId), [comments]);
  const getJobFiles = useCallback((jobId: string) => files.filter(f => f.jobId === jobId), [files]);
  const getJobTimeline = useCallback((jobId: string) => timeline.filter(t => t.jobId === jobId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [timeline]);
  const getJobAlerts = useCallback((jobId: string) => alerts.filter(a => a.jobId === jobId && !a.resolved), [alerts]);

  return (
    <AppContext.Provider value={{
      jobs, customers, meters, notes, comments, files, timeline, alerts,
      overridePreMeter, setOverridePreMeter,
      addCustomer, updateJob, moveJobStage, addNote, addComment, addFile, addTimelineEvent,
      updateMeter, resolveAlert, refreshAlerts, getCustomer,
      getJobMeters, getJobNotes, getJobComments, getJobFiles, getJobTimeline, getJobAlerts,
    }}>
      {children}
    </AppContext.Provider>
  );
};
