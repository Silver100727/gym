import { motion } from 'framer-motion';
import { Phone, Mail, Calendar, MoreVertical } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import LeadStatusBadge from './LeadStatusBadge';
import { GOALS, getGoalById } from '@/data/goals';
import { getProgramById } from '@/data/programs';
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/data/leadSchema';
import { fadeUp, staggerContainer } from '@/animations/variants';

export default function LeadsTable({ leads, onStatusChange }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-white mb-2">
            No Leads Yet
          </h3>
          <p className="text-gray-light max-w-md mx-auto">
            When visitors complete the journey funnel, their information will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-lighter">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => {
                const goal = getGoalById(lead.selectedGoal);
                const program = getProgramById(lead.selectedProgram);

                return (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{lead.fullName}</p>
                        {lead.age && (
                          <p className="text-xs text-white/40">Age: {lead.age}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-white flex items-center gap-2">
                          <Phone className="w-3 h-3 text-primary/70" />
                          {lead.phone}
                        </p>
                        {lead.email && (
                          <p className="text-xs text-white/50 flex items-center gap-2">
                            <Mail className="w-3 h-3 text-primary/70" />
                            {lead.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white/80">
                        {goal?.title || lead.selectedGoal}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white/80">
                        {program?.name || lead.selectedProgram}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => onStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <LeadStatusBadge status={lead.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-white/50">
                        {formatDate(lead.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <motion.div
        className="lg:hidden space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {leads.map((lead) => {
          const goal = getGoalById(lead.selectedGoal);
          const program = getProgramById(lead.selectedProgram);

          return (
            <motion.div key={lead.id} variants={fadeUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{lead.fullName}</h4>
                      <p className="text-xs text-white/40">
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary/70" />
                      {lead.phone}
                    </p>
                    {lead.email && (
                      <p className="text-sm text-white/60 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary/70" />
                        {lead.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="px-2 py-1 rounded bg-white/5 text-white/70">
                      {goal?.title || lead.selectedGoal}
                    </span>
                    <span className="px-2 py-1 rounded bg-white/5 text-white/70">
                      {program?.name || lead.selectedProgram}
                    </span>
                  </div>

                  <Select
                    value={lead.status}
                    onValueChange={(value) => onStatusChange(lead.id, value)}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
