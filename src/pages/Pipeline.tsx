import React, { useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { PIPELINE_STAGES, type PipelineStage } from '@/data/models';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lock, Unlock, Zap, Battery, Sun as SunIcon } from 'lucide-react';

const Pipeline: React.FC = () => {
  const { jobs, customers, moveJobStage, overridePreMeter, setOverridePreMeter } = useAppData();
  const { user, isAdmin } = useAuth();
  const [dragError, setDragError] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    setDragError(null);
    if (!result.destination) return;
    const jobId = result.draggableId;
    const newStage = result.destination.droppableId as PipelineStage;
    if (!user) return;
    const success = moveJobStage(jobId, newStage, user.name);
    if (!success) {
      setDragError('Cannot move to Installed — pre-meter not approved. Enable override to proceed.');
    }
  };

  const getSystemIcon = (type: string) => {
    if (type === 'solar') return <SunIcon className="w-3 h-3 text-solar-amber" />;
    if (type === 'battery') return <Battery className="w-3 h-3 text-solar-teal" />;
    return <Zap className="w-3 h-3 text-solar-amber-light" />;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
        {isAdmin && (
          <button
            onClick={() => setOverridePreMeter(!overridePreMeter)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
              overridePreMeter
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-secondary border-border text-secondary-foreground"
            )}
          >
            {overridePreMeter ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {overridePreMeter ? 'Override ON' : 'Pre-meter Lock'}
          </button>
        )}
      </div>

      {dragError && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4" />
          {dragError}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
          {PIPELINE_STAGES.map(stage => {
            const stageJobs = jobs.filter(j => j.pipelineStage === stage.key);
            return (
              <Droppable key={stage.key} droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-shrink-0 w-56 rounded-xl border border-border bg-muted/30 flex flex-col",
                      snapshot.isDraggingOver && "border-primary/40 bg-primary/5"
                    )}
                  >
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-foreground">{stage.label}</h3>
                        <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">
                          {stageJobs.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                      {stageJobs.map((job, index) => {
                        const customer = customers.find(c => c.id === job.customerId);
                        return (
                          <Draggable key={job.id} draggableId={job.id} index={index} isDragDisabled={!isAdmin}>
                            {(prov, snap) => (
                              <Link
                                to={`/job/${job.id}`}
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={cn(
                                  "block p-3 rounded-lg bg-card border border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer",
                                  snap.isDragging && "shadow-lg ring-2 ring-primary/30"
                                )}
                              >
                                <p className="text-xs font-semibold text-foreground truncate">{customer?.name}</p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  {getSystemIcon(job.systemType)}
                                  <span className="text-[10px] text-muted-foreground">{job.systemSizeKw}kW</span>
                                  <span className="text-[10px] text-muted-foreground ml-auto">{job.assignedTeam}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 font-mono">${job.projectPrice.toLocaleString()}</p>
                              </Link>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Pipeline;
