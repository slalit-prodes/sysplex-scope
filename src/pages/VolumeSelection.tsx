import { useState } from 'react';
import { PolicyStepper } from '@/components/PolicyStepper';
import { SysplexSelector } from '@/components/SysplexSelector';
import { BackupScopeSummary } from '@/components/BackupScopeSummary';
import { PatternSelector } from '@/components/PatternSelector';
import { VolumeTable } from '@/components/VolumeTable';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { useVolumeManager } from '@/hooks/useVolumeManager';
import { mockSysplexes } from '@/data/mockVolumes';
import { MatchType } from '@/types/volume';
import { toast } from 'sonner';

export default function VolumeSelection() {
  const [selectedSysplex, setSelectedSysplex] = useState(mockSysplexes[0].id);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'include' | 'exclude';
    matchType: MatchType;
    pattern: string;
    count: number;
  }>({
    open: false,
    action: 'include',
    matchType: 'starts-with',
    pattern: '',
    count: 0,
  });

  const {
    includedVolumes,
    excludedVolumes,
    summary,
    activeFilter,
    previewMatches,
    getMatchingVolumes,
    includeByPattern,
    excludeByPattern,
    includeVolumes,
    excludeVolumes,
    applyFilter,
    clearFilter,
  } = useVolumeManager();

  const handleIncludePattern = (matchType: MatchType, pattern: string) => {
    const matching = getMatchingVolumes(matchType, pattern);
    const toInclude = matching.filter((v) => !v.isIncluded);

    if (toInclude.length > 100) {
      setConfirmDialog({
        open: true,
        action: 'include',
        matchType,
        pattern,
        count: toInclude.length,
      });
    } else if (toInclude.length > 0) {
      includeByPattern(matchType, pattern);
      toast.success(`${toInclude.length} volumes included in backup`);
    } else {
      toast.info('No matching volumes to include');
    }
  };

  const handleExcludePattern = (matchType: MatchType, pattern: string) => {
    const matching = getMatchingVolumes(matchType, pattern);
    const toExclude = matching.filter((v) => v.isIncluded);

    if (toExclude.length > 100) {
      setConfirmDialog({
        open: true,
        action: 'exclude',
        matchType,
        pattern,
        count: toExclude.length,
      });
    } else if (toExclude.length > 0) {
      excludeByPattern(matchType, pattern);
      toast.success(`${toExclude.length} volumes excluded from backup`);
    } else {
      toast.info('No matching volumes to exclude');
    }
  };

  const handleConfirmBulkAction = () => {
    if (confirmDialog.action === 'include') {
      includeByPattern(confirmDialog.matchType, confirmDialog.pattern);
      toast.success(`${confirmDialog.count} volumes included in backup`);
    } else {
      excludeByPattern(confirmDialog.matchType, confirmDialog.pattern);
      toast.success(`${confirmDialog.count} volumes excluded from backup`);
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const handleExcludeSelected = (volumeIds: string[]) => {
    excludeVolumes(volumeIds);
    toast.success(`${volumeIds.length} volumes excluded from backup`);
  };

  const handleIncludeSelected = (volumeIds: string[]) => {
    includeVolumes(volumeIds);
    toast.success(`${volumeIds.length} volumes included in backup`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Stepper */}
      <PolicyStepper />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Top Bar: Sysplex Selector + Summary */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-stretch">
            <div className="flex-1 space-y-4">
              <SysplexSelector
                sysplexes={mockSysplexes}
                selectedId={selectedSysplex}
                onSelect={setSelectedSysplex}
              />
              <PatternSelector
                onPreview={previewMatches}
                onInclude={handleIncludePattern}
                onExclude={handleExcludePattern}
                onFilter={applyFilter}
                onClearFilter={clearFilter}
                activeFilter={activeFilter}
              />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <BackupScopeSummary summary={summary} />
            </div>
          </div>

          {/* Two-Pane Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-420px)] min-h-[500px]">
            <VolumeTable
              volumes={includedVolumes}
              variant="included"
              onMoveVolumes={handleExcludeSelected}
              title="Volumes Included in Backup"
            />
            <VolumeTable
              volumes={excludedVolumes}
              variant="excluded"
              onMoveVolumes={handleIncludeSelected}
              title="Excluded from Backup"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        onBack={() => toast.info('Going back...')}
        onSaveDraft={() => toast.success('Draft saved')}
        onNext={() => toast.info('Proceeding to Flash Copy configuration...')}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={`Confirm Bulk ${confirmDialog.action === 'include' ? 'Include' : 'Exclude'}`}
        description={`You are about to ${confirmDialog.action} all volumes matching "${confirmDialog.pattern}" (${confirmDialog.matchType.replace('-', ' ')}).`}
        count={confirmDialog.count}
        action={confirmDialog.action}
        onConfirm={handleConfirmBulkAction}
      />
    </div>
  );
}
