import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

const steps: Step[] = [
  { id: 1, label: 'What to Backup', status: 'active' },
  { id: 2, label: 'Flash Copy', status: 'pending' },
  { id: 3, label: 'Disk Mapping', status: 'pending' },
  { id: 4, label: 'Backup Configuration', status: 'pending' },
  { id: 5, label: 'Run Policy', status: 'pending' },
];

export function PolicyStepper() {
  return (
    <div className="w-full bg-card border-b border-border px-6 py-4">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
              <div className={cn('stepper-item', step.status)}>
                <div className={cn('stepper-circle', step.status)}>
                  {step.status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="hidden sm:block whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden sm:block w-16 lg:w-24 h-0.5 mx-3',
                    step.status === 'completed'
                      ? 'bg-included'
                      : 'bg-border'
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
