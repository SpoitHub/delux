import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: Readonly<SpinnerProps>) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-[#39ff14]', className)}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <Spinner size={32} />
    </div>
  );
}
