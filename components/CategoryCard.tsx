import Link from 'next/link';
import type { Category } from '@/lib/types';
import Card from './ui/Card';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/catalog/?category=${category.slug}`}>
      <Card hover className="group">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
