import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, RefreshCw, TrendingUp } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LeadFilters from '@/components/admin/LeadFilters';
import LeadsTable from '@/components/admin/LeadsTable';
import { useLeads } from '@/hooks/useLeads';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { LEAD_STATUSES } from '@/data/leadSchema';
import { fadeUp, staggerContainer } from '@/animations/variants';

export default function AdminPanel() {
  useSmoothScroll({ duration: 1.4 });
  const { leads, loading, updateStatus, downloadCSV, refresh } = useLeads();
  const [filters, setFilters] = useState({
    goal: '',
    program: '',
    status: ''
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (filters.goal && lead.selectedGoal !== filters.goal) return false;
      if (filters.program && lead.selectedProgram !== filters.program) return false;
      if (filters.status && lead.status !== filters.status) return false;
      return true;
    });
  }, [leads, filters]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === LEAD_STATUSES.NEW).length;
    const enrolled = leads.filter(l => l.status === LEAD_STATUSES.ENROLLED).length;
    const conversionRate = total > 0 ? ((enrolled / total) * 100).toFixed(1) : 0;

    return { total, newLeads, enrolled, conversionRate };
  }, [leads]);

  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-32 pb-8 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
                Lead Management
              </h1>
              <p className="text-gray-light mt-1">
                Track and manage your gym leads
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                className="text-gray-light hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={downloadCSV} disabled={leads.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-white">
                        {stats.total}
                      </p>
                      <p className="text-xs text-white/50">Total Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-white">
                        {stats.newLeads}
                      </p>
                      <p className="text-xs text-white/50">New Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-white">
                        {stats.enrolled}
                      </p>
                      <p className="text-xs text-white/50">Enrolled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-white">
                        {stats.conversionRate}%
                      </p>
                      <p className="text-xs text-white/50">Conversion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Leads Table */}
      <section className="py-8 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LeadFilters filters={filters} onChange={setFilters} />

            {filteredLeads.length !== leads.length && (
              <p className="text-sm text-white/50 mb-4">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            )}

            <LeadsTable leads={filteredLeads} onStatusChange={updateStatus} />
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
