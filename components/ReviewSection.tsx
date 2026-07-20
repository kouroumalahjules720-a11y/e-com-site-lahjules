'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import type { Review } from '@/lib/types';
import { generateId } from '@/lib/storage';
import { useData } from '@/lib/context';
import StarRating from './StarRating';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export default function ReviewSection({ productId, reviews: initialReviews }: ReviewSectionProps) {
  const { data, updateData } = useData();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || !data) return;

    const newReview: Review = {
      id: generateId('rev'),
      productId,
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [...data.reviews, newReview];
    updateData({ ...data, reviews: updatedReviews });
    setReviews([...reviews, newReview]);
    setAuthor('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Avis clients</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={avgRating} size="lg" showValue />
              <span className="text-sm text-gray-500">
                ({reviews.length} avis)
              </span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Laisser un avis'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Votre nom"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Marie K."
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Note
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        i < (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Commentaire
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary/40 resize-none"
              />
            </div>
            <Button type="submit">Publier l&apos;avis</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun avis pour le moment. Soyez le premier !
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
