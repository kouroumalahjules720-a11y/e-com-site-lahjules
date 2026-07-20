import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'promo' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-accent-light text-accent': variant === 'success',
          'bg-secondary text-white': variant === 'promo',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-primary-light text-primary': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
