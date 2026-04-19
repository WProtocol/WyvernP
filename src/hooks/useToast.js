import { useState, useCallback, useEffect } from "react";

let _setToasts = null;
let _id = 0;

export function toast(message, { type = "info", duration = 4000 } = {}) {
  if (!_setToasts) return;
  const id = ++_id;
  _setToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    _setToasts(prev => prev.filter(t => t.id !== id));
  }, duration);
}

export function useToastStore() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _setToasts = setToasts; return () => { _setToasts = null; }; }, []);
  const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, dismiss };
}
