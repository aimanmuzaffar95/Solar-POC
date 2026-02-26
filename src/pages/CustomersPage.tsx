import React, { useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Search, User, MapPin, Phone, Mail, Plus } from 'lucide-react';
import type { CustomerMeterStatus, SystemType } from '@/data/models';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type NewCustomerForm = {
  name: string;
  address: string;
  phone: string;
  email: string;
  systemType: SystemType;
  contractSigned: boolean;
  depositPaid: boolean;
  depositAmount: string;
  installDate: string;
  preMeterStatus: CustomerMeterStatus;
  postMeterStatus: CustomerMeterStatus;
};

const initialFormState: NewCustomerForm = {
  name: '',
  address: '',
  phone: '',
  email: '',
  systemType: 'solar',
  contractSigned: false,
  depositPaid: false,
  depositAmount: '',
  installDate: '',
  preMeterStatus: 'not_submitted',
  postMeterStatus: 'not_submitted',
};

const CustomersPage: React.FC = () => {
  const { customers, jobs, addCustomer } = useAppData();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<NewCustomerForm>(initialFormState);
  const [submitError, setSubmitError] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    if (!form.name.trim() || !form.address.trim() || !form.phone.trim() || !form.email.trim()) {
      setSubmitError('Name, address, phone, and email are required.');
      return;
    }

    if (form.depositPaid && (!form.depositAmount || Number(form.depositAmount) <= 0)) {
      setSubmitError('Deposit amount must be greater than 0 when deposit is paid.');
      return;
    }

    addCustomer({
      id: `c_${Date.now()}`,
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      systemType: form.systemType,
      contractSigned: form.contractSigned,
      depositPaid: form.depositPaid,
      depositAmount: form.depositPaid ? Number(form.depositAmount) : 0,
      installDate: form.installDate || null,
      preMeterStatus: form.preMeterStatus,
      postMeterStatus: form.postMeterStatus,
    });

    setForm(initialFormState);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl">
          <Plus className="w-4 h-4" />
          Add new customer
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add new customer</DialogTitle>
            <DialogDescription>Enter customer details to add them to the customers list.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer full name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street, city, state, postcode"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>System type</Label>
                <Select value={form.systemType} onValueChange={value => setForm(prev => ({ ...prev, systemType: value as SystemType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar</SelectItem>
                    <SelectItem value="battery">Battery</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="install-date">Install date</Label>
                <Input
                  id="install-date"
                  type="date"
                  value={form.installDate}
                  onChange={e => setForm(prev => ({ ...prev, installDate: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Contract signed</Label>
                <Select
                  value={form.contractSigned ? 'yes' : 'no'}
                  onValueChange={value => setForm(prev => ({ ...prev, contractSigned: value === 'yes' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Deposit paid</Label>
                <Select
                  value={form.depositPaid ? 'yes' : 'no'}
                  onValueChange={value => setForm(prev => ({
                    ...prev,
                    depositPaid: value === 'yes',
                    depositAmount: value === 'yes' ? prev.depositAmount : '',
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deposit-amount">Deposit amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.depositAmount}
                  onChange={e => setForm(prev => ({ ...prev, depositAmount: e.target.value }))}
                  placeholder="0.00"
                  disabled={!form.depositPaid}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Pre-meter status</Label>
                <Select
                  value={form.preMeterStatus}
                  onValueChange={value => setForm(prev => ({ ...prev, preMeterStatus: value as CustomerMeterStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_submitted">Not submitted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Post-meter status</Label>
                <Select
                  value={form.postMeterStatus}
                  onValueChange={value => setForm(prev => ({ ...prev, postMeterStatus: value as CustomerMeterStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_submitted">Not submitted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save customer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(customer => {
          const customerJobs = jobs.filter(j => j.customerId === customer.id);
          const totalValue = customerJobs.reduce((s, j) => s + j.projectPrice, 0);

          return (
            <div key={customer.id} className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customerJobs.length} job{customerJobs.length !== 1 ? 's' : ''} · ${totalValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{customer.address}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{customer.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{customer.email}</p>
                {(customer.systemType || customer.installDate || customer.contractSigned !== undefined || customer.depositPaid !== undefined) && (
                  <div className="pt-1 space-y-1">
                    {customer.systemType && <p className="capitalize">System: {customer.systemType}</p>}
                    {customer.contractSigned !== undefined && <p>Contract signed: {customer.contractSigned ? 'Yes' : 'No'}</p>}
                    {customer.depositPaid !== undefined && (
                      <p>Deposit paid: {customer.depositPaid ? `Yes ($${(customer.depositAmount || 0).toLocaleString()})` : 'No'}</p>
                    )}
                    {customer.installDate && <p>Install date: {customer.installDate}</p>}
                    {customer.preMeterStatus && <p className="capitalize">Pre-meter: {customer.preMeterStatus.replace('_', ' ')}</p>}
                    {customer.postMeterStatus && <p className="capitalize">Post-meter: {customer.postMeterStatus.replace('_', ' ')}</p>}
                  </div>
                )}
              </div>
              {customerJobs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  {customerJobs.map(j => (
                    <Link key={j.id} to={`/job/${j.id}`} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted transition-colors">
                      <span className="text-foreground">{j.systemType} {j.systemSizeKw}kW</span>
                      <span className="text-muted-foreground capitalize">{j.pipelineStage.replace(/_/g, ' ')}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersPage;
