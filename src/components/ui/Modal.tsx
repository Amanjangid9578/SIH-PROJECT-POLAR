import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  variant?: 'standard' | 'emergency';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  variant = 'standard'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-polar-950/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full rounded-xl border p-6 text-left shadow-2xl transition-all duration-200 z-10 my-8 overflow-hidden',
          variant === 'emergency'
            ? 'bg-polar-900 border-rose-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
            : 'bg-polar-900 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
          maxWidthStyles[maxWidth]
        )}
      >
        {/* Subtle grid watermark */}
        <div className="absolute inset-0 polar-grid opacity-30 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-start justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="space-y-1 pr-6">
            <h3
              className={cn(
                'text-lg font-bold tracking-wide uppercase font-mono flex items-center gap-2',
                variant === 'emergency' ? 'text-rose-400' : 'text-slate-100'
              )}
            >
              {variant === 'emergency' && (
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              )}
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 font-mono tracking-wide">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-polar-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
