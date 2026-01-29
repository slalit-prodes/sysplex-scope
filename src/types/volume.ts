export interface Volume {
  id: string;
  volumeId: string;
  size: number; // in GB
  storageGroup: string;
  source: 'default' | 'rule' | 'manual';
  ruleName?: string;
  isIncluded: boolean;
}

export interface Sysplex {
  id: string;
  name: string;
  totalVolumes: number;
  region: string;
}

export type MatchType = 'starts-with' | 'contains' | 'ends-with';

export interface PatternFilter {
  matchType: MatchType;
  pattern: string;
}

export interface BackupScopeSummary {
  totalVolumes: number;
  includedCount: number;
  excludedCount: number;
  estimatedSize: number; // in TB
}
