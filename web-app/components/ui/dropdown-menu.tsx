"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropdownContext = createContext<any>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="inline-block relative">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: any) {
  const ctx = useContext(DropdownContext);
  const child = React.Children.only(children) as any;
  const onClick = (e: any) => {
    e.stopPropagation();
    ctx.setOpen(!ctx.open);
  };

  // Clone child's props to inject onClick
  return React.cloneElement(child, {
    onClick: (e: any) => {
      onClick(e);
      if (child.props.onClick) child.props.onClick(e);
    },
  });
}

export function DropdownMenuContent({ children, align = 'start', className = '' }: any) {
  const ctx = useContext(DropdownContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick() {
      ctx.setOpen(false);
    }
    if (ctx.open) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [ctx]);

  if (!ctx.open) return null;

  return (
    <div ref={ref} className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} mt-2 z-50 ${className}`}>
      <div className="rounded-md bg-white shadow-lg p-1">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className = '' }: any) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${className}`}>
      {children}
    </button>
  );
}
