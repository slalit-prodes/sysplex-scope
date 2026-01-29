import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface BottomNavigationProps {
  onBack: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
  canProceed?: boolean;
}

export function BottomNavigation({
  onBack,
  onSaveDraft,
  onNext,
  canProceed = true,
}: BottomNavigationProps) {
  return (
    <div className="bg-card border-t border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onSaveDraft}>
            <Save className="w-4 h-4 mr-1.5" />
            Save as Draft
          </Button>

          <Button onClick={onNext} disabled={!canProceed}>
            Next Step
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
