import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sysplex } from '@/types/volume';
import { Server, MapPin } from 'lucide-react';

interface SysplexSelectorProps {
  sysplexes: Sysplex[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SysplexSelector({ sysplexes, selectedId, onSelect }: SysplexSelectorProps) {
  const selected = sysplexes.find(s => s.id === selectedId);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Server className="w-4 h-4" />
        <span className="font-medium">Sysplex:</span>
      </div>
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger className="w-[280px] bg-card">
          <SelectValue placeholder="Select a Sysplex" />
        </SelectTrigger>
        <SelectContent className="bg-card border border-border">
          {sysplexes.map((sysplex) => (
            <SelectItem key={sysplex.id} value={sysplex.id}>
              <div className="flex items-center gap-3">
                <span className="font-medium">{sysplex.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {sysplex.region}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({sysplex.totalVolumes.toLocaleString()} volumes)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
