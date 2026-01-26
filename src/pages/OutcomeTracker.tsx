import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, Plus, CheckCircle, Clock, XCircle,
  IndianRupee, Sprout, FileText, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';

interface Outcome {
  id: string;
  type: 'scheme' | 'crop';
  name: string;
  status: 'success' | 'pending' | 'failed';
  amount?: number;
  date: string;
  notes?: string;
}

const OutcomeTracker: React.FC = () => {
  const { t, language } = useLanguage();

  const [outcomes] = useState<Outcome[]>([
    {
      id: '1',
      type: 'scheme',
      name: 'PM-KISAN',
      status: 'success',
      amount: 6000,
      date: 'Dec 2023',
      notes: 'Received in bank account',
    },
    {
      id: '2',
      type: 'crop',
      name: 'Wheat (Rabi 2023)',
      status: 'success',
      amount: 45000,
      date: 'Apr 2023',
      notes: 'Good yield, sold at MSP',
    },
    {
      id: '3',
      type: 'scheme',
      name: 'PMFBY Claim',
      status: 'pending',
      amount: 15000,
      date: 'Jan 2024',
      notes: 'Under review',
    },
    {
      id: '4',
      type: 'crop',
      name: 'Cotton (Kharif 2023)',
      status: 'failed',
      date: 'Nov 2023',
      notes: 'Damaged by unseasonal rain',
    },
    {
      id: '5',
      type: 'scheme',
      name: 'PM-KUSUM Solar Pump',
      status: 'success',
      amount: 50000,
      date: 'Sep 2023',
      notes: 'Subsidy approved',
    },
  ]);

  const getStatusIcon = (status: 'success' | 'pending' | 'failed') => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'failed': return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusStyle = (status: 'success' | 'pending' | 'failed') => {
    switch (status) {
      case 'success': return 'bg-success/10 border-success/30';
      case 'pending': return 'bg-warning/10 border-warning/30';
      case 'failed': return 'bg-destructive/10 border-destructive/30';
    }
  };

  const stats = {
    totalBenefits: outcomes
      .filter(o => o.status === 'success' && o.amount)
      .reduce((sum, o) => sum + (o.amount || 0), 0),
    pendingBenefits: outcomes
      .filter(o => o.status === 'pending' && o.amount)
      .reduce((sum, o) => sum + (o.amount || 0), 0),
    successCount: outcomes.filter(o => o.status === 'success').length,
    pendingCount: outcomes.filter(o => o.status === 'pending').length,
  };

  return (
    <AppLayout 
      title={t('track_progress')}
      subtitle="Track your farming outcomes"
    >
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="farm-card-elevated bg-gradient-to-br from-success/10 to-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'hi' ? 'कुल लाभ' : 'Total Benefits'}
                </p>
                <p className="text-xl font-bold text-success">
                  ₹{stats.totalBenefits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="farm-card-elevated bg-gradient-to-br from-warning/10 to-secondary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {language === 'hi' ? 'लंबित' : 'Pending'}
                </p>
                <p className="text-xl font-bold text-warning">
                  ₹{stats.pendingBenefits.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="farm-card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">{stats.successCount} Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <span className="font-medium">{stats.pendingCount} Pending</span>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        <Button className="w-full mb-6" variant="outline">
          <Plus className="w-5 h-5 mr-2" />
          {language === 'hi' ? 'नया परिणाम जोड़ें' : 'Add New Outcome'}
        </Button>

        {/* Outcomes List */}
        <div className="space-y-3">
          {outcomes.map((outcome) => (
            <div 
              key={outcome.id} 
              className={`farm-card border-2 ${getStatusStyle(outcome.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    outcome.type === 'scheme' ? 'bg-secondary/20' : 'bg-primary/20'
                  }`}>
                    {outcome.type === 'scheme' 
                      ? <FileText className="w-5 h-5 text-secondary" />
                      : <Sprout className="w-5 h-5 text-primary" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{outcome.name}</h3>
                      {getStatusIcon(outcome.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{outcome.date}</span>
                    </div>
                    {outcome.notes && (
                      <p className="text-sm text-muted-foreground">{outcome.notes}</p>
                    )}
                  </div>
                </div>
                {outcome.amount && (
                  <div className="text-right">
                    <p className={`font-bold ${
                      outcome.status === 'success' ? 'text-success' : 
                      outcome.status === 'pending' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {outcome.status === 'failed' ? '-' : '+'}₹{outcome.amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default OutcomeTracker;
