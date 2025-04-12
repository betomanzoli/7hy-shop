
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'default' | 'admin';
  className?: string;
  animated?: boolean;
}

export function Logo({ variant = 'default', className, animated = true }: LogoProps) {
  return (
    <Link 
      to={variant === 'admin' ? '/admin' : '/'} 
      className={cn("flex items-center gap-1", className)}
    >
      <span className={cn(
        "font-bold text-2xl relative group",
        animated && "transition-all duration-300"
      )}>
        <span className={cn(
          "text-brand-700 transition-all duration-300",
          animated && "group-hover:text-brand-600"
        )}>
          7hy
        </span>
        <span className={cn(
          "text-brand-500 transition-all duration-300",
          animated && "group-hover:text-brand-400",
          animated && "relative"
        )}>
          .shop
          {animated && (
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-400 transition-all duration-300 group-hover:w-full"></span>
          )}
        </span>
        {animated && (
          <span className="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-tr from-brand-100 to-transparent opacity-0 blur-md transition-all duration-500 group-hover:opacity-100"></span>
        )}
      </span>
      {variant === 'admin' && <span className="text-xs font-normal text-muted-foreground">Admin</span>}
    </Link>
  );
}
