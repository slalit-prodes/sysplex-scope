import { Volume, Sysplex } from '@/types/volume';

const storageGroups = ['PROD-DB2', 'PROD-CICS', 'TEST-ENV', 'DEV-BATCH', 'ARCHIVE', 'BACKUP-STG', 'VSAM-DATA', 'IMS-DB'];
const prefixes = ['PROD', 'TEST', 'DEV', 'STG', 'BAK', 'ARC', 'DB2', 'IMS', 'CICS', 'VSAM'];

function generateVolumeId(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${prefix}${suffix}`;
}

function generateVolumes(count: number): Volume[] {
  const volumes: Volume[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    let volumeId = generateVolumeId();
    while (usedIds.has(volumeId)) {
      volumeId = generateVolumeId();
    }
    usedIds.add(volumeId);

    const isTestOrDev = volumeId.startsWith('TEST') || volumeId.startsWith('DEV');
    
    volumes.push({
      id: `vol-${i}`,
      volumeId,
      size: Math.floor(Math.random() * 500) + 50, // 50-550 GB
      storageGroup: storageGroups[Math.floor(Math.random() * storageGroups.length)],
      source: isTestOrDev ? 'rule' : 'default',
      ruleName: isTestOrDev ? `Exclude ${volumeId.substring(0, 4)}*` : undefined,
      isIncluded: !isTestOrDev, // TEST and DEV volumes start excluded
    });
  }

  return volumes.sort((a, b) => a.volumeId.localeCompare(b.volumeId));
}

export const mockVolumes: Volume[] = generateVolumes(3248);

export const mockSysplexes: Sysplex[] = [
  { id: 'sysplex-1', name: 'PROD-SYSPLEX-01', totalVolumes: 3248, region: 'US-EAST' },
  { id: 'sysplex-2', name: 'PROD-SYSPLEX-02', totalVolumes: 2891, region: 'US-WEST' },
  { id: 'sysplex-3', name: 'DR-SYSPLEX-01', totalVolumes: 1567, region: 'EU-CENTRAL' },
  { id: 'sysplex-4', name: 'TEST-SYSPLEX-01', totalVolumes: 892, region: 'US-EAST' },
];
