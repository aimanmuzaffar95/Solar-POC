// Data models for Fordan Solar CRM

export type PipelineStage =
  | 'lead'
  | 'quoted'
  | 'won'
  | 'pre_meter_submitted'
  | 'pre_meter_approved'
  | 'scheduled'
  | 'installed'
  | 'post_meter_submitted'
  | 'completed'
  | 'invoiced'
  | 'paid';

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'won', label: 'Won' },
  { key: 'pre_meter_submitted', label: 'Pre-Meter Submitted' },
  { key: 'pre_meter_approved', label: 'Pre-Meter Approved' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'installed', label: 'Installed' },
  { key: 'post_meter_submitted', label: 'Post-Meter Submitted' },
  { key: 'completed', label: 'Completed' },
  { key: 'invoiced', label: 'Invoiced' },
  { key: 'paid', label: 'Paid' },
];

export type SystemType = 'solar' | 'battery' | 'both';
export type TeamAssignment = 'Team 1' | 'Team 2' | 'Team 3';
export type InvoiceStatus = 'not_invoiced' | 'invoiced' | 'paid';
export type MeterType = 'pre_meter' | 'post_meter';
export type MeterStatus = 'pending' | 'approved' | 'rejected';
export type AlertType =
  | 'PRE_METER_PENDING_7_DAYS'
  | 'INSTALL_WITHIN_3_DAYS_PRE_METER_NOT_APPROVED'
  | 'POST_METER_NOT_SUBMITTED_2_DAYS_AFTER_INSTALL'
  | 'INVOICE_NOT_PAID_AFTER_X_DAYS';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type FileCategory = 'photos' | 'signed_paperwork' | 'meter_docs' | 'other';
export type UserRole = 'admin' | 'installer';

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Job {
  id: string;
  customerId: string;
  systemType: SystemType;
  systemSizeKw: number;
  contractSigned: boolean;
  depositPaid: boolean;
  depositAmount: number;
  depositDate: string | null;
  projectPrice: number;
  etaCompletionDate: string;
  pipelineStage: PipelineStage;
  installDate: string | null;
  assignedTeam: TeamAssignment;
  jobStatus: string;
  invoiceStatus: InvoiceStatus;
  invoiceDate: string | null;
  invoiceDueDate: string | null;
  paidDate: string | null;
}

export interface MeterApplication {
  id: string;
  jobId: string;
  type: MeterType;
  dateSubmitted: string;
  submittedBy: string;
  approvalDate: string | null;
  status: MeterStatus;
  rejectionReason?: string;
  documents: string[];
}

export interface Note {
  id: string;
  jobId: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface Comment {
  id: string;
  jobId: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface FileUpload {
  id: string;
  jobId: string;
  category: FileCategory;
  filename: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface TimelineEvent {
  id: string;
  jobId: string;
  eventType: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface Alert {
  id: string;
  jobId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  team?: TeamAssignment;
}
