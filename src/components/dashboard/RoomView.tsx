import React, { useState } from 'react';
import { MicOff, Mic, VideoOff, Video, PhoneMissed, Monitor, Settings, Send, SmilePlus, Hash, UserPlus, Copy, Check } from 'lucide-react';
import type { Room } from '../../types';

interface Props {
  room: Room | null;
  user: any;
  onLeave: () => void;
}

const RoomView: React.FC<Props> = ({ room, user, onLeave }) => {
  const [hasJoinedCall, setHasJoinedCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(true);
  const [chatMsg, setChatMsg] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sistema', text: '¡Bienvenido a la sala de estudio! 📚', time: 'ahora' },
  ]);

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages([...messages, { sender: user?.name || 'Tú', text: chatMsg, time: 'ahora' }]);
    setChatMsg('');
  };

  // Reset join state when room changes
  React.useEffect(() => {
    setHasJoinedCall(false);
  }, [room?.id]);

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted gap-3">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-2">
          <Hash size={32} className="text-muted/30" />
        </div>
        <p className="text-lg font-medium text-white/60">Selecciona una sala</p>
        <p className="text-sm max-w-xs text-center">Elige una sala de estudio del panel izquierdo o crea una nueva para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top Bar */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <Hash size={20} className="text-muted/60" />
        <span className="font-semibold text-white text-[15px]">{room.name}</span>
        <span className="text-muted/50 text-sm hidden sm:block">|</span>
        <span className="text-muted/60 text-sm hidden sm:block">Sala de estudio activa</span>
        
        <div className="ml-auto flex items-center gap-2">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 text-sm bg-primary/20 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">Invitar Amigos</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Video/Call Area */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {!hasJoinedCall ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
               <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                 <Mic size={40} className="text-primary" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">{room.name}</h2>
               <p className="text-muted/80 mb-8 max-w-md">
                 Únete a esta sala para hablar por voz y video con otros estudiantes.
                 Actualmente hay 1 persona en la sala.
               </p>
               
               <div className="flex gap-4">
                 <button 
                   onClick={() => setHasJoinedCall(true)}
                   className="px-8 py-3 bg-primary hover:bg-cyan-400 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                 >
                   Unirse a la llamada
                 </button>
               </div>
            </div>
          ) : (
            <>
              {/* Video Grid */}
              <div className="flex-1 p-4 flex items-center justify-center animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-2 w-full max-w-2xl aspect-video">
                  {/* Self */}
                  <div className="bg-dash-video relative rounded-xl overflow-hidden flex items-center justify-center border border-white/[0.06] transition-colors duration-300">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=1a1b23&color=00f0ff`}
                      className="w-20 h-20 rounded-full opacity-60 object-cover"
                      alt="Tú"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white backdrop-blur-sm flex items-center gap-1">
                      {muted && <MicOff size={10} className="text-red-400" />}
                      {user?.name || 'Tú'}
                    </div>
                    {!muted && (
                      <div className="absolute inset-0 border-2 border-primary/40 rounded-xl animate-pulse pointer-events-none" />
                    )}
                  </div>
                  {/* Placeholder participant */}
                  <div className="bg-dash-video relative rounded-xl overflow-hidden flex items-center justify-center border border-white/[0.06] transition-colors duration-300">
                    <img src="https://i.pravatar.cc/150?u=admin" className="w-20 h-20 rounded-full opacity-40 object-cover" alt="Admin" />
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white backdrop-blur-sm">Admin</div>
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="py-3 flex justify-center gap-2 border-t border-white/[0.06] bg-dash-sidebar/60 shrink-0 transition-colors duration-300">
                <button
                  onClick={() => setMuted(!muted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    muted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/[0.08] text-white hover:bg-white/[0.12]'
                  }`}
                  title={muted ? 'Activar micrófono' : 'Silenciar'}
                >
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={() => setVideoOff(!videoOff)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    videoOff ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/[0.08] text-white hover:bg-white/[0.12]'
                  }`}
                  title={videoOff ? 'Activar cámara' : 'Desactivar cámara'}
                >
                  {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
                <button className="w-10 h-10 rounded-full bg-white/[0.08] text-white hover:bg-white/[0.12] flex items-center justify-center transition-all" title="Compartir pantalla">
                  <Monitor size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/[0.08] text-white hover:bg-white/[0.12] flex items-center justify-center transition-all" title="Configuración">
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => {
                    setHasJoinedCall(false);
                    onLeave();
                  }}
                  className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  title="Salir de la sala"
                >
                  <PhoneMissed size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* In-call Chat Panel */}
        <div className="w-72 border-l border-white/[0.06] flex flex-col bg-dash-sidebar/40 hidden lg:flex transition-colors duration-300">
          <div className="h-12 px-4 flex items-center border-b border-white/[0.06] shrink-0">
            <span className="text-sm font-semibold text-white">Chat de la Sala</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className="group">
                <div className="flex items-baseline gap-2">
                  <span className={`text-xs font-semibold ${msg.sender === 'Sistema' ? 'text-primary' : 'text-white/80'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-muted/40">{msg.time}</span>
                </div>
                <p className="text-sm text-muted/80 mt-0.5 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
              <input
                type="text"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-muted/40 focus:outline-none"
              />
              <button onClick={() => {}} className="text-muted/40 hover:text-muted transition-colors">
                <SmilePlus size={16} />
              </button>
              <button onClick={sendMessage} className="text-primary hover:text-cyan-300 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-panel border border-white/[0.08] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 transition-colors duration-300">
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-2">Invitar a {room.name}</h3>
              <p className="text-sm text-muted/80 mb-4">
                Comparte este enlace con tus amigos para que se unan a la sala.
              </p>
              <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] rounded-lg p-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://studyroom.app/join/${room.id}`}
                  className="flex-1 bg-transparent text-sm text-white/70 outline-none px-2"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://studyroom.app/join/${room.id}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`p-2 rounded-md transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="mt-5 flex justify-end">
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm text-muted hover:text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomView;
