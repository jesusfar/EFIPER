import { type ButtonHTMLAttributes } from 'react';
import { playSfx } from '../lib/audio/soundManager';

type Variant = 'primary' | 'ghost' | 'go' | 'danger' | 'selfBad' | 'selfMid' | 'selfGood' | 'missionTheory' | 'missionTest' | 'missionOral' | 'missionCase' | 'missionReview';

const styles: Record<Variant, string> = {
  primary: 'bg-[linear-gradient(135deg,#005E50,#008400)] text-white hover:brightness-110 shadow-stud',
  go: 'bg-go text-white border border-go hover:bg-[#005E50] shadow-stud',
  ghost: 'bg-white text-ink border border-accent/50 hover:border-accent hover:bg-panel-2',
  danger: 'bg-teal-card text-white border border-teal-card hover:bg-slate shadow-stud',
  selfBad: 'text-white border border-[#B91C1C]/45 bg-[linear-gradient(135deg,#7F1D1D_0%,#DC2626_52%,#F87171_100%)] shadow-[0_12px_24px_rgba(220,38,38,0.24)] hover:brightness-110',
  selfMid: 'text-[#4A3200] border border-[#D97706]/45 bg-[linear-gradient(135deg,#F59E0B_0%,#FBBF24_52%,#FEF08A_100%)] shadow-[0_12px_24px_rgba(245,158,11,0.22)] hover:brightness-105',
  selfGood: 'text-white border border-[#008400]/45 bg-[linear-gradient(135deg,#005E50_0%,#008400_48%,#16A34A_100%)] shadow-[0_12px_24px_rgba(0,132,0,0.24)] hover:brightness-110',
  missionTheory: 'text-white border border-[#22C55E]/45 bg-[linear-gradient(135deg,#064E3B_0%,#16A34A_50%,#22C55E_100%)] shadow-[0_12px_24px_rgba(34,197,94,0.25)] hover:brightness-110',
  missionTest: 'text-white border border-[#009F92]/40 bg-[linear-gradient(135deg,#005E50_0%,#007A45_58%,#008400_100%)] shadow-[0_12px_24px_rgba(0,94,80,0.26)] hover:brightness-110',
  missionOral: 'text-white border border-[#008400]/40 bg-[linear-gradient(135deg,#008400_0%,#009F22_48%,#005E50_100%)] shadow-[0_12px_24px_rgba(0,132,0,0.24)] hover:brightness-110',
  missionCase: 'text-white border border-[#009F92]/45 bg-[linear-gradient(135deg,#009F92_0%,#005E50_52%,#003F3A_100%)] shadow-[0_12px_24px_rgba(0,159,146,0.23)] hover:brightness-110',
  missionReview: 'text-white border border-[#1D544F]/45 bg-[linear-gradient(135deg,#1D544F_0%,#008400_55%,#009F92_100%)] shadow-[0_12px_24px_rgba(29,84,79,0.24)] hover:brightness-110',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'ghost', className = '', onClick, onMouseEnter, ...rest }: Props) {
  return (
    <button
      {...rest}
      onMouseEnter={(e) => { playSfx('hover'); onMouseEnter?.(e); }}
      onClick={(e) => { onClick?.(e); }}
      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}
