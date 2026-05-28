import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { 
  MessageSquare, Users, PhoneCall, VideoOff, MicOff, PhoneMissed, 
  PhoneForwarded, Phone, Plus, X, Hash, Settings as SettingsIcon, 
  Lock, Unlock, ChevronDown, AlertCircle 
} from 'lucide-react';

type Tab = 'chats' | 'friends' | 'calls';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('calls');
  const [inCall, setInCall] = useState(false);
  
  // Estados para la creación de salas
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false); // Estado para el Dropdown custom
  const [formError, setFormError] = useState(''); // Estado para manejar errores de UX
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    topic: '',
    isPrivate: false,
    maxUsers: 10
  });

  const capacityOptions = [
    { value: 2, label: '2 Usuarios' },
    { value: 5, label: '5 Usuarios' },
    { value: 10, label: '10 Usuarios' },
    { value: 0, label: 'Ilimitado' }
  ];

  // Mock de salas simulando respuesta de DB
  const mockRooms = [
    { id: 1, name: 'Sala de Estudio 1', users: 5 },
    { id: 2, name: 'Sala de Estudio 2', users: 3 },
    { id: 3, name: 'Sala de Estudio 3', users: 4 },
  ];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación UX: Evitar campos vacíos
    if (!newRoom.name.trim()) {
      setFormError('El nombre de la sala es obligatorio.');
      return;
    }

    console.log('Creando sala en Firebase:', newRoom);
    
    // Reseteo exitoso
    setFormError('');
    setShowCreateModal(false);
    setNewRoom({ name: '', topic: '', isPrivate: false, maxUsers: 10 });
  };

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
                {!inCall && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Nueva Sala</span>
                  </button>
                )}
              </div>
              
              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                {!inCall ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockRooms.slice(0, 6).map((room) => (
                      <div key={room.id} className="bg-surface/50 border border-white/5 rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex justify-between items-start mb-5">
                          <h3 className="font-medium text-base text-white/90">{room.name}</h3>
                          <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Activa
                          </span>
                        </div>
                        <div className="flex -space-x-3 mb-8 pl-2">
                          <img src={`https://i.pravatar.cc/150?u=user${room.id}1`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-30 relative transition-transform duration-300 group-hover:scale-110" />
                          <img src={`https://i.pravatar.cc/150?u=user${room.id}2`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-20 relative transition-transform duration-300 group-hover:scale-110 delay-75" />
                          <img src={`https://i.pravatar.cc/150?u=user${room.id}3`} alt="user" className="w-9 h-9 rounded-full border-2 border-surface z-10 relative transition-transform duration-300 group-hover:scale-110 delay-150" />
                          <div className="w-9 h-9 rounded-full border-2 border-surface bg-white/5 flex items-center justify-center text-xs text-white/70 relative z-0 backdrop-blur-sm">+{room.users - 3}</div>
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

          {/* ... (Chats y Friends View se mantienen igual que en tu código anterior) */}
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

          {activeTab === 'friends' && (
            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-medium text-white/90 flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Tus Amigos
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {/* Contenido de amigos */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Creación Mejorado con UX Validation y Custom Dropdown */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="glass-panel border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl transform transition-all flex flex-col overflow-visible">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-medium text-white/90">Nueva Sala</h3>
                <p className="text-sm text-muted mt-1">Configura el espacio para tu equipo.</p>
              </div>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError(''); // Limpiar errores al cerrar
                }}
                className="text-muted hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6 space-y-5">
              
              {/* Alerta de Error UX */}
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" /> Nombre de la Sala
                </label>
                <input
                  type="text"
                  placeholder="Ej. Diseño UI/UX"
                  value={newRoom.name}
                  onChange={(e) => {
                    setNewRoom({...newRoom, name: e.target.value});
                    if (formError) setFormError(''); // Limpiar error al escribir
                  }}
                  className={`w-full bg-surface/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 transition-all placeholder:text-muted/50 ${
                    formError 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-primary/50 focus:ring-primary/50'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-primary" /> Tema principal <span className="text-muted text-xs font-normal">(Opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="¿De qué se hablará aquí?"
                  value={newRoom.topic}
                  onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                  className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Dropdown Custom para Capacidad */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Capacidad
                  </label>
                  
                  <div 
                    onClick={() => setIsCapacityOpen(!isCapacityOpen)}
                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white flex justify-between items-center cursor-pointer hover:border-white/20 transition-all"
                  >
                    <span className="text-sm">
                      {capacityOptions.find(opt => opt.value === newRoom.maxUsers)?.label}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isCapacityOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Menú Desplegable Custom */}
                  {isCapacityOpen && (
                    <>
                      {/* Overlay invisible para cerrar al hacer click afuera */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsCapacityOpen(false)} />
                      <div className="absolute top-full left-0 w-full mt-2 bg-[#0f1522] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                        {capacityOptions.map((option) => (
                          <div 
                            key={option.value}
                            onClick={() => {
                              setNewRoom({...newRoom, maxUsers: option.value});
                              setIsCapacityOpen(false);
                            }}
                            className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                              newRoom.maxUsers === option.value 
                                ? 'bg-primary/20 text-primary font-medium' 
                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    {newRoom.isPrivate ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4 text-primary" />}
                    Privacidad
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewRoom({...newRoom, isPrivate: !newRoom.isPrivate})}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                      newRoom.isPrivate 
                        ? 'bg-primary/10 border-primary/30 text-primary' 
                        : 'bg-surface/50 border-white/10 text-white/80'
                    }`}
                  >
                    <span className="font-medium text-sm">{newRoom.isPrivate ? 'Privada' : 'Pública'}</span>
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${newRoom.isPrivate ? 'border-primary bg-primary' : 'border-muted'}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError('');
                  }}
                  className="flex-1 py-3 px-4 bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 rounded-xl transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary text-black hover:bg-primary/90 rounded-xl transition-all duration-300 font-semibold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
                >
                  Crear Sala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default DashboardPage; 