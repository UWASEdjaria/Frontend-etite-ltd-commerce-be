import Link from 'next/link';
import { Building2 } from 'lucide-react';

interface LogoProps {
  variant?: 'dark' | 'light';
  href?: string;
  subtitle?: string;
}

export default function Logo({ variant = 'dark', href = '/', subtitle }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subtitleColor = variant === 'light' ? 'text-orange-300' : 'text-orange-500';

  const content = (
    <div className="flex items-center gap-2.5">
      {/* Shield emblem */}
      <div className="relative w-9 h-10 shrink-0">
        {/* Shield shape using clip-path */}
        <div
          className="w-full h-full bg-orange-500 flex items-center justify-center"
          style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%)' }}
        >
          <Building2 size={18} className="text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className={`text-base font-black tracking-widest uppercase ${textColor}`}>
          Construct
        </span>
        <span className="text-base font-black tracking-widest uppercase text-orange-500">
          Pro
        </span>
        {subtitle && (
          <span className={`text-xs mt-0.5 ${subtitleColor}`}>{subtitle}</span>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
