export const STORAGE_TYPES = [
  { value: 'Freezer', label: 'Freezer' },
  { value: 'Chiller', label: 'Chiller' },
  { value: 'Dry Cold Room', label: 'Dry Cold Room' }
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const AMENITIES_OPTIONS = [
  '24/7 Access',
  'Security System',
  'Backup Power',
  'Temperature Monitoring',
  'Loading Dock',
  'Forklift Available',
  'Climate Controlled',
  'Pest Control'
];

export const USER_ROLES = {
  HOST: 'host',
  RENTER: 'renter'
};
