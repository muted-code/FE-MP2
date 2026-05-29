import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Importamos getRoomById para poder cargar la sala mediante el ID
import { getRooms, createRoom, deleteRoom, updateRoom, getRoomById } from '../services/roomService';
import { socket } from '../services/socket';
import type { Room } from '../types';
import Toast from '../components/ui/Toast';
import ChannelSidebar, { FRIENDS_LIST } from '../components/dashboard/ChannelSidebar';
import RoomView from '../components/dashboard/RoomView';
import DirectMessageView from '../components/dashboard/DirectMessageView';
import Navbar from '../components/layout/Navbar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedFriendHandle, setSelectedFriendHandle] = useState<string | null>(null);
  
  // Estados para Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  
  // Estados para Editar Sala
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [editRoomName, setEditRoomName] = useState('');

  // NUEVO: Estados para Unirse a Sala por ID
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  
  const [toast, setToast] = useState({ isOpen: false, message: '', description: '', type: 'success' as any });

  useEffect(() => {
    fetchRooms();
    
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
  }, [user]);

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
      setRooms(prevRooms => [...prevRooms, created]);
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

  // NUEVA FUNCIÓN: Lógica para unirse mediante ID
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = joinRoomIdInput.trim();
    if (!targetId) return;

    try {
      // 1. Verificamos si ya estás en esa sala
      const alreadyExists = rooms.find(r => r.id === targetId);
      if (alreadyExists) {
        setSelectedRoomId(alreadyExists.id);
        setShowJoinModal(false);
        setJoinRoomIdInput('');
        return;
      }

      // 2. Si no, buscamos la sala en el backend usando el ID
      const joinedRoom = await getRoomById(targetId);
      
      // 3. Añadimos la sala a tu lista visual y entramos en ella
      setRooms(prev => [...prev, joinedRoom]);
      setSelectedRoomId(joinedRoom.id);
      setShowJoinModal(false);
      setJoinRoomIdInput('');
      setToast({ isOpen: true, message: 'Unido con éxito', description: `Te has unido a "${joinedRoom.name}".`, type: 'success' });
      
    } catch (err) {
      console.error('Error joining room:', err);
      setToast({ isOpen: true, message: 'ID Inválido', description: 'La sala no existe o el ID es incorrecto.', type: 'error' });
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomToEdit || !editRoomName.trim()) return;

    try {
      await updateRoom(roomToEdit.id, editRoomName);
      setRooms(prevRooms => prevRooms.map((r) => (r.id === roomToEdit.id ? { ...r, name: editRoomName.trim() } : r)));
      setRoomToEdit(null);
      setToast({ isOpen: true, message: 'Sala actualizada', description: 'El nombre se cambió correctamente.', type: 'success' });
    } catch (err) {
      console.error('Error updating room:', err);
      setToast({ isOpen: true, message: 'Error', description: 'No se pudo actualizar el nombre.', type: 'error' });
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

  const handleRequestDelete = (roomId: string) => {
    setRoomToDelete(roomId);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      await deleteRoom(roomToDelete);
      setRooms(prevRooms => prevRooms.filter((r) => r.id !== roomToDelete));
      if (selectedRoomId === roomToDelete) {
        setSelectedRoomId(null);
      }
      setToast({ isOpen: true, message: 'Sala eliminada', description: 'La sala de estudio ha sido eliminada.', type: 'success' });
    } catch (err) {
      console.error('Error deleting room:', err);
      setToast({ isOpen: true, message: 'Error', description: 'No tienes permiso o no se pudo eliminar.', type: 'error' });
    } finally {
      setRoomToDelete(null);
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
          onJoinRoomClick={() => setShowJoinModal(true)} // <-- Pasamos la función para abrir el modal
          loadingRooms={loadingRooms}
          user={user}
          onDeleteRoom={handleRequestDelete}
          onEditRoom={(room: Room) => {
            setRoomToEdit(room);
            setEditRoomName(room.name);
          }}
        />

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

      {/* Modal de Crear Sala */}
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

      {/* NUEVO: Modal de Unirse a Sala por ID */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-panel border border-white/[0.08] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 transition-colors duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">Unirse a una Sala</h3>
              <p className="text-sm text-muted/60 mb-5">Introduce el ID de la sala que te compartieron tus amigos.</p>
              <form onSubmit={handleJoinRoom}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted/70 mb-2">
                  ID de la Sala
                </label>
                <input 
                  type="text" 
                  value={joinRoomIdInput} 
                  onChange={(e) => setJoinRoomIdInput(e.target.value)} 
                  className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted/30" 
                  placeholder="Ej: uUyAmdTOGxKMfyGlkPjR" 
                  autoFocus 
                  required 
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setShowJoinModal(false); setJoinRoomIdInput(''); }} 
                    className="px-4 py-2 text-sm text-muted hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-primary hover:bg-cyan-400 text-white text-sm rounded-lg font-medium transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  >
                    Unirse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Nombre de Sala */}
      {roomToEdit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-panel border border-white/[0.08] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">Editar Sala</h3>
              <p className="text-sm text-muted/60 mb-5">Modifica el nombre identificativo del espacio de estudio.</p>
              <form onSubmit={handleUpdateRoom}>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted/70 mb-2">
                  Nuevo nombre de la sala
                </label>
                <input
                  type="text"
                  value={editRoomName}
                  onChange={(e) => setEditRoomName(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  autoFocus
                  required
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setRoomToEdit(null)}
                    className="px-4 py-2 text-sm text-muted hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-cyan-400 text-white text-sm rounded-lg font-medium transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar Sala */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-panel border border-red-500/20 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] w-full max-w-sm overflow-hidden transition-all duration-300 transform scale-100">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">¿Eliminar esta sala?</h3>
              <p className="text-sm text-muted/70 text-center mb-6">
                Esta acción es irreversible. Se eliminará el espacio y todos perderán acceso.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRoomToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors w-full"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteRoom}
                  className="px-4 py-2 text-sm font-medium bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] w-full"
                >
                  Sí, eliminar
                </button>
              </div>
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