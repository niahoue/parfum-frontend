import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
    destructive: 'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
    outline: 'text-foreground border-input',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };