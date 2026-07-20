import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({
  rating,
  max = 5,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const sizeClass = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={clsx(sizeClass, {
            'text-yellow-400 fill-yellow-400': i < Math.round(rating),
            'text-gray-200 fill-gray-200': i >= Math.round(rating),
          })}
        />
      ))}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
