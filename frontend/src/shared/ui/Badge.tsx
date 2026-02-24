import { cn } from '../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neon';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-gray-300 border-white/10',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neon: 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14]/20',
};

export function Badge({ variant = 'default', children, className }: Readonly<BadgeProps>) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: Readonly<{ status: string }>) {
  const map: Record<string, BadgeVariant> = {
    published: 'success',
    draft: 'default',
    cancelled: 'danger',
    completed: 'info',
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'neon',
    delivered: 'success',
    paid: 'success',
    failed: 'danger',
    refunded: 'warning',
  };

  const labels: Record<string, string> = {
    published: 'Published',
    draft: 'Draft',
    cancelled: 'Cancelled',
    completed: 'Completed',
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
  };

  return (
    <Badge variant={map[status] || 'default'}>
      {labels[status] || status}
    </Badge>
  );
}
