// components/ui/avatar.jsx
import React,{  useState, } from 'react';
import { cn } from '../../utils/cn';

export function Avatar({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

export function AvatarImage({ className, alt, ...props }) {
const [imageLoadError, setImageLoadError] = useState(false);

  const handleError = () => {
    setImageLoadError(true);
  };

  if (imageLoadError) {
    return null;
  }

  return (
    <img
      className={cn("aspect-square h-full w-full object-cover", className)}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarInitials({ className, children, name, ...props }) {
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = children || getInitials(name);

  return (
    <AvatarFallback className={className} {...props}>
      {initials}
    </AvatarFallback>
  );
}