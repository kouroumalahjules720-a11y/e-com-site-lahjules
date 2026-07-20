import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'outline' | 'ghost' | 'danger' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md':
            variant === 'primary',
          'bg-white text-primary border border-primary-light hover:bg-primary-light':
            variant === 'secondary',
          'bg-secondary text-white hover:bg-secondary-hover shadow-sm hover:shadow-md':
            variant === 'cta' || variant === 'whatsapp',
          'border-2 border-primary text-primary hover:bg-primary-light':
            variant === 'outline',
          'text-gray-600 hover:text-primary hover:bg-gray-50':
            variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-7 py-3.5 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
