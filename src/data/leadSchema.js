export const LEAD_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  INTERESTED: 'interested',
  ENROLLED: 'enrolled',
  NOT_RESPONDING: 'not_responding',
  CLOSED: 'closed'
};

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUSES.NEW]: 'New',
  [LEAD_STATUSES.CONTACTED]: 'Contacted',
  [LEAD_STATUSES.INTERESTED]: 'Interested',
  [LEAD_STATUSES.ENROLLED]: 'Enrolled',
  [LEAD_STATUSES.NOT_RESPONDING]: 'Not Responding',
  [LEAD_STATUSES.CLOSED]: 'Closed'
};

export const CONTACT_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 9pm)' },
  { value: 'anytime', label: 'Anytime' }
];

export const TRAINING_TYPE_OPTIONS = [
  { value: 'group', label: 'Group Classes' },
  { value: 'personal', label: 'Personal Training' },
  { value: 'hybrid', label: 'Hybrid (Both)' },
  { value: 'unsure', label: 'Not Sure Yet' }
];
