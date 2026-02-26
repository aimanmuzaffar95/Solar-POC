import type {
  Customer, Job, MeterApplication, Note, Comment,
  FileUpload, TimelineEvent, Alert, AppUser
} from './models';

// Helper
const d = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const users: AppUser[] = [
  { id: 'u1', name: 'James Fordan', role: 'admin' },
  { id: 'u2', name: 'Mike Torres', role: 'installer', team: 'Team 1' },
  { id: 'u3', name: 'Dave Chen', role: 'installer', team: 'Team 2' },
  { id: 'u4', name: 'Sam Reeves', role: 'installer', team: 'Team 3' },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'John Smith', address: '12 Oak Street, Brisbane QLD 4000', phone: '0412 345 678', email: 'john.smith@email.com' },
  { id: 'c2', name: 'Sarah Johnson', address: '45 River Road, Gold Coast QLD 4217', phone: '0423 456 789', email: 'sarah.j@email.com' },
  { id: 'c3', name: 'Michael Brown', address: '78 Hill Ave, Sunshine Coast QLD 4556', phone: '0434 567 890', email: 'mbrown@email.com' },
  { id: 'c4', name: 'Emily Davis', address: '23 Beach Blvd, Cairns QLD 4870', phone: '0445 678 901', email: 'emily.d@email.com' },
  { id: 'c5', name: 'David Wilson', address: '56 Park Lane, Townsville QLD 4810', phone: '0456 789 012', email: 'dwilson@email.com' },
  { id: 'c6', name: 'Lisa Anderson', address: '89 Main St, Toowoomba QLD 4350', phone: '0467 890 123', email: 'lisa.a@email.com' },
  { id: 'c7', name: 'Robert Taylor', address: '34 Garden Cres, Ipswich QLD 4305', phone: '0478 901 234', email: 'rtaylor@email.com' },
  { id: 'c8', name: 'Jennifer Martin', address: '67 Sunset Dr, Mackay QLD 4740', phone: '0489 012 345', email: 'jmartin@email.com' },
  { id: 'c9', name: 'Chris Thompson', address: '12 Lake View, Rockhampton QLD 4700', phone: '0490 123 456', email: 'cthompson@email.com' },
  { id: 'c10', name: 'Amanda White', address: '45 Forest Rd, Bundaberg QLD 4670', phone: '0401 234 567', email: 'awhite@email.com' },
];

