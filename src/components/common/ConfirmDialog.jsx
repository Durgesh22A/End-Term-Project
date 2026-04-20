import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import './ConfirmDialog.css';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure?', 
  message = '', 
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) {
  const dialogRef = useRef(null);

  // Focus trap + ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div 
        className="confirm-dialog animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <button className="confirm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className={`confirm-icon confirm-icon-${variant}`}>
          <AlertTriangle size={28} />
        </div>

        <h3 id="confirm-title" className="confirm-title">{title}</h3>
        <p id="confirm-message" className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
