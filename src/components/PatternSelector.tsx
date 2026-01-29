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
import { Search, Filter, X, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatternSelectorProps {
  onSelect: (matchType: MatchType, pattern: string) => void;
  onFilter: (matchType: MatchType, pattern: string) => void;
  onClearFilter: () => void;
  activeFilter: { matchType: MatchType; pattern: string } | null;
}

export function PatternSelector({
  onSelect,
  onFilter,
  onClearFilter,
  activeFilter,
}: PatternSelectorProps) {
  const [matchType, setMatchType] = useState<MatchType>('starts-with');
  const [pattern, setPattern] = useState('');

  const handleSelect = () => {
    if (!pattern.trim()) return;
    onSelect(matchType, pattern.trim());
  };

  const handleFilter = () => {
    if (!pattern.trim()) return;
    onFilter(matchType, pattern.trim());
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

        <Input
          placeholder="Enter volume pattern (e.g. PROD, TEST, DB2)"
          value={pattern}
          onChange={(e) => setPattern(e.target.value.toUpperCase())}
          className="bg-background font-mono flex-1 min-w-[200px] max-w-[300px]"
        />

        <Button
          variant="default"
          size="sm"
          onClick={handleSelect}
          disabled={!pattern.trim()}
          className="bg-accent hover:bg-accent/90"
        >
          <CheckSquare className="w-4 h-4 mr-1.5" />
          Select
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFilter}
          disabled={!pattern.trim()}
        >
          <Filter className="w-4 h-4 mr-1.5" />
          Filter
        </Button>
      </div>
    </div>
  );
}
