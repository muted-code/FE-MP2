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
      <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 p-4">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 shrink-0">
          <div className="glass-panel p-4 rounded-2xl flex-grow md:flex-grow-0 flex flex-row md:flex-col gap-2">
            <button 
              onClick={() => {setActiveTab('calls'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calls' ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-muted hover:bg-white/5 hover:text-white'}`}
            >
              <PhoneCall size={20} className={activeTab === 'calls' ? 'text-primary' : ''} />
              <span className="font-medium hidden md:block">Llamadas y Salas</span>
            </button>
            <button 
              onClick={() => {setActiveTab('chats'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chats' ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-muted hover:bg-white/5 hover:text-white'}`}
            >
              <MessageSquare size={20} className={activeTab === 'chats' ? 'text-primary' : ''} />
              <span className="font-medium hidden md:block">Chats Recientes</span>
            </button>
            <button 
              onClick={() => {setActiveTab('friends'); setInCall(false);}}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'friends' ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-muted hover:bg-white/5 hover:text-white'}`}
            >
              <Users size={20} className={activeTab === 'friends' ? 'text-primary' : ''} />
              <span className="font-medium hidden md:block">Amigos</span>
            </button>
          </div>
          
          <div className="glass-panel p-4 rounded-2xl hidden md:block mt-auto text-sm text-muted">
            Conectado como <br/>
            <span className="text-white font-semibold">@{user?.username}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow glass-panel rounded-2xl overflow-hidden flex flex-col relative">
          
          {/* Llamadas y Salas View */}
          {activeTab === 'calls' && (
            <div className="flex-grow flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PhoneCall className="text-primary" />
                  Salas de Estudio y Llamadas
                </h2>
              </div>
              
              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                {!inCall ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((room) => (
                      <div key={room} className="bg-surface border border-white/10 rounded-xl p-5 hover:border-primary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-white">Sala de Estudio {room}</h3>
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Activa
                          </span>
                        </div>
                        <div className="flex -space-x-3 mb-6 pl-3">
                          <img src={`https://i.pravatar.cc/150?u=user${room}1`} alt="user" className="w-8 h-8 rounded-full border-2 border-surface z-30 relative" />
                          <img src={`https://i.pravatar.cc/150?u=user${room}2`} alt="user" className="w-8 h-8 rounded-full border-2 border-surface z-20 relative" />
                          <img src={`https://i.pravatar.cc/150?u=user${room}3`} alt="user" className="w-8 h-8 rounded-full border-2 border-surface z-10 relative" />
                          <div className="w-8 h-8 rounded-full border-2 border-surface bg-white/10 flex items-center justify-center text-xs text-white relative z-0">+2</div>
                        </div>
                        <button 
                          onClick={() => setInCall(true)}
                          className="w-full py-2 bg-white/10 hover:bg-primary hover:text-white text-primary rounded-lg transition-colors font-medium flex justify-center items-center gap-2"
                        >
                          <PhoneForwarded size={16} />
                          Unirse a la Sala
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-xl pointer-events-none"></div>
                    
                    {/* Fake Call UI */}
                    <div className="w-full max-w-3xl aspect-video bg-black/50 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 w-full h-full gap-1 p-1">
                        <div className="bg-surface relative rounded-lg overflow-hidden flex items-center justify-center group">
                          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} className="w-24 h-24 rounded-full opacity-50 object-cover" />
                          <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">Tú (Hablando)</div>
                          <div className="absolute inset-0 border-2 border-primary/50 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="bg-surface relative rounded-lg overflow-hidden flex items-center justify-center">
                          <img src="https://i.pravatar.cc/150?u=admin" className="w-24 h-24 rounded-full opacity-50 object-cover" />
                          <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">Admin</div>
                        </div>
                      </div>
                      
                      {/* Call Controls */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 p-3 rounded-full backdrop-blur-md border border-white/10">
                        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                          <MicOff size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                          <VideoOff size={20} />
                        </button>
                        <button 
                          onClick={() => setInCall(false)}
                          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all hover:scale-105"
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
            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="text-primary" />
                  Mensajes Directos
                </h2>
              </div>
              <div className="flex-grow flex items-center justify-center flex-col text-muted">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>No tienes chats recientes.</p>
                <p className="text-sm">Empieza a hablar con tus amigos.</p>
              </div>
            </div>
          )}

          {/* Friends View */}
          {activeTab === 'friends' && (
            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="text-primary" />
                  Tus Amigos
                </h2>
                <button className="text-sm bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  Añadir Amigo
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {[
                    {name: 'Admin', status: 'En línea', handle: 'admin'},
                    {name: 'Carlos', status: 'Ausente', handle: 'carlos_dev'},
                    {name: 'María', status: 'Desconectado', handle: 'mary99'},
                  ].map((friend, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={`https://i.pravatar.cc/150?u=${friend.handle}`} className="w-12 h-12 rounded-full" />
                          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-surface rounded-full ${friend.status === 'En línea' ? 'bg-green-500' : friend.status === 'Ausente' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{friend.name}</p>
                          <p className="text-xs text-muted">{friend.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <MessageSquare size={18} />
                        </button>
                        <button className="p-2 text-muted hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors">
                          <Phone size={18} />
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
