import { BackupScopeSummary as SummaryType } from '@/types/volume';
import { HardDrive, CheckCircle2, XCircle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackupScopeSummaryProps {
  summary: SummaryType;
  compact?: boolean;
}

export function BackupScopeSummary({ summary, compact = false }: BackupScopeSummaryProps) {
  const inclusionPercentage = (summary.includedCount / summary.totalVolumes) * 100;

  if (compact) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Backup Scope</span>
          </div>
          
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-sm font-semibold">{summary.totalVolumes.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-included" />
            <span className="text-sm text-muted-foreground">Included:</span>
            <span className="text-sm font-semibold text-included">{summary.includedCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-excluded" />
            <span className="text-sm text-muted-foreground">Excluded:</span>
            <span className="text-sm font-semibold text-excluded">{summary.excludedCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Size:</span>
            <span className="text-sm font-semibold">{summary.estimatedSize.toFixed(1)} TB</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">{inclusionPercentage.toFixed(0)}%</span>
            <div className="w-24 h-2 overflow-hidden rounded-full bg-excluded-light">
              <div
                className="h-full bg-included transition-all duration-500 ease-out"
                style={{ width: `${inclusionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Database className="w-4 h-4 text-accent" />
        Backup Scope Summary
      </h3>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Inclusion Rate</span>
            <span className="font-semibold text-foreground">
              {inclusionPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-excluded-light">
            <div
              className="h-full bg-included transition-all duration-500 ease-out"
              style={{ width: `${inclusionPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={HardDrive}
            label="Total Volumes"
            value={summary.totalVolumes.toLocaleString()}
            variant="neutral"
          />
          <StatCard
            icon={Database}
            label="Est. Backup Size"
            value={`${summary.estimatedSize.toFixed(1)} TB`}
            variant="neutral"
          />
          <StatCard
            icon={CheckCircle2}
            label="Included"
            value={summary.includedCount.toLocaleString()}
            variant="included"
          />
          <StatCard
            icon={XCircle}
            label="Excluded"
            value={summary.excludedCount.toLocaleString()}
            variant="excluded"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  variant: 'neutral' | 'included' | 'excluded';
}

function StatCard({ icon: Icon, label, value, variant }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-md p-3 transition-colors',
        variant === 'neutral' && 'bg-muted/50',
        variant === 'included' && 'bg-included-light',
        variant === 'excluded' && 'bg-excluded-light'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon
          className={cn(
            'w-3.5 h-3.5',
            variant === 'neutral' && 'text-muted-foreground',
            variant === 'included' && 'text-included',
            variant === 'excluded' && 'text-excluded'
          )}
        />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p
        className={cn(
          'text-lg font-bold animate-count-up',
          variant === 'neutral' && 'text-foreground',
          variant === 'included' && 'text-included',
          variant === 'excluded' && 'text-excluded'
        )}
      >
        {value}
      </p>
    </div>
  );
}
