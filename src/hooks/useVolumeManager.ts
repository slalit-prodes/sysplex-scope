import { useState, useMemo, useCallback } from 'react';
import { Volume, MatchType, PatternFilter, BackupScopeSummary } from '@/types/volume';
import { mockVolumes } from '@/data/mockVolumes';

function matchesPattern(volumeId: string, matchType: MatchType, pattern: string): boolean {
  const upperVolumeId = volumeId.toUpperCase();
  const upperPattern = pattern.toUpperCase();

  switch (matchType) {
    case 'starts-with':
      return upperVolumeId.startsWith(upperPattern);
    case 'contains':
      return upperVolumeId.includes(upperPattern);
    case 'ends-with':
      return upperVolumeId.endsWith(upperPattern);
    default:
      return false;
  }
}

export function useVolumeManager() {
  const [volumes, setVolumes] = useState<Volume[]>(mockVolumes);
  const [activeFilter, setActiveFilter] = useState<PatternFilter | null>(null);

  const includedVolumes = useMemo(() => {
    let result = volumes.filter((v) => v.isIncluded);
    if (activeFilter) {
      result = result.filter((v) =>
        matchesPattern(v.volumeId, activeFilter.matchType, activeFilter.pattern)
      );
    }
    return result;
  }, [volumes, activeFilter]);

  const excludedVolumes = useMemo(() => {
    let result = volumes.filter((v) => !v.isIncluded);
    if (activeFilter) {
      result = result.filter((v) =>
        matchesPattern(v.volumeId, activeFilter.matchType, activeFilter.pattern)
      );
    }
    return result;
  }, [volumes, activeFilter]);

  const summary: BackupScopeSummary = useMemo(() => {
    const included = volumes.filter((v) => v.isIncluded);
    const excluded = volumes.filter((v) => !v.isIncluded);
    const totalSizeGB = included.reduce((sum, v) => sum + v.size, 0);

    return {
      totalVolumes: volumes.length,
      includedCount: included.length,
      excludedCount: excluded.length,
      estimatedSize: totalSizeGB / 1024, // Convert GB to TB
    };
  }, [volumes]);

  const previewMatches = useCallback(
    (matchType: MatchType, pattern: string): number => {
      return volumes.filter((v) => matchesPattern(v.volumeId, matchType, pattern)).length;
    },
    [volumes]
  );

  const getMatchingVolumes = useCallback(
    (matchType: MatchType, pattern: string): Volume[] => {
      return volumes.filter((v) => matchesPattern(v.volumeId, matchType, pattern));
    },
    [volumes]
  );

  const includeByPattern = useCallback((matchType: MatchType, pattern: string) => {
    setVolumes((prev) =>
      prev.map((v) => {
        if (matchesPattern(v.volumeId, matchType, pattern) && !v.isIncluded) {
          return { ...v, isIncluded: true, source: 'rule' as const, ruleName: `Include: ${matchType} "${pattern}"` };
        }
        return v;
      })
    );
  }, []);

  const excludeByPattern = useCallback((matchType: MatchType, pattern: string) => {
    setVolumes((prev) =>
      prev.map((v) => {
        if (matchesPattern(v.volumeId, matchType, pattern) && v.isIncluded) {
          return { ...v, isIncluded: false, source: 'rule' as const, ruleName: `Exclude: ${matchType} "${pattern}"` };
        }
        return v;
      })
    );
  }, []);

  const includeVolumes = useCallback((volumeIds: string[]) => {
    const idSet = new Set(volumeIds);
    setVolumes((prev) =>
      prev.map((v) => {
        if (idSet.has(v.id) && !v.isIncluded) {
          return { ...v, isIncluded: true, source: 'manual' as const, ruleName: undefined };
        }
        return v;
      })
    );
  }, []);

  const excludeVolumes = useCallback((volumeIds: string[]) => {
    const idSet = new Set(volumeIds);
    setVolumes((prev) =>
      prev.map((v) => {
        if (idSet.has(v.id) && v.isIncluded) {
          return { ...v, isIncluded: false, source: 'manual' as const, ruleName: undefined };
        }
        return v;
      })
    );
  }, []);

  const applyFilter = useCallback((matchType: MatchType, pattern: string) => {
    setActiveFilter({ matchType, pattern });
  }, []);

  const clearFilter = useCallback(() => {
    setActiveFilter(null);
  }, []);

  return {
    volumes,
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
  };
}
