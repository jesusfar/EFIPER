import rosaSrc from '../assets/avatars/avatar-rosa.png';
import naranjaSrc from '../assets/avatars/avatar-naranja.png';
import rojoSrc from '../assets/avatars/avatar-rojo.png';
import moradoSrc from '../assets/avatars/avatar-morado.png';

// Avatares "Frutiger Aero" (buddy glossy tipo MSN). Se importan desde src para
// que viajen incrustados (base64) en el bundle de un solo archivo offline.
export type AvatarColor = 'rosa' | 'naranja' | 'rojo' | 'morado';

const AVATAR_SRC: Record<AvatarColor, string> = {
  rosa: rosaSrc,
  naranja: naranjaSrc,
  rojo: rojoSrc,
  morado: moradoSrc,
};

export const AVATAR_PALETTE: Record<AvatarColor, { light: string; base: string; dark: string; label: string }> = {
  rosa: { light: '#FFB3E6', base: '#FF3DB4', dark: '#C81C8E', label: 'Rosa' },
  naranja: { light: '#FFD27A', base: '#FF9D1E', dark: '#E06D00', label: 'Naranja' },
  rojo: { light: '#FF8E7E', base: '#F5371F', dark: '#B71208', label: 'Rojo' },
  morado: { light: '#C79CFF', base: '#9B4DFF', dark: '#6B1FC4', label: 'Morado' },
};

// Orden fijo de slots: P1 rosa, P2 naranja, P3 rojo, P4 morado.
export const AVATAR_SLOTS: AvatarColor[] = ['rosa', 'naranja', 'rojo', 'morado'];

export function BuddyAvatar({ color, size = 48, ring = false, className = '' }: {
  color: AvatarColor; size?: number; ring?: boolean; className?: string;
}) {
  const p = AVATAR_PALETTE[color];
  return (
    <img
      src={AVATAR_SRC[color]}
      alt={`Avatar ${p.label}`}
      width={size}
      height={size}
      className={`block shrink-0 object-contain ${className}`}
      style={{ width: size, height: size, filter: ring ? `drop-shadow(0 0 5px ${p.base})` : undefined }}
    />
  );
}
