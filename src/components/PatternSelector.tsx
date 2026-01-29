import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MatchType } from '@/types/volume';
import { Search, Eye, Plus, Minus, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatternSelectorProps {
  onPreview: (matchType: MatchType, pattern: string) => number;
  onInclude: (matchType: MatchType, pattern: string) => void;
  onExclude: (matchType: MatchType, pattern: string) => void;
  onFilter: (matchType: MatchType, pattern: string) => void;
  onClearFilter: () => void;
  activeFilter: { matchType: MatchType; pattern: string } | null;
}

export function PatternSelector({
  onPreview,
  onInclude,
  onExclude,
  onFilter,
  onClearFilter,
  activeFilter,
}: PatternSelectorProps) {
  const [matchType, setMatchType] = useState<MatchType>('starts-with');
  const [pattern, setPattern] = useState('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  const handlePreview = () => {
    if (!pattern.trim()) return;
    const count = onPreview(matchType, pattern.trim());
    setPreviewCount(count);
  };

  const handleInclude = () => {
    if (!pattern.trim()) return;
    onInclude(matchType, pattern.trim());
    setPreviewCount(null);
  };

  const handleExclude = () => {
    if (!pattern.trim()) return;
    onExclude(matchType, pattern.trim());
    setPreviewCount(null);
  };

  const handleFilter = () => {
    if (!pattern.trim()) return;
    onFilter(matchType, pattern.trim());
    setPreviewCount(null);
  };

  const matchTypeLabels: Record<MatchType, string> = {
    'starts-with': 'Starts with',
    'contains': 'Contains',
    'ends-with': 'Ends with',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Search className="w-4 h-4 text-accent" />
          Bulk Select / Filter Volumes
        </h3>
        {activeFilter && (
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            Filtered: {matchTypeLabels[activeFilter.matchType]} "{activeFilter.pattern}"
            <button
              onClick={onClearFilter}
              className="ml-1 hover:bg-muted rounded p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={matchType} onValueChange={(v) => setMatchType(v as MatchType)}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border">
            <SelectItem value="starts-with">Starts with</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="ends-with">Ends with</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Input
            placeholder="Enter volume pattern (e.g. PROD, TEST, DB2)"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value.toUpperCase());
              setPreviewCount(null);
            }}
            className="bg-background font-mono"
          />
          {previewCount !== null && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="outline" className="text-xs">
                {previewCount} matches
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={!pattern.trim()}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExclude}
            disabled={!pattern.trim()}
            className="text-excluded hover:text-excluded hover:bg-excluded-light border-excluded/30"
          >
            <Minus className="w-4 h-4 mr-1.5" />
            Exclude Matching
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleInclude}
            disabled={!pattern.trim()}
            className="text-included hover:text-included hover:bg-included-light border-included/30"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Include Matching
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFilter}
            disabled={!pattern.trim()}
          >
            <Filter className="w-4 h-4 mr-1.5" />
            Apply as Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
