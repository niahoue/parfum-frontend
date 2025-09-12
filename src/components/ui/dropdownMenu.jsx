// components/ui/dropdown-menu.jsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const DropdownMenuContext = createContext();

export function DropdownMenu({ children, onOpenChange }) {
  const [open, setOpen] = useState(false);
  
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen: handleOpenChange }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }) {
  const { open, setOpen } = useContext(DropdownMenuContext);
  const triggerRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-expanded': open,
      'aria-haspopup': true,
      tabIndex: 0,
      ...children.props
    });
  }

  return (
    <button
      ref={triggerRef}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup={true}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  children, 
  className, 
  align = "center", 
  side = "bottom",
  sideOffset = 4,
  ...props 
}) {
  const { open, setOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        const trigger = contentRef.current.parentElement.querySelector('[aria-expanded]');
        if (trigger && !trigger.contains(event.target)) {
          setOpen(false);
        }
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, setOpen]);

  if (!open) return null;

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  const sideClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2 top-0',
    right: 'left-full ml-2 top-0'
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        alignClasses[align],
        sideClasses[side],
        className
      )}
      style={{ 
        marginTop: side === 'bottom' ? sideOffset : undefined,
        marginBottom: side === 'top' ? sideOffset : undefined,
        marginLeft: side === 'right' ? sideOffset : undefined,
        marginRight: side === 'left' ? sideOffset : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  className, 
  disabled = false,
  onClick,
  ...props 
}) {
  const { setOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (!disabled) {
      onClick?.(e);
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      role="menuitem"
      {...props}
    >
      {children}
    </div>
  );
}

