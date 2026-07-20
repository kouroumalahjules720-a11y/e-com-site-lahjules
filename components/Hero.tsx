'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { useData } from '@/lib/context';

export default function Hero() {
  const { data } = useData();
  const config = data?.config;

  if (!config) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-darker via-primary-dark to-primary">
      <div className="absolute inset-0 opacity-20">
        <img
          src={config.heroImage}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-darker/90 to-primary-dark/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-primary-muted text-sm font-medium tracking-wide uppercase mb-4">
            {config.tagline}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {config.heroTitle}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalog/">
              <Button size="lg" variant="cta">
                Découvrir la collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/catalog/?featured=true">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 hover:border-secondary"
              >
                Produits phares
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
