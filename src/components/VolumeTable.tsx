import { useState, useMemo } from 'react';
import { Volume } from '@/types/volume';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowRight,
  ArrowLeft,
  Search,
  ArrowUpDown,
  HardDrive,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumeTableProps {
  volumes: Volume[];
  variant: 'included' | 'excluded';
  onMoveVolumes: (volumeIds: string[]) => void;
  title: string;
  externalSelectedIds?: Set<string>;
  onExternalSelectionChange?: (ids: Set<string>) => void;
}

type SortField = 'volumeId' | 'size' | 'storageGroup';
type SortDirection = 'asc' | 'desc';

export function VolumeTable({ 
  volumes, 
  variant, 
  onMoveVolumes, 
  title,
  externalSelectedIds,
  onExternalSelectionChange,
}: VolumeTableProps) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  
  // Use external selection if provided, otherwise use internal
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const setSelectedIds = onExternalSelectionChange ?? setInternalSelectedIds;
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('volumeId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSortedVolumes = useMemo(() => {
    let result = volumes;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.volumeId.toLowerCase().includes(searchLower) ||
          v.storageGroup.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'volumeId':
          comparison = a.volumeId.localeCompare(b.volumeId);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'storageGroup':
          comparison = a.storageGroup.localeCompare(b.storageGroup);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [volumes, search, sortField, sortDirection]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAndSortedVolumes.map((v) => v.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleMove = () => {
    onMoveVolumes(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allSelected =
    filteredAndSortedVolumes.length > 0 &&
    filteredAndSortedVolumes.every((v) => selectedIds.has(v.id));

  const someSelected = selectedIds.size > 0;

  const Icon = variant === 'included' ? CheckCircle2 : XCircle;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          'px-4 py-3 border-b',
          variant === 'included' ? 'border-included/20 bg-included-light' : 'border-excluded/20 bg-excluded-light'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon
              className={cn(
                'w-5 h-5',
                variant === 'included' ? 'text-included' : 'text-excluded'
              )}
            />
            <h3 className="font-semibold text-foreground">{title}</h3>
            <Badge variant="secondary" className="ml-2">
              {volumes.length.toLocaleString()}
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={handleMove}
            disabled={!someSelected}
            className={cn(
              variant === 'included'
                ? 'bg-excluded hover:bg-excluded/90 text-excluded-foreground'
                : 'bg-included hover:bg-included/90 text-included-foreground'
            )}
          >
            {variant === 'included' ? (
              <>
                Exclude Selected
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Include Selected
              </>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search volumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="data-table-header px-4 py-2 grid grid-cols-[40px_1fr_80px_140px_100px] gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div>
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
        </div>
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors text-left"
          onClick={() => toggleSort('volumeId')}
        >
          Volume ID
          <ArrowUpDown className="w-3 h-3" />
        </button>
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => toggleSort('size')}
        >
          Size
          <ArrowUpDown className="w-3 h-3" />
        </button>
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => toggleSort('storageGroup')}
        >
          Storage Group
          <ArrowUpDown className="w-3 h-3" />
        </button>
        <div>Source</div>
      </div>

      {/* Table Body */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-table-border">
          {filteredAndSortedVolumes.map((volume) => (
            <div
              key={volume.id}
              className={cn(
                'data-table-row px-4 py-2.5 grid grid-cols-[40px_1fr_80px_140px_100px] gap-2 items-center text-sm',
                selectedIds.has(volume.id) && 'bg-accent/5'
              )}
              onClick={() => handleSelectOne(volume.id, !selectedIds.has(volume.id))}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(volume.id)}
                  onCheckedChange={(checked) => handleSelectOne(volume.id, !!checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-medium">{volume.volumeId}</span>
              </div>
              <span className="text-muted-foreground">{volume.size} GB</span>
              <Badge variant="outline" className="w-fit text-xs">
                {volume.storageGroup}
              </Badge>
              <SourceTag source={volume.source} ruleName={volume.ruleName} />
            </div>
          ))}

          {filteredAndSortedVolumes.length === 0 && (
            <div className="px-4 py-12 text-center text-muted-foreground">
              <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No volumes found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selection Footer */}
      {someSelected && (
        <div className="px-4 py-2 border-t border-border bg-muted/50 text-sm text-muted-foreground animate-slide-in">
          {selectedIds.size} volume{selectedIds.size !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

function SourceTag({ source, ruleName }: { source: Volume['source']; ruleName?: string }) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    rule: 'bg-accent/10 text-accent',
    manual: 'bg-warning-light text-warning',
  };

  const labels = {
    default: 'Default',
    rule: ruleName || 'Rule',
    manual: 'Manual',
  };

  return (
    <span className={cn('source-tag', variants[source])}>
      {labels[source]}
    </span>
  );
}
