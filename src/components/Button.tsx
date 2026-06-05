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
  missionTheory: 'text-white border border-[#FF2F45]/50 bg-[linear-gradient(135deg,#7A0718_0%,#E11D48_42%,#FF4F6D_72%,#FFD1DC_100%)] shadow-[0_12px_24px_rgba(225,29,72,0.28)] hover:brightness-110',
  missionTest: 'text-white border border-[#FF7A2F]/50 bg-[linear-gradient(135deg,#7C1D12_0%,#DC2626_34%,#F97316_70%,#FDBA74_100%)] shadow-[0_12px_24px_rgba(249,115,22,0.28)] hover:brightness-110',
  missionOral: 'text-[#3D2600] border border-[#FACC15]/60 bg-[linear-gradient(135deg,#B45309_0%,#F59E0B_38%,#FDE047_72%,#FFF7AD_100%)] shadow-[0_12px_24px_rgba(250,204,21,0.3)] hover:brightness-105',
  missionCase: 'text-white border border-[#A3E635]/55 bg-[linear-gradient(135deg,#064E3B_0%,#059669_36%,#22C55E_68%,#D9F99D_100%)] shadow-[0_12px_24px_rgba(34,197,94,0.28)] hover:brightness-110',
  missionReview: 'text-white border border-[#38BDF8]/50 bg-[linear-gradient(135deg,#1E1B4B_0%,#2563EB_30%,#A855F7_62%,#FF4FB8_100%)] shadow-[0_12px_24px_rgba(168,85,247,0.3)] hover:brightness-110',
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
