import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getRooms, createRoom, deleteRoom } from '../services/roomService';
import { socket } from '../services/socket';
import type { Room } from '../types';
import Toast from '../components/ui/Toast';
import ChannelSidebar, { FRIENDS_LIST } from '../components/dashboard/ChannelSidebar';
import RoomView from '../components/dashboard/RoomView';
import DirectMessageView from '../components/dashboard/DirectMessageView';
import Navbar from '../components/layout/Navbar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedFriendHandle, setSelectedFriendHandle] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [toast, setToast] = useState({ isOpen: false, message: '', description: '', type: 'success' as any });

  useEffect(() => {
    fetchRooms();
    
    // Conectar socket
    if (user) {
      socket.auth = { username: user.username || user.name };
      socket.connect();
    }
    
    socket.on('connect', () => {
      console.log('Conectado al servidor de Sockets:', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setToast({ isOpen: true, message: 'Error', description: 'No se pudieron cargar las salas.', type: 'error' });
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const created = await createRoom(newRoomName);
      setRooms([...rooms, created]);
      setNewRoomName('');
      setShowCreateModal(false);
      setSelectedRoomId(created.id);
      setSelectedFriendHandle(null);
      setToast({ isOpen: true, message: 'Sala creada', description: `"${created.name}" está lista para usar.`, type: 'success' });
    } catch (err) {
      console.error('Error creating room:', err);
      setToast({ isOpen: true, message: 'Error', description: 'Ocurrió un error al crear la sala.', type: 'error' });
    }
  };

  const handleSelectRoom = (id: string) => {
    setSelectedRoomId(id);
    setSelectedFriendHandle(null);
  };

  const handleSelectFriend = (handle: string) => {
    setSelectedFriendHandle(handle);
    setSelectedRoomId(null);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter((r) => r.id !== roomId));
      if (selectedRoomId === roomId) {
        setSelectedRoomId(null);
      }
      setToast({ isOpen: true, message: 'Sala eliminada', description: 'La sala de estudio ha sido eliminada.', type: 'success' });
    } catch (err) {
      console.error('Error deleting room:', err);
      setToast({ isOpen: true, message: 'Error', description: 'No tienes permiso o no se pudo eliminar.', type: 'error' });
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;
  const selectedFriend = FRIENDS_LIST.find(f => f.handle === selectedFriendHandle) || null;

  return (
    <div className="h-screen flex flex-col bg-dash-bg overflow-hidden transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex min-h-0">
        <ChannelSidebar
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          selectedFriendHandle={selectedFriendHandle}
          onSelectRoom={handleSelectRoom}
          onSelectFriend={handleSelectFriend}
          onCreateRoom={() => setShowCreateModal(true)}
          loadingRooms={loadingRooms}
          user={user}
          onDeleteRoom={handleDeleteRoom}
        />

        {/* Main Content: Room or DM */}
        {selectedFriend ? (
          <DirectMessageView
            friend={selectedFriend}
            userName={user?.name || 'Tú'}
            userAvatar={user?.avatar || undefined}
            onBack={() => setSelectedFriendHandle(null)}
          />
        ) : (
          <RoomView
            room={selectedRoom}
            user={user}
            onLeave={() => setSelectedRoomId(null)}
          />
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-panel border border-white/[0.08] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">Crear Nueva Sala</h3>
              <p className="text-sm text-muted/60 mb-5">Crea un espacio de estudio para colaborar con otros.</p>
              <form onSubmit={handleCreateRoom}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted/70 mb-2">
                  Nombre de la sala
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted/30"
                  placeholder="Ej: Cálculo Diferencial"
                  autoFocus
                  required
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowCreateModal(false); setNewRoomName(''); }}
                    className="px-4 py-2 text-sm text-muted hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-cyan-400 text-white text-sm rounded-lg font-medium transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  >
                    Crear Sala
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        description={toast.description}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default DashboardPage;
