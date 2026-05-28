import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Users, PhoneCall, VideoOff, MicOff, PhoneMissed, PhoneForwarded, Phone } from 'lucide-react';

type Tab = 'chats' | 'friends' | 'calls';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('calls');
  const [inCall, setInCall] = useState(false);

  return (
    <PageWrapper ariaLabel="Panel de control">
      <div className="w-full flex-1 flex flex-col md:flex-row gap-8 p-2">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-3 shrink-0">
          <div className="glass-panel p-3 rounded-2xl flex-grow md:flex-grow-0 flex flex-row md:flex-col gap-2 shadow-lg">
            <button 
              onClick={() => {setActiveTab('calls'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'calls' ? 'bg-primary/10 text-white border-l-2 border-primary shadow-[inset_4px_0_0_0_rgba(0,240,255,0.5)]' : 'text-muted hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
            >
              <PhoneCall size={18} className={activeTab === 'calls' ? 'text-primary' : ''} />
              <span className="font-medium text-sm hidden md:block">Llamadas y Salas</span>
            </button>
            <button 
              onClick={() => {setActiveTab('chats'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'chats' ? 'bg-primary/10 text-white border-l-2 border-primary shadow-[inset_4px_0_0_0_rgba(0,240,255,0.5)]' : 'text-muted hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
            >
              <MessageSquare size={18} className={activeTab === 'chats' ? 'text-primary' : ''} />
              <span className="font-medium text-sm hidden md:block">Chats Recientes</span>
            </button>
            <button 
              onClick={() => {setActiveTab('friends'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'friends' ? 'bg-primary/10 text-white border-l-2 border-primary shadow-[inset_4px_0_0_0_rgba(0,240,255,0.5)]' : 'text-muted hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
            >
              <Users size={18} className={activeTab === 'friends' ? 'text-primary' : ''} />
              <span className="font-medium text-sm hidden md:block">Amigos</span>
            </button>
          </div>
          
          <div className="glass-panel p-5 rounded-2xl hidden md:block mt-auto text-sm text-muted shadow-lg">
            Conectado como <br/>
            <span className="text-white font-medium text-base tracking-wide">@{user?.username || 'usuario'}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow glass-panel rounded-2xl overflow-hidden flex flex-col relative shadow-xl border border-white/5">
          
          {/* Llamadas y Salas View */}
          {activeTab === 'calls' && (
            <div className="flex-grow flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white/90 flex items-center gap-2">
                  <PhoneCall size={18} className="text-primary" />
                  Salas de Estudio
                </h2>
              </div>
              
              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                {!inCall ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((room) => (
                      <div key={room} className="bg-surface/50 border border-white/5 rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex justify-between items-start mb-5">
                          <h3 className="font-medium text-base text-white/90">Sala de Estudio {room}</h3>
                          <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Activa
                          </span>
                        </div>
                        <div className="flex -space-x-3 mb-8 pl-2">
                          <img src={`https://i.pravatar.cc/150?u=user${room}1`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-30 relative transition-transform duration-300 group-hover:scale-110" />
                          <img src={`https://i.pravatar.cc/150?u=user${room}2`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-20 relative transition-transform duration-300 group-hover:scale-110 delay-75" />
                          <img src={`https://i.pravatar.cc/150?u=user${room}3`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-10 relative transition-transform duration-300 group-hover:scale-110 delay-150" />
                          <div className="w-9 h-9 rounded-full border-2 border-surface bg-white/5 flex items-center justify-center text-xs text-white/70 relative z-0 backdrop-blur-sm">+2</div>
                        </div>
                        <button 
                          onClick={() => setInCall(true)}
                          className="w-full py-2.5 bg-white/5 hover:bg-primary hover:text-white text-primary/90 rounded-xl transition-all duration-300 font-medium text-sm flex justify-center items-center gap-2"
                        >
                          <PhoneForwarded size={16} />
                          Unirse a la Sala
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center relative animate-in zoom-in-95 duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-xl pointer-events-none"></div>
                    
                    {/* Fake Call UI */}
                    <div className="w-full max-w-3xl aspect-video bg-black/60 rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl flex items-center justify-center backdrop-blur-md">
                      <div className="grid grid-cols-2 w-full h-full gap-2 p-2">
                        <div className="bg-surface/80 relative rounded-2xl overflow-hidden flex items-center justify-center group">
                          <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'user'}`} className="w-32 h-32 rounded-full opacity-60 object-cover" />
                          <div className="absolute bottom-4 left-4 bg-black/40 px-3 py-1.5 rounded-lg text-xs text-white/90 backdrop-blur-md">Tú (Hablando)</div>
                          <div className="absolute inset-0 border border-primary/30 rounded-2xl animate-pulse"></div>
                        </div>
                        <div className="bg-surface/80 relative rounded-2xl overflow-hidden flex items-center justify-center">
                          <img src="https://i.pravatar.cc/150?u=admin" className="w-32 h-32 rounded-full opacity-60 object-cover" />
                          <div className="absolute bottom-4 left-4 bg-black/40 px-3 py-1.5 rounded-lg text-xs text-white/90 backdrop-blur-md">Admin</div>
                        </div>
                      </div>
                      
                      {/* Call Controls */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black/40 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                        <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300">
                          <MicOff size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300">
                          <VideoOff size={20} />
                        </button>
                        <button 
                          onClick={() => setInCall(false)}
                          className="w-14 h-14 rounded-xl bg-red-500/90 hover:bg-red-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                        >
                          <PhoneMissed size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chats View */}
          {activeTab === 'chats' && (
            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white/90 flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  Mensajes Directos
                </h2>
              </div>
              <div className="flex-grow flex items-center justify-center flex-col text-muted/70">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                  <MessageSquare size={40} className="opacity-40" />
                </div>
                <p className="font-medium text-white/60 mb-1">No tienes chats recientes</p>
                <p className="text-sm">Empieza a hablar con tus amigos.</p>
              </div>
            </div>
          )}

          {/* Friends View */}
          {activeTab === 'friends' && (
            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white/90 flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Tus Amigos
                </h2>
                <button className="text-xs font-medium bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors duration-300">
                  Añadir Amigo
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    {name: 'Admin', status: 'En línea', handle: 'admin'},
                    {name: 'Carlos', status: 'Ausente', handle: 'carlos_dev'},
                    {name: 'María', status: 'Desconectado', handle: 'mary99'},
                  ].map((friend, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/5 rounded-2xl transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={`https://i.pravatar.cc/150?u=${friend.handle}`} className="w-11 h-11 rounded-full transition-transform duration-300 group-hover:scale-105" />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-surface rounded-full ${friend.status === 'En línea' ? 'bg-green-500' : friend.status === 'Ausente' ? 'bg-yellow-500' : 'bg-gray-500/50'}`}></div>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white/90">{friend.name}</p>
                          <p className="text-xs text-muted/70">{friend.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2.5 text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                          <MessageSquare size={16} />
                        </button>
                        <button className="p-2.5 text-muted hover:text-green-400 hover:bg-green-400/10 rounded-xl transition-colors">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage; 