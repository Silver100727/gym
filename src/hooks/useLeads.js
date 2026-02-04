import { useState, useEffect, useCallback } from 'react';
import { getLeads, saveLead, updateLeadStatus, exportToCSV, deleteLead } from '@/lib/leadStorage';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLeads(getLeads());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLead = useCallback((leadData) => {
    const newLead = saveLead(leadData);
    refresh();
    return newLead;
  }, [refresh]);

  const updateStatus = useCallback((id, status, notes) => {
    const updated = updateLeadStatus(id, status, notes);
    refresh();
    return updated;
  }, [refresh]);

  const removeLead = useCallback((id) => {
    deleteLead(id);
    refresh();
  }, [refresh]);

  const downloadCSV = useCallback(() => {
    const csv = exportToCSV(leads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerfit-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [leads]);

  return {
    leads,
    loading,
    addLead,
    updateStatus,
    removeLead,
    downloadCSV,
    refresh
  };
}
