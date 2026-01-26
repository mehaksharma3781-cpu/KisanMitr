import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, AlertTriangle, XCircle, IndianRupee, Shield, TrendingUp } from 'lucide-react';

interface CropCardProps {
  crop: {
    name: string;
    nameHi: string;
    emoji: string;
    status: 'recommended' | 'risky' | 'not_advised';
    subsidy: number;
    hasInsurance: boolean;
    hasMSP: boolean;
    season: string;
  };
}

const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  const { t, language } = useLanguage();

  const statusConfig = {
    recommended: {
      label: t('recommended'),
      icon: CheckCircle,
      className: 'status-ready',
      borderColor: 'border-l-success',
    },
    risky: {
      label: t('risky'),
      icon: AlertTriangle,
      className: 'status-warning',
      borderColor: 'border-l-warning',
    },
    not_advised: {
      label: t('not_advised'),
      icon: XCircle,
      className: 'status-danger',
      borderColor: 'border-l-destructive',
    },
  };

  const config = statusConfig[crop.status];
  const StatusIcon = config.icon;

  return (
    <div className={`farm-card border-l-4 ${config.borderColor} animate-fade-in`}>
      <div className="flex items-start gap-4">
        {/* Crop Icon */}
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl flex-shrink-0">
          {crop.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-foreground">
                {language === 'hi' ? crop.nameHi : crop.name}
              </h3>
              <p className="text-sm text-muted-foreground">{crop.season} Season</p>
            </div>
            <span className={config.className}>
              <StatusIcon className="w-4 h-4" />
              {config.label}
            </span>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-2 mt-3">
            {crop.subsidy > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs font-medium">
                <IndianRupee className="w-3 h-3" />
                ₹{crop.subsidy.toLocaleString()}
              </div>
            )}
            {crop.hasInsurance && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
                <Shield className="w-3 h-3" />
                {t('insurance_available')}
              </div>
            )}
            {crop.hasMSP && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/20 text-secondary-foreground text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                {t('msp_support')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCard;
