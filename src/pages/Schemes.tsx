import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Filter, CheckCircle, AlertTriangle, XCircle, IndianRupee, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import SchemeCard from '@/components/SchemeCard';
import { playClickSound } from '@/hooks/useClickSound';
import { supabase } from '@/integrations/supabase/client';

interface Scheme {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'missing_docs' | 'not_eligible';
  amount: number | null;
  missing_docs: string[] | null;
  deadline: string;
  official_url: string;
}

const Schemes: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'missing_docs' | 'not_eligible'>('all');
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const { data, error } = await supabase
          .from('government_schemes')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Cast status to the correct union type
        const typedData = (data || []).map(scheme => ({
          ...scheme,
          status: scheme.status as 'ready' | 'missing_docs' | 'not_eligible'
        }));
        setAllSchemes(typedData);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filters = [
    { id: 'all', label: 'All Schemes', icon: Filter },
    { id: 'ready', label: t('ready_apply'), icon: CheckCircle },
    { id: 'missing_docs', label: t('missing_docs'), icon: AlertTriangle },
    { id: 'not_eligible', label: t('not_eligible'), icon: XCircle },
  ];

  const filteredSchemes = activeFilter === 'all' 
    ? allSchemes 
    : allSchemes.filter(scheme => scheme.status === activeFilter);

  // Transform scheme data for SchemeCard component
  const transformScheme = (scheme: Scheme) => ({
    name: scheme.name,
    description: scheme.description,
    status: scheme.status,
    amount: scheme.amount,
    missingDocs: scheme.missing_docs,
    deadline: scheme.deadline,
    official_url: scheme.official_url,
  });

  const getCounts = () => ({
    all: allSchemes.length,
    ready: allSchemes.filter(s => s.status === 'ready').length,
    missing_docs: allSchemes.filter(s => s.status === 'missing_docs').length,
    not_eligible: allSchemes.filter(s => s.status === 'not_eligible').length,
  });

  const counts = getCounts();
  const totalBenefits = allSchemes
    .filter(s => s.status === 'ready' && s.amount)
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <AppLayout 
      title={t('schemes')}
      subtitle="Government schemes for farmers"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Summary Card */}
        <div className="farm-card-elevated mb-6 bg-gradient-to-br from-secondary/10 to-warning/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <FileText className="w-7 h-7 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Scheme Eligibility
              </h2>
              <p className="text-muted-foreground text-sm">
                Check your eligibility for government schemes
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-success/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-success">{counts.ready}</p>
              <p className="text-xs text-muted-foreground">Ready</p>
            </div>
            <div className="bg-warning/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-warning">{counts.missing_docs}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{counts.not_eligible}</p>
              <p className="text-xs text-muted-foreground">Not Eligible</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="w-4 h-4 text-primary" />
                <p className="text-xl font-bold text-primary">{(totalBenefits / 1000).toFixed(0)}K</p>
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => {
                playClickSound();
                setActiveFilter(filter.id as any);
              }}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label} ({counts[filter.id as keyof typeof counts]})
            </Button>
          ))}
        </div>

        {/* Scheme List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={transformScheme(scheme)} />
            ))}
          </div>
        )}

        {!loading && filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No schemes found for this filter</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Schemes;
