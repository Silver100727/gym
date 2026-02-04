import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GOALS } from '@/data/goals';
import { PROGRAMS } from '@/data/programs';
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/data/leadSchema';

export default function LeadFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value === 'all' ? '' : value });
  };

  const clearFilters = () => {
    onChange({ goal: '', program: '', status: '' });
  };

  const hasFilters = filters.goal || filters.program || filters.status;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Goal Filter */}
      <div className="w-48">
        <Select
          value={filters.goal || 'all'}
          onValueChange={(value) => handleChange('goal', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            {GOALS.map(goal => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Program Filter */}
      <div className="w-48">
        <Select
          value={filters.program || 'all'}
          onValueChange={(value) => handleChange('program', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {Object.values(PROGRAMS).map(program => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="w-48">
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-light hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
