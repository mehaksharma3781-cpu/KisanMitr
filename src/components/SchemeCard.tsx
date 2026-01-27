import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, AlertTriangle, XCircle, Clock, ChevronRight, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SchemeCardProps {
  scheme: {
    name: string;
    description: string;
    status: 'ready' | 'missing_docs' | 'not_eligible';
    amount?: number | null;
    missingDocs?: string[] | null;
    deadline: string;
    official_url: string;
  };
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useLanguage();

  const statusConfig = {
    ready: {
      label: t('ready_apply'),
      icon: CheckCircle,
      className: 'status-ready',
      bgColor: 'bg-success/5',
    },
    missing_docs: {
      label: t('missing_docs'),
      icon: FileWarning,
      className: 'status-warning',
      bgColor: 'bg-warning/5',
    },
    not_eligible: {
      label: t('not_eligible'),
      icon: XCircle,
      className: 'status-danger',
      bgColor: 'bg-destructive/5',
    },
  };

  const config = statusConfig[scheme.status];
  const StatusIcon = config.icon;

  return (
    <div className={`farm-card ${config.bgColor} animate-fade-in`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{scheme.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
        </div>
        <span className={config.className}>
          <StatusIcon className="w-4 h-4" />
          {config.label}
        </span>
      </div>

      {/* Amount */}
      {scheme.amount && (
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary">
            ₹{scheme.amount.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm">/year</span>
        </div>
      )}

      {/* Missing Documents */}
      {scheme.missingDocs && scheme.missingDocs.length > 0 && (
        <div className="mb-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-xs font-medium text-warning mb-2">Missing Documents:</p>
          <div className="flex flex-wrap gap-2">
            {scheme.missingDocs.map((doc, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded bg-card text-foreground border border-border"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Deadline: {scheme.deadline}
        </div>
        <Button 
          size="sm" 
          variant={scheme.status === 'ready' ? 'default' : 'outline'}
          className="h-9"
          onClick={() => window.open(scheme.official_url, '_blank', 'noopener,noreferrer')}
        >
          {scheme.status === 'ready' ? t('apply_now') : t('view_details')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default SchemeCard;
