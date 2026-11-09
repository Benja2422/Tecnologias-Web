import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'todomart.moderation';
const EMPTY = { hidden: {}, deleted: [], reminders: {} };

// Sin proveedor, nada está moderado (así los componentes no fallan en pruebas aisladas)
const ModerationContext = createContext({
  hidden: {}, reminders: {}, isHidden: () => false, isDeleted: () => false, isVisible: () => true,
  hide: () => {}, restore: () => {}, remove: () => {}, remind: () => {},
});

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.hidden === 'object' && Array.isArray(saved.deleted)) return { ...EMPTY, ...saved };
  } catch { /* sin almacenamiento o datos dañados */ }
  return EMPTY;
};

/**
 * Decisiones de moderación del administrador sobre contenido de los usuarios. Claves: "q:<id>" pregunta pública,
 * "m:<id>" mensaje privado, "r:<id>" reseña.
 * - hidden: { clave: { reason, note, at } } → el contenido deja de mostrarse (se puede restaurar).
 * - deleted: [clave] → eliminado de forma permanente.
 * - reminders: { clave: fecha } → recordatorio enviado al vendedor para que responda.
 */
export function ModerationProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignorar */ }
  }, [state]);

  const hide = useCallback((key, reason, note = '') => setState((s) => ({ ...s, hidden: { ...s.hidden, [key]: { reason, note: note.trim(), at: new Date().toISOString() } } })), []);
  const restore = useCallback((key) => setState((s) => { const hidden = { ...s.hidden }; delete hidden[key]; return { ...s, hidden }; }), []);
  const remove = useCallback((key) => setState((s) => {
    const hidden = { ...s.hidden }; delete hidden[key];
    return { ...s, hidden, deleted: s.deleted.includes(key) ? s.deleted : [...s.deleted, key] };
  }), []);
  const remind = useCallback((key) => setState((s) => ({ ...s, reminders: { ...s.reminders, [key]: new Date().toISOString() } })), []);

  const value = useMemo(() => {
    const deleted = new Set(state.deleted);
    const isHidden = (key) => Boolean(state.hidden[key]);
    const isDeleted = (key) => deleted.has(key);
    return {
      hidden: state.hidden, reminders: state.reminders, isHidden, isDeleted,
      isVisible: (key) => !isHidden(key) && !isDeleted(key),
      hide, restore, remove, remind,
    };
  }, [state, hide, restore, remove, remind]);

  return <ModerationContext.Provider value={value}>{children}</ModerationContext.Provider>;
}

export const useModeration = () => useContext(ModerationContext);
