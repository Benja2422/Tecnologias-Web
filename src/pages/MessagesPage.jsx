import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MessagesLayout from '../components/templates/MessagesLayout';
import ConversationList from '../components/organisms/ConversationList';
import ChatPanel from '../components/organisms/ChatPanel';
import EmptyChat from '../components/molecules/EmptyChat';
import { useMessages } from '../contexts/MessagesContext';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';

/** Mensajes: `/mensajes` (bandeja) y `/mensajes/:conversationId` (conversación abierta). */
export default function MessagesPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { conversations, unreadCount, getConversation, sendMessage, markRead } = useMessages();

  const conversation = conversationId ? getConversation(conversationId) : null;
  const exists = Boolean(conversation);

  // Abrir una conversación la marca como leída (solo al abrirla: "Marcar como no leído" no debe deshacerse solo)
  useEffect(() => {
    if (conversationId && exists) markRead(conversationId);
  }, [conversationId, exists, markRead]);

  if (conversationId && !conversation) return <Navigate to="/mensajes" replace />;

  const send = (text) => {
    console.log('[Mensajes] Enviar mensaje:', { conversationId: conversation.id, to: conversation.name, text });
    sendMessage(conversation.id, text);
  };

  return (
    <>
      <MessagesLayout
        headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}
        showChat={Boolean(conversation)}
        list={(
          <ConversationList
            conversations={conversations}
            unreadCount={unreadCount}
            selectedId={conversation?.id}
            onSelect={(id) => navigate(`/mensajes/${id}`)}
          />
        )}
        chat={conversation ? (
          <ChatPanel
            conversation={conversation}
            onBack={() => navigate('/mensajes')}
            onSend={send}
          />
        ) : <EmptyChat />}
      />
    </>
  );
}
