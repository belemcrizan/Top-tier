import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  close: string;
  dismiss: () => void;
}

export function Toast({ message, close, dismiss }: ToastProps): JSX.Element {
  const remaining = useRef(5000);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (hovered || focused) return;
    const started = Date.now();
    const timer = window.setTimeout(dismiss, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [dismiss, focused, hovered]);
  return (
    <div
      className="toast"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => setFocused(event.currentTarget.contains(event.relatedTarget))}
    >
      <span role="status">{message}</span>
      <button onClick={dismiss} aria-label={close}>
        <X size={18} />
      </button>
    </div>
  );
}