export const jobs: Job[] = [
  { id: 'j1', customerId: 'c1', systemType: 'both', systemSizeKw: 10, contractSigned: true, depositPaid: true, depositAmount: 3000, depositDate: d(-30), projectPrice: 18500, etaCompletionDate: d(5), pipelineStage: 'scheduled', installDate: d(2), assignedTeam: 'Team 1', jobStatus: 'Scheduled', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j2', customerId: 'c2', systemType: 'solar', systemSizeKw: 6.6, contractSigned: true, depositPaid: true, depositAmount: 2000, depositDate: d(-45), projectPrice: 12000, etaCompletionDate: d(-5), pipelineStage: 'installed', installDate: d(-3), assignedTeam: 'Team 2', jobStatus: 'Installed', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j3', customerId: 'c3', systemType: 'solar', systemSizeKw: 13.2, contractSigned: true, depositPaid: true, depositAmount: 4000, depositDate: d(-60), projectPrice: 24000, etaCompletionDate: d(-15), pipelineStage: 'invoiced', installDate: d(-20), assignedTeam: 'Team 1', jobStatus: 'Invoiced', invoiceStatus: 'invoiced', invoiceDate: d(-10), invoiceDueDate: d(4), paidDate: null },
  { id: 'j4', customerId: 'c4', systemType: 'battery', systemSizeKw: 5, contractSigned: true, depositPaid: true, depositAmount: 2500, depositDate: d(-20), projectPrice: 15000, etaCompletionDate: d(10), pipelineStage: 'pre_meter_submitted', installDate: null, assignedTeam: 'Team 3', jobStatus: 'Pre-Meter Submitted', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j5', customerId: 'c5', systemType: 'solar', systemSizeKw: 8.8, contractSigned: true, depositPaid: false, depositAmount: 0, depositDate: null, projectPrice: 16500, etaCompletionDate: d(30), pipelineStage: 'won', installDate: null, assignedTeam: 'Team 1', jobStatus: 'Won', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j6', customerId: 'c6', systemType: 'both', systemSizeKw: 15, contractSigned: true, depositPaid: true, depositAmount: 5000, depositDate: d(-90), projectPrice: 32000, etaCompletionDate: d(-30), pipelineStage: 'paid', installDate: d(-40), assignedTeam: 'Team 2', jobStatus: 'Paid', invoiceStatus: 'paid', invoiceDate: d(-25), invoiceDueDate: d(-11), paidDate: d(-8) },
  { id: 'j7', customerId: 'c7', systemType: 'solar', systemSizeKw: 6.6, contractSigned: false, depositPaid: false, depositAmount: 0, depositDate: null, projectPrice: 11000, etaCompletionDate: d(45), pipelineStage: 'quoted', installDate: null, assignedTeam: 'Team 2', jobStatus: 'Quoted', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j8', customerId: 'c8', systemType: 'solar', systemSizeKw: 10, contractSigned: true, depositPaid: true, depositAmount: 3000, depositDate: d(-15), projectPrice: 19500, etaCompletionDate: d(7), pipelineStage: 'pre_meter_approved', installDate: null, assignedTeam: 'Team 3', jobStatus: 'Pre-Meter Approved', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j9', customerId: 'c9', systemType: 'both', systemSizeKw: 20, contractSigned: true, depositPaid: true, depositAmount: 6000, depositDate: d(-50), projectPrice: 42000, etaCompletionDate: d(-10), pipelineStage: 'completed', installDate: d(-15), assignedTeam: 'Team 1', jobStatus: 'Completed', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j10', customerId: 'c10', systemType: 'solar', systemSizeKw: 5, contractSigned: false, depositPaid: false, depositAmount: 0, depositDate: null, projectPrice: 9500, etaCompletionDate: d(60), pipelineStage: 'lead', installDate: null, assignedTeam: 'Team 1', jobStatus: 'Lead', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j11', customerId: 'c1', systemType: 'battery', systemSizeKw: 10, contractSigned: true, depositPaid: true, depositAmount: 3500, depositDate: d(-10), projectPrice: 21000, etaCompletionDate: d(14), pipelineStage: 'scheduled', installDate: d(3), assignedTeam: 'Team 2', jobStatus: 'Scheduled', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j12', customerId: 'c3', systemType: 'solar', systemSizeKw: 6.6, contractSigned: true, depositPaid: true, depositAmount: 2000, depositDate: d(-25), projectPrice: 13000, etaCompletionDate: d(3), pipelineStage: 'scheduled', installDate: d(2), assignedTeam: 'Team 3', jobStatus: 'Scheduled', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j13', customerId: 'c5', systemType: 'solar', systemSizeKw: 9.9, contractSigned: false, depositPaid: false, depositAmount: 0, depositDate: null, projectPrice: 17000, etaCompletionDate: d(50), pipelineStage: 'lead', installDate: null, assignedTeam: 'Team 2', jobStatus: 'Lead', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j14', customerId: 'c7', systemType: 'both', systemSizeKw: 12, contractSigned: true, depositPaid: true, depositAmount: 4000, depositDate: d(-40), projectPrice: 28000, etaCompletionDate: d(-8), pipelineStage: 'post_meter_submitted', installDate: d(-12), assignedTeam: 'Team 1', jobStatus: 'Post-Meter Submitted', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j15', customerId: 'c8', systemType: 'solar', systemSizeKw: 6.6, contractSigned: true, depositPaid: true, depositAmount: 2000, depositDate: d(-70), projectPrice: 12500, etaCompletionDate: d(-25), pipelineStage: 'paid', installDate: d(-35), assignedTeam: 'Team 3', jobStatus: 'Paid', invoiceStatus: 'paid', invoiceDate: d(-20), invoiceDueDate: d(-6), paidDate: d(-3) },
  { id: 'j16', customerId: 'c2', systemType: 'battery', systemSizeKw: 13.5, contractSigned: true, depositPaid: true, depositAmount: 4500, depositDate: d(-8), projectPrice: 25000, etaCompletionDate: d(20), pipelineStage: 'pre_meter_submitted', installDate: null, assignedTeam: 'Team 2', jobStatus: 'Pre-Meter Submitted', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j17', customerId: 'c4', systemType: 'solar', systemSizeKw: 10, contractSigned: true, depositPaid: true, depositAmount: 3000, depositDate: d(-55), projectPrice: 19000, etaCompletionDate: d(-18), pipelineStage: 'invoiced', installDate: d(-25), assignedTeam: 'Team 2', jobStatus: 'Invoiced', invoiceStatus: 'invoiced', invoiceDate: d(-15), invoiceDueDate: d(-1), paidDate: null },
  { id: 'j18', customerId: 'c6', systemType: 'solar', systemSizeKw: 8, contractSigned: false, depositPaid: false, depositAmount: 0, depositDate: null, projectPrice: 14500, etaCompletionDate: d(40), pipelineStage: 'quoted', installDate: null, assignedTeam: 'Team 3', jobStatus: 'Quoted', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j19', customerId: 'c9', systemType: 'both', systemSizeKw: 16, contractSigned: true, depositPaid: true, depositAmount: 5000, depositDate: d(-35), projectPrice: 35000, etaCompletionDate: d(1), pipelineStage: 'scheduled', installDate: d(1), assignedTeam: 'Team 1', jobStatus: 'Scheduled', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j20', customerId: 'c10', systemType: 'solar', systemSizeKw: 6.6, contractSigned: true, depositPaid: true, depositAmount: 2000, depositDate: d(-5), projectPrice: 12000, etaCompletionDate: d(25), pipelineStage: 'won', installDate: null, assignedTeam: 'Team 3', jobStatus: 'Won', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
  { id: 'j21', customerId: 'c1', systemType: 'solar', systemSizeKw: 5, contractSigned: true, depositPaid: true, depositAmount: 1500, depositDate: d(-80), projectPrice: 9000, etaCompletionDate: d(-40), pipelineStage: 'paid', installDate: d(-50), assignedTeam: 'Team 2', jobStatus: 'Paid', invoiceStatus: 'paid', invoiceDate: d(-35), invoiceDueDate: d(-21), paidDate: d(-18) },
  { id: 'j22', customerId: 'c3', systemType: 'both', systemSizeKw: 11, contractSigned: true, depositPaid: true, depositAmount: 3500, depositDate: d(-12), projectPrice: 22000, etaCompletionDate: d(12), pipelineStage: 'pre_meter_approved', installDate: null, assignedTeam: 'Team 1', jobStatus: 'Pre-Meter Approved', invoiceStatus: 'not_invoiced', invoiceDate: null, invoiceDueDate: null, paidDate: null },
];

export const meterApplications: MeterApplication[] = [
  { id: 'm1', jobId: 'j1', type: 'pre_meter', dateSubmitted: d(-20), submittedBy: 'James Fordan', approvalDate: d(-12), status: 'approved', documents: ['pre_meter_form_j1.pdf'] },
  { id: 'm2', jobId: 'j2', type: 'pre_meter', dateSubmitted: d(-30), submittedBy: 'James Fordan', approvalDate: d(-22), status: 'approved', documents: ['pre_meter_form_j2.pdf'] },
  { id: 'm3', jobId: 'j3', type: 'pre_meter', dateSubmitted: d(-50), submittedBy: 'James Fordan', approvalDate: d(-42), status: 'approved', documents: ['pre_meter_form_j3.pdf'] },
  { id: 'm4', jobId: 'j3', type: 'post_meter', dateSubmitted: d(-18), submittedBy: 'James Fordan', approvalDate: d(-12), status: 'approved', documents: ['post_meter_form_j3.pdf'] },
  { id: 'm5', jobId: 'j4', type: 'pre_meter', dateSubmitted: d(-10), submittedBy: 'James Fordan', approvalDate: null, status: 'pending', documents: ['pre_meter_form_j4.pdf'] },
  { id: 'm6', jobId: 'j8', type: 'pre_meter', dateSubmitted: d(-12), submittedBy: 'James Fordan', approvalDate: d(-5), status: 'approved', documents: ['pre_meter_form_j8.pdf'] },
  { id: 'm7', jobId: 'j9', type: 'pre_meter', dateSubmitted: d(-40), submittedBy: 'James Fordan', approvalDate: d(-32), status: 'approved', documents: ['pre_meter_form_j9.pdf'] },
  { id: 'm8', jobId: 'j9', type: 'post_meter', dateSubmitted: d(-12), submittedBy: 'James Fordan', approvalDate: d(-8), status: 'approved', documents: ['post_meter_form_j9.pdf'] },
  { id: 'm9', jobId: 'j14', type: 'pre_meter', dateSubmitted: d(-35), submittedBy: 'James Fordan', approvalDate: d(-28), status: 'approved', documents: ['pre_meter_form_j14.pdf'] },
  { id: 'm10', jobId: 'j14', type: 'post_meter', dateSubmitted: d(-5), submittedBy: 'James Fordan', approvalDate: null, status: 'pending', documents: ['post_meter_form_j14.pdf'] },
  { id: 'm11', jobId: 'j16', type: 'pre_meter', dateSubmitted: d(-5), submittedBy: 'James Fordan', approvalDate: null, status: 'pending', documents: ['pre_meter_form_j16.pdf'] },
  { id: 'm12', jobId: 'j22', type: 'pre_meter', dateSubmitted: d(-8), submittedBy: 'James Fordan', approvalDate: d(-3), status: 'approved', documents: ['pre_meter_form_j22.pdf'] },
  { id: 'm13', jobId: 'j11', type: 'pre_meter', dateSubmitted: d(-7), submittedBy: 'James Fordan', approvalDate: d(-2), status: 'approved', documents: ['pre_meter_form_j11.pdf'] },
  { id: 'm14', jobId: 'j12', type: 'pre_meter', dateSubmitted: d(-18), submittedBy: 'James Fordan', approvalDate: d(-10), status: 'approved', documents: ['pre_meter_form_j12.pdf'] },
  { id: 'm15', jobId: 'j19', type: 'pre_meter', dateSubmitted: d(-25), submittedBy: 'James Fordan', approvalDate: d(-18), status: 'approved', documents: ['pre_meter_form_j19.pdf'] },
  { id: 'm16', jobId: 'j6', type: 'pre_meter', dateSubmitted: d(-80), submittedBy: 'James Fordan', approvalDate: d(-72), status: 'approved', documents: ['pre_meter_form_j6.pdf'] },
  { id: 'm17', jobId: 'j6', type: 'post_meter', dateSubmitted: d(-35), submittedBy: 'James Fordan', approvalDate: d(-28), status: 'approved', documents: ['post_meter_form_j6.pdf'] },
  { id: 'm18', jobId: 'j15', type: 'pre_meter', dateSubmitted: d(-60), submittedBy: 'James Fordan', approvalDate: d(-52), status: 'approved', documents: ['pre_meter_form_j15.pdf'] },
  { id: 'm19', jobId: 'j15', type: 'post_meter', dateSubmitted: d(-30), submittedBy: 'James Fordan', approvalDate: d(-22), status: 'approved', documents: ['post_meter_form_j15.pdf'] },
  { id: 'm20', jobId: 'j21', type: 'pre_meter', dateSubmitted: d(-70), submittedBy: 'James Fordan', approvalDate: d(-62), status: 'approved', documents: ['pre_meter_form_j21.pdf'] },
  { id: 'm21', jobId: 'j21', type: 'post_meter', dateSubmitted: d(-45), submittedBy: 'James Fordan', approvalDate: d(-38), status: 'approved', documents: ['post_meter_form_j21.pdf'] },
  { id: 'm22', jobId: 'j17', type: 'pre_meter', dateSubmitted: d(-45), submittedBy: 'James Fordan', approvalDate: d(-38), status: 'approved', documents: ['pre_meter_form_j17.pdf'] },
  { id: 'm23', jobId: 'j17', type: 'post_meter', dateSubmitted: d(-20), submittedBy: 'James Fordan', approvalDate: d(-14), status: 'approved', documents: ['post_meter_form_j17.pdf'] },
];

export const notes: Note[] = [
  { id: 'n1', jobId: 'j1', text: 'Customer wants panels on north-facing roof only', createdAt: d(-28), createdBy: 'James Fordan' },
  { id: 'n2', jobId: 'j2', text: 'Access via side gate, call before arrival', createdAt: d(-40), createdBy: 'James Fordan' },
  { id: 'n3', jobId: 'j4', text: 'Battery install in garage, customer has cleared space', createdAt: d(-18), createdBy: 'Mike Torres' },
  { id: 'n4', jobId: 'j9', text: 'Large system — may need crane for panels', createdAt: d(-48), createdBy: 'Dave Chen' },
];

export const comments: Comment[] = [
  { id: 'cm1', jobId: 'j1', text: 'Confirmed install date with customer', createdAt: d(-5), createdBy: 'James Fordan' },
  { id: 'cm2', jobId: 'j3', text: 'Invoice sent, following up next week', createdAt: d(-8), createdBy: 'James Fordan' },
  { id: 'cm3', jobId: 'j17', text: 'Payment overdue — sending reminder', createdAt: d(-1), createdBy: 'James Fordan' },
];

export const fileUploads: FileUpload[] = [
  { id: 'f1', jobId: 'j1', category: 'signed_paperwork', filename: 'contract_j1.pdf', uploadedAt: d(-29), uploadedBy: 'James Fordan', url: '#' },
  { id: 'f2', jobId: 'j2', category: 'photos', filename: 'install_photo_1.jpg', uploadedAt: d(-2), uploadedBy: 'Mike Torres', url: '#' },
  { id: 'f3', jobId: 'j3', category: 'meter_docs', filename: 'post_meter_cert.pdf', uploadedAt: d(-17), uploadedBy: 'James Fordan', url: '#' },
  { id: 'f4', jobId: 'j6', category: 'photos', filename: 'completed_install.jpg', uploadedAt: d(-38), uploadedBy: 'Dave Chen', url: '#' },
];

export const timelineEvents: TimelineEvent[] = [
  { id: 'te1', jobId: 'j1', eventType: 'stage_change', description: 'Moved to Scheduled', createdAt: d(-10), createdBy: 'James Fordan' },
  { id: 'te2', jobId: 'j2', eventType: 'stage_change', description: 'Moved to Installed', createdAt: d(-3), createdBy: 'Mike Torres' },
  { id: 'te3', jobId: 'j3', eventType: 'stage_change', description: 'Moved to Invoiced', createdAt: d(-10), createdBy: 'James Fordan' },
  { id: 'te4', jobId: 'j1', eventType: 'pre_meter_submitted', description: 'Pre-meter application submitted', createdAt: d(-20), createdBy: 'James Fordan' },
  { id: 'te5', jobId: 'j1', eventType: 'pre_meter_approved', description: 'Pre-meter application approved', createdAt: d(-12), createdBy: 'James Fordan' },
  { id: 'te6', jobId: 'j6', eventType: 'stage_change', description: 'Moved to Paid', createdAt: d(-8), createdBy: 'James Fordan' },
];

export const alerts: Alert[] = [
  { id: 'a1', jobId: 'j4', type: 'PRE_METER_PENDING_7_DAYS', severity: 'high', message: 'Pre-meter pending for 10+ days — Emily Davis (Battery 5kW)', createdAt: d(0), resolved: false },
  { id: 'a2', jobId: 'j2', type: 'POST_METER_NOT_SUBMITTED_2_DAYS_AFTER_INSTALL', severity: 'medium', message: 'Post-meter not submitted — Sarah Johnson installed 3 days ago', createdAt: d(0), resolved: false },
  { id: 'a3', jobId: 'j17', type: 'INVOICE_NOT_PAID_AFTER_X_DAYS', severity: 'high', message: 'Invoice overdue — Emily Davis $19,000 due ' + d(-1), createdAt: d(0), resolved: false },
  { id: 'a4', jobId: 'j19', type: 'INSTALL_WITHIN_3_DAYS_PRE_METER_NOT_APPROVED', severity: 'low', message: 'Install tomorrow — Chris Thompson pre-meter approved ✓', createdAt: d(0), resolved: true },
  { id: 'a5', jobId: 'j9', type: 'POST_METER_NOT_SUBMITTED_2_DAYS_AFTER_INSTALL', severity: 'low', message: 'Post-meter submitted and approved for Chris Thompson', createdAt: d(-8), resolved: true },
];
