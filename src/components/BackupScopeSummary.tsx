import { BackupScopeSummary as SummaryType } from '@/types/volume';
import { Progress } from '@/components/ui/progress';
import { HardDrive, CheckCircle2, XCircle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackupScopeSummaryProps {
  summary: SummaryType;
}

export function BackupScopeSummary({ summary }: BackupScopeSummaryProps) {
  const inclusionPercentage = (summary.includedCount / summary.totalVolumes) * 100;

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
