'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { login } from '@/lib/auth';
import { useData } from '@/lib/context';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = data?.config.adminPassword || 'admin123';
    if (login(password, adminPassword)) {
      router.push('/admin/');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darker via-primary-dark to-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-premium p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div className="flex justify-center mb-3">
              <Logo showName />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-500 mt-1">LOYAL FRIENDS STORE — Gérez votre boutique</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Entrez le mot de passe admin"
              error={error}
            />
            <Button type="submit" size="lg" className="w-full" variant="cta">
              Se connecter
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Mot de passe par défaut : admin123
          </p>
        </div>
      </div>
    </div>
  );
}
