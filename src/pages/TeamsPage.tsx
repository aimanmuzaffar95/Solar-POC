import React, { useEffect, useMemo, useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { Users, Plus, Search, X } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const { users, teams, addTeam, addTeamMember, updateUserTeam } = useAppData();
  const [newTeamName, setNewTeamName] = useState('');
  const [searchByTeam, setSearchByTeam] = useState<Record<string, string>>({});
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTeam, setNewMemberTeam] = useState('');
  const [draftMembersByTeam, setDraftMembersByTeam] = useState<Record<string, string[]>>({});

  const installers = users.filter(user => user.role === 'installer');
  const unassignedInstallers = installers.filter(user => !user.team);

  useEffect(() => {
    const nextDrafts: Record<string, string[]> = {};
    teams.forEach(team => {
      nextDrafts[team] = installers.filter(user => user.team === team).map(user => user.id);
    });
    setDraftMembersByTeam(nextDrafts);
  }, [teams, installers]);

  const handleAddTeam = () => {
    const name = newTeamName.trim();
    if (!name) return;
    addTeam(name);
    if (!newMemberTeam) setNewMemberTeam(name);
    setNewTeamName('');
  };

  const addMemberToDraft = (team: string, userId: string) => {
    setDraftMembersByTeam(prev => {
      const current = prev[team] || [];
      if (current.includes(userId)) return prev;
      return { ...prev, [team]: [...current, userId] };
    });
  };

  const removeMemberFromDraft = (team: string, userId: string) => {
    setDraftMembersByTeam(prev => ({
      ...prev,
      [team]: (prev[team] || []).filter(id => id !== userId),
    }));
  };

  const saveTeamMembers = (team: string) => {
    const selectedIds = new Set(draftMembersByTeam[team] || []);
    installers.forEach(user => {
      const shouldBeOnTeam = selectedIds.has(user.id);
      const isOnTeam = user.team === team;
      if (shouldBeOnTeam && user.team !== team) updateUserTeam(user.id, team);
      if (!shouldBeOnTeam && isOnTeam) updateUserTeam(user.id, undefined);
    });
  };

  const installersById = useMemo(
    () => Object.fromEntries(installers.map(user => [user.id, user])),
    [installers]
  );

  const handleAddNewMember = () => {
    const name = newMemberName.trim();
    if (!name) return;
    addTeamMember(name, newMemberTeam || teams[0]);
    setNewMemberName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teams and installer assignments</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="New team name"
            className="h-10 w-44 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground"
            onKeyDown={e => e.key === 'Enter' && handleAddTeam()}
          />
          <button
            onClick={handleAddTeam}
            className="h-10 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Team
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {teams.map(team => {
          const members = (draftMembersByTeam[team] || [])
            .map(id => installersById[id])
            .filter(Boolean);
          const search = (searchByTeam[team] || '').trim().toLowerCase();
          const results = installers.filter(user => {
            if ((draftMembersByTeam[team] || []).includes(user.id)) return false;
            if (!search) return false;
            return user.name.toLowerCase().includes(search);
          });

          return (
            <div key={team} className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">{team}</h2>
                <span className="ml-auto text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {members.length} member{members.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2 min-h-8">
                {members.length > 0 ? (
                  members.map(member => (
                    <button
                      key={member.id}
                      onClick={() => removeMemberFromDraft(team, member.id)}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1 hover:bg-secondary/80 transition-colors"
                    >
                      {member.name}
                      <X className="w-3 h-3" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No members assigned</span>
                )}
              </div>

              <div className="border-t border-border pt-3 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Search And Add Members</p>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchByTeam[team] || ''}
                    onChange={e => setSearchByTeam(prev => ({ ...prev, [team]: e.target.value }))}
                    placeholder="Search installer..."
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {results.length > 0 && (
                  <div className="max-h-32 overflow-auto rounded-lg border border-border bg-background">
                    {results.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          addMemberToDraft(team, user.id);
                          setSearchByTeam(prev => ({ ...prev, [team]: '' }));
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {user.name}
                        {user.team && user.team !== team ? (
                          <span className="text-xs text-muted-foreground ml-1">({user.team})</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => saveTeamMembers(team)}
                  className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {unassignedInstallers.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">Unassigned Installers</h3>
          <div className="flex flex-wrap gap-2">
            {unassignedInstallers.map(user => (
              <span key={user.id} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {user.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 shadow-card space-y-2">
        <p className="text-sm font-semibold text-foreground">Add New Team Member</p>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={newMemberName}
            onChange={e => setNewMemberName(e.target.value)}
            placeholder="Member name"
            className="h-9 min-w-[220px] px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground"
            onKeyDown={e => e.key === 'Enter' && handleAddNewMember()}
          />
          <select
            value={newMemberTeam}
            onChange={e => setNewMemberTeam(e.target.value)}
            className="h-9 min-w-[140px] px-3 rounded-lg border border-input bg-background text-sm text-foreground"
          >
            <option value="">Select team</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <button
            onClick={handleAddNewMember}
            className="h-9 px-3 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
