import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden',
        hover && 'hover:shadow-premium hover:border-primary/20 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
