import { Badge } from '@/components/ui/badge';
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/data/leadSchema';
import { cn } from '@/lib/utils';

const statusStyles = {
  [LEAD_STATUSES.NEW]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [LEAD_STATUSES.CONTACTED]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [LEAD_STATUSES.INTERESTED]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  [LEAD_STATUSES.ENROLLED]: 'bg-green-500/20 text-green-400 border-green-500/30',
  [LEAD_STATUSES.NOT_RESPONDING]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  [LEAD_STATUSES.CLOSED]: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export default function LeadStatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        statusStyles[status] || statusStyles[LEAD_STATUSES.NEW]
      )}
    >
      {LEAD_STATUS_LABELS[status] || status}
    </Badge>
  );
}
