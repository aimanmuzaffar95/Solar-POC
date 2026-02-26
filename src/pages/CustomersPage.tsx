import React, { useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Search, User, MapPin, Phone, Mail } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const { customers, jobs } = useAppData();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Customers</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

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
