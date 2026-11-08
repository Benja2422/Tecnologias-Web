import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialConversations } from '../utils/mockMessages';

const STORAGE_KEY = 'todomart.messages';
export const MAX_MESSAGE_LENGTH = 1000;

// Sin proveedor, el contexto responde vacío (así los componentes no fallan en pruebas aisladas)
const MessagesContext = createContext({
  conversations: [], unreadCount: 0, getConversation: () => null,
  sendMessage: () => null, markRead: () => {}, startConversation: () => null,
});

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* sin almacenamiento o datos dañados: se usan las conversaciones de ejemplo */ }
  return initialConversations;
};

const lastAt = (c) => c.messages[c.messages.length - 1]?.at ?? '';

/**
 * Conversaciones de mensajería. Cada una: { id, name, initials, role, unread, messages: [{ id, from: 'me' | 'them', text, at }] }.
 * `conversations` viene ordenado por el último mensaje (el más reciente primero). Se guarda en localStorage.
 */
export function MessagesProvider({ children }) {
  const [raw, setRaw] = useState(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw)); } catch { /* ignorar */ }
  }, [raw]);

  const conversations = useMemo(() => [...raw].sort((a, b) => lastAt(b).localeCompare(lastAt(a))), [raw]);
  const unreadCount = useMemo(() => raw.filter((c) => c.unread).length, [raw]);
  const getConversation = useCallback((id) => conversations.find((c) => c.id === id) ?? null, [conversations]);

  const update = useCallback((id, fn) => setRaw((prev) => prev.map((c) => (c.id === id ? fn(c) : c))), []);

  const sendMessage = useCallback((id, text) => {
    const clean = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!clean) return null;
    const message = { id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, from: 'me', text: clean, at: new Date().toISOString() };
    update(id, (c) => ({ ...c, messages: [...c.messages, message] }));
    return message;
  }, [update]);

  const markRead = useCallback((id) => update(id, (c) => (c.unread ? { ...c, unread: false } : c)), [update]);

  /** Abre (o crea, si no existe) la conversación con un contacto { id, name, role } y devuelve su id. */
  const startConversation = useCallback(({ id, name, role = 'Empresa' }) => {
    const initials = name.split(/\s+/).filter((w) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
    setRaw((prev) => (prev.some((c) => c.id === id) ? prev : [{ id, name, initials, role, unread: false, messages: [] }, ...prev]));
    return id;
  }, []);

  const value = useMemo(
    () => ({ conversations, unreadCount, getConversation, sendMessage, markRead, startConversation }),
    [conversations, unreadCount, getConversation, sendMessage, markRead, startConversation],
  );
  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export const useMessages = () => useContext(MessagesContext);
