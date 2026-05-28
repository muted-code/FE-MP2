import React, { useState, useRef, useEffect } from 'react';
import { Send, SmilePlus, ArrowLeft } from 'lucide-react';

interface Friend {
  name: string;
  status: string;
  handle: string;
}

interface Message {
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const FAKE_CHATS: Record<string, Message[]> = {
  admin: [
    { sender: 'Admin', text: 'Hola! Bienvenido a Study Room 👋', time: '10:30', isMe: false },
    { sender: 'Admin', text: 'Si necesitas ayuda con algo, no dudes en preguntar.', time: '10:31', isMe: false },
    { sender: 'Tú', text: '¡Gracias! Todo claro por ahora 😊', time: '10:35', isMe: true },
    { sender: 'Admin', text: 'Perfecto, recuerda que puedes crear salas de estudio desde el panel izquierdo.', time: '10:36', isMe: false },
  ],
  carlos_dev: [
    { sender: 'Carlos', text: '¿Alguien tiene los apuntes de Cálculo?', time: '14:20', isMe: false },
    { sender: 'Tú', text: 'Sí, te los paso por acá', time: '14:22', isMe: true },
    { sender: 'Carlos', text: '¡Genial! Gracias crack 🙏', time: '14:23', isMe: false },
    { sender: 'Tú', text: '¿Vas a la sala de estudio esta noche?', time: '14:25', isMe: true },
    { sender: 'Carlos', text: 'Dale, a las 8 me conecto', time: '14:26', isMe: false },
  ],
  mary99: [
    { sender: 'María', text: 'Hola! ¿Pudiste resolver el punto 3 del taller?', time: 'Ayer', isMe: false },
    { sender: 'Tú', text: 'Aún no, está difícil ese 😅', time: 'Ayer', isMe: true },
    { sender: 'María', text: 'Creemos una sala para resolverlo juntos mañana', time: 'Ayer', isMe: false },
  ],
};

interface Props {
  friend: Friend;
  userName: string;
  userAvatar?: string;
  onBack: () => void;
}

const DirectMessageView: React.FC<Props> = ({ friend, userName, userAvatar, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(FAKE_CHATS[friend.handle] || []);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(FAKE_CHATS[friend.handle] || []);
  }, [friend.handle]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = { sender: userName || 'Tú', text: input, time: 'ahora', isMe: true };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const statusColor = friend.status === 'online' ? 'bg-green-500' : friend.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500';
  const statusText = friend.status === 'online' ? 'En línea' : friend.status === 'idle' ? 'Ausente' : 'Desconectado';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <button onClick={onBack} className="text-muted hover:text-white transition-colors lg:hidden">
          <ArrowLeft size={18} />
        </button>
        <img src={`https://i.pravatar.cc/150?u=${friend.handle}`} alt={friend.name} className="w-7 h-7 rounded-full" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-[15px]">{friend.name}</span>
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-xs text-muted/50">{statusText}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {/* Welcome banner */}
        <div className="flex flex-col items-center py-8 mb-4">
          <img src={`https://i.pravatar.cc/150?u=${friend.handle}`} alt={friend.name} className="w-16 h-16 rounded-full mb-3" />
          <h3 className="text-xl font-bold text-white">{friend.name}</h3>
          <p className="text-sm text-muted/60 mt-1">Este es el inicio de tu conversación con <span className="text-white/80 font-medium">{friend.name}</span>.</p>
          <div className="w-full border-t border-white/[0.04] mt-6" />
        </div>

        {messages.map((msg, i) => {
          const showAvatar = i === 0 || messages[i - 1].isMe !== msg.isMe;
          return (
            <div
              key={i}
              className={`group flex gap-3 py-0.5 px-2 rounded-md hover:bg-white/[0.02] transition-colors ${showAvatar ? 'mt-3' : ''}`}
            >
              {/* Avatar column */}
              <div className="w-10 shrink-0 flex justify-center">
                {showAvatar ? (
                  <img
                    src={msg.isMe
                      ? (userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1a1b23&color=00f0ff`)
                      : `https://i.pravatar.cc/150?u=${friend.handle}`}
                    alt={msg.sender}
                    className="w-10 h-10 rounded-full mt-0.5"
                  />
                ) : null}
              </div>
              {/* Content */}
              <div className="min-w-0 flex-1">
                {showAvatar && (
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${msg.isMe ? 'text-primary' : 'text-white'}`}>{msg.sender}</span>
                    <span className="text-[10px] text-muted/40">{msg.time}</span>
                  </div>
                )}
                <p className="text-[14px] text-muted/90 leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-1 shrink-0">
        <div className="flex items-center gap-2 bg-dash-sidebar border border-white/[0.06] rounded-lg px-4 py-2.5 transition-colors duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Enviar mensaje a ${friend.name}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-muted/30 focus:outline-none"
          />
          <button className="text-muted/40 hover:text-muted transition-colors">
            <SmilePlus size={18} />
          </button>
          <button onClick={sendMessage} className="text-primary hover:text-cyan-300 transition-colors disabled:opacity-30" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageView;
