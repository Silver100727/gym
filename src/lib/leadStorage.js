const STORAGE_KEY = 'powerfit_leads';

export const getLeads = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to parse leads from localStorage');
    return [];
  }
};

export const saveLead = (lead) => {
  const leads = getLeads();
  const newLead = {
    ...lead,
    id: crypto.randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: ''
  };
  leads.push(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return newLead;
};

export const updateLeadStatus = (id, status, notes = '') => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = {
      ...leads[index],
      status,
      notes: notes || leads[index].notes,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return leads[index];
  }
  return null;
};

export const deleteLead = (id) => {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const exportToCSV = (leads) => {
  const headers = [
    'ID',
    'Name',
    'Phone',
    'Email',
    'Age',
    'Goal',
    'Program',
    'Training Type',
    'Contact Time',
    'Status',
    'Created',
    'Notes'
  ];

  const rows = leads.map(l => [
    l.id,
    l.fullName,
    l.phone,
    l.email || '',
    l.age || '',
    l.selectedGoal,
    l.selectedProgram,
    l.preferredTrainingType || '',
    l.preferredContactTime || '',
    l.status,
    l.createdAt,
    l.notes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
};
