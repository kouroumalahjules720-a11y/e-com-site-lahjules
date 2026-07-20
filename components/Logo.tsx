'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import { useData } from '@/lib/context';

interface LogoProps {
  className?: string;
  /** Allow clicking to upload (admin only) */
  uploadable?: boolean;
  /** White store name for blue header/footer */
  onDark?: boolean;
  showName?: boolean;
}

export default function Logo({
  className,
  uploadable = false,
  onDark = false,
  showName = true,
}: LogoProps) {
  const { data, updateData } = useData();
  const inputRef = useRef<HTMLInputElement>(null);
  const logoBase64 = data?.config.logoBase64;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateData({
        ...data,
        config: { ...data.config, logoBase64: result },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const logoBox = (
    <span
      className={clsx(
        'relative flex-shrink-0 overflow-hidden bg-white/15 border border-white/30',
        uploadable
          ? 'w-[96px] h-[96px] max-w-[120px] max-h-[120px]'
          : 'w-[48px] h-[48px] sm:w-[56px] sm:h-[56px]',
        'rounded-[12px]',
        uploadable && 'cursor-pointer hover:bg-white/25 transition-colors'
      )}
      style={{ maxWidth: 120, maxHeight: 120 }}
      onClick={uploadable ? () => inputRef.current?.click() : undefined}
      role={uploadable ? 'button' : undefined}
      title={uploadable ? 'Cliquer pour uploader le logo' : undefined}
    >
      {logoBase64 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoBase64}
          alt="Logo LOYAL FRIENDS STORE"
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={clsx(
            'flex items-center justify-center w-full h-full text-center leading-tight px-1',
            onDark ? 'text-white/90' : 'text-primary',
            'text-[9px] sm:text-[10px] font-semibold'
          )}
        >
          Upload Logo
        </span>
      )}
    </span>
  );

  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      {uploadable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      )}
      {logoBox}
      {showName && (
        <span
          className={clsx(
            'font-bold tracking-tight leading-tight text-2xl',
            onDark ? 'text-white' : 'text-gray-900'
          )}
        >
          LOYAL FRIENDS STORE
        </span>
      )}
    </span>
  );
}
