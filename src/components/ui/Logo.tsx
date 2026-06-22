import Link from 'next/link';
import { FiTool } from 'react-icons/fi';

interface LogoProps {
  variant?: 'dark' | 'light';
  href?: string;
  subtitle?: string;
}

export default function Logo({ variant = 'dark', href = '/', subtitle }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subtitleColor = variant === 'light' ? 'text-slate-400' : 'text-slate-500';

  const content = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-orange-700 rounded-lg flex items-center justify-center shrink-0">
        <FiTool size={16} className="text-white" />
      </div>
      <div>
        <p className={`text-base font-extrabold tracking-tight leading-none ${textColor}`}>
          CONSTRUCTPRO
        </p>
        {subtitle && (
          <p className={`text-xs mt-0.5 ${subtitleColor}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
