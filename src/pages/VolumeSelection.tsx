import { useState } from 'react';
import { PolicyStepper } from '@/components/PolicyStepper';
import { SysplexSelector } from '@/components/SysplexSelector';
import { BackupScopeSummary } from '@/components/BackupScopeSummary';
import { PatternSelector } from '@/components/PatternSelector';
import { VolumeTable } from '@/components/VolumeTable';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useVolumeManager } from '@/hooks/useVolumeManager';
import { mockSysplexes } from '@/data/mockVolumes';
import { MatchType } from '@/types/volume';
import { toast } from 'sonner';

export default function VolumeSelection() {
  const [selectedSysplex, setSelectedSysplex] = useState(mockSysplexes[0].id);
  const [includedTableSelection, setIncludedTableSelection] = useState<Set<string>>(new Set());
  const [excludedTableSelection, setExcludedTableSelection] = useState<Set<string>>(new Set());

  const {
    includedVolumes,
    excludedVolumes,
    summary,
    activeFilter,
    getMatchingVolumes,
    includeVolumes,
    excludeVolumes,
    applyFilter,
    clearFilter,
  } = useVolumeManager();

  const handleSelectByPattern = (matchType: MatchType, pattern: string) => {
    const matching = getMatchingVolumes(matchType, pattern);
    
    // Select matching volumes in the included table
    const includedMatches = matching.filter(v => v.isIncluded).map(v => v.id);
    const excludedMatches = matching.filter(v => !v.isIncluded).map(v => v.id);
    
    if (includedMatches.length > 0) {
      setIncludedTableSelection(new Set(includedMatches));
    }
    if (excludedMatches.length > 0) {
      setExcludedTableSelection(new Set(excludedMatches));
    }
    
    const totalMatches = includedMatches.length + excludedMatches.length;
    if (totalMatches > 0) {
      toast.success(`Selected ${totalMatches} matching volumes`);
    } else {
      toast.info('No matching volumes found');
    }
  };

  const handleExcludeSelected = (volumeIds: string[]) => {
    excludeVolumes(volumeIds);
    setIncludedTableSelection(new Set());
    toast.success(`${volumeIds.length} volumes excluded from backup`);
  };

  const handleIncludeSelected = (volumeIds: string[]) => {
    includeVolumes(volumeIds);
    setExcludedTableSelection(new Set());
    toast.success(`${volumeIds.length} volumes included in backup`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Stepper */}
      <PolicyStepper />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-[1800px] mx-auto space-y-4">
          {/* Top Bar: Sysplex + Bulk Select + Summary in one row */}
          <div className="flex flex-col xl:flex-row gap-3 items-stretch">
            <SysplexSelector
              sysplexes={mockSysplexes}
              selectedId={selectedSysplex}
              onSelect={setSelectedSysplex}
            />
            <div className="flex-1">
              <PatternSelector
                onSelect={handleSelectByPattern}
                onFilter={applyFilter}
                onClearFilter={clearFilter}
                activeFilter={activeFilter}
              />
            </div>
          </div>

          {/* Compact Summary Bar */}
          <BackupScopeSummary summary={summary} compact />

          {/* Two-Pane Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-340px)] min-h-[500px]">
            <VolumeTable
              volumes={includedVolumes}
              variant="included"
              onMoveVolumes={handleExcludeSelected}
              title="Volumes Included in Backup"
              externalSelectedIds={includedTableSelection}
              onExternalSelectionChange={setIncludedTableSelection}
            />
            <VolumeTable
              volumes={excludedVolumes}
              variant="excluded"
              onMoveVolumes={handleIncludeSelected}
              title="Excluded from Backup"
              externalSelectedIds={excludedTableSelection}
              onExternalSelectionChange={setExcludedTableSelection}
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
    </div>
  );
}
