import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionTo, className }: Readonly<EmptyStateProps>) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        {icon || <PackageOpen size={28} className="text-gray-500" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-md mb-6">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="bg-[#39ff14] hover:bg-[#32e612] text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
