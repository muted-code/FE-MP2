import React from 'react';
import type { Room } from '../../types';
import { Hash, Plus, Users, Volume2, ChevronDown, Search, Trash2 } from 'lucide-react';

export interface Friend {
  name: string;
  status: string;
  handle: string;
}

export const FRIENDS_LIST: Friend[] = [
  { name: 'Admin', status: 'online', handle: 'admin' },
  { name: 'Carlos', status: 'idle', handle: 'carlos_dev' },
  { name: 'María', status: 'offline', handle: 'mary99' },
];

interface Props {
  rooms: Room[];
  selectedRoomId: string | null;
  selectedFriendHandle: string | null;
  onSelectRoom: (id: string) => void;
  onSelectFriend: (handle: string) => void;
  onCreateRoom: () => void;
  loadingRooms: boolean;
  user?: any;
  onDeleteRoom?: (id: string) => void;
}

const ChannelSidebar: React.FC<Props> = ({ rooms, selectedRoomId, selectedFriendHandle, onSelectRoom, onSelectFriend, onCreateRoom, loadingRooms, user, onDeleteRoom }) => {
  return (
    <div className="w-60 flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-dash-sidebar/80 transition-colors duration-300">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-white/[0.06] hover:bg-white/[0.03] cursor-pointer transition-colors">
        <span className="font-semibold text-[15px] text-white truncate">Study Room</span>
        <ChevronDown size={16} className="text-muted shrink-0" />
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-black/30 rounded text-muted text-xs cursor-pointer hover:bg-black/40 transition-colors">
          <Search size={14} />
          <span>Buscar</span>
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4 custom-scrollbar">
        {/* Voice Channels = Rooms */}
        <div>
          <div className="flex items-center justify-between px-1 mb-1 group">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/70 group-hover:text-muted transition-colors">
              Llamadas
            </span>
            <button 
              onClick={onCreateRoom}
              className="text-muted/70 hover:text-white transition-colors p-0.5 rounded hover:bg-white/10"
              title="Crear sala"
            >
              <Plus size={14} />
            </button>
          </div>

          {loadingRooms ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary/50"></div>
            </div>
          ) : rooms.length === 0 ? (
            <button 
              onClick={onCreateRoom}
              className="w-full text-left px-2 py-1.5 text-muted/60 text-sm hover:text-muted transition-colors rounded"
            >
              + Crear primera sala...
            </button>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="relative group/ch w-full flex items-center">
                <button
                  onClick={() => onSelectRoom(room.id)}
                  className={`flex-1 flex items-center gap-1.5 px-2 py-[5px] rounded text-sm transition-all pr-8 ${
                    selectedRoomId === room.id
                      ? 'bg-white/[0.08] text-white'
                      : 'text-muted/80 hover:text-white/90 hover:bg-white/[0.04]'
                  }`}
                >
                  <Volume2 size={18} className={`shrink-0 ${selectedRoomId === room.id ? 'text-primary' : 'text-muted/50'}`} />
                  <span className="truncate">{room.name}</span>
                </button>
                
                {(user?.id === room.createdBy || user?.uid === room.createdBy) && onDeleteRoom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('¿Eliminar esta sala?')) {
                        onDeleteRoom(room.id);
                      }
                    }}
                    className="absolute right-1 opacity-0 group-hover/ch:opacity-100 p-1 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                    title="Eliminar sala"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Text Channels (placeholder) */}
        <div>
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/70">
              Canales de Texto
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-[5px] rounded text-sm text-muted/80 hover:text-white/90 hover:bg-white/[0.04] transition-all cursor-pointer">
            <Hash size={18} className="text-muted/50 shrink-0" />
            <span>general</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-[5px] rounded text-sm text-muted/80 hover:text-white/90 hover:bg-white/[0.04] transition-all cursor-pointer">
            <Hash size={18} className="text-muted/50 shrink-0" />
            <span>ayuda</span>
          </div>
        </div>

        {/* Friends */}
        <div>
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/70">
              En Línea — 1
            </span>
          </div>
          {FRIENDS_LIST.map((friend, i) => (
            <div
              key={i}
              onClick={() => onSelectFriend(friend.handle)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer group/f ${
                selectedFriendHandle === friend.handle
                  ? 'bg-white/[0.08] text-white'
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className="relative shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${friend.handle}`} alt={friend.name} className="w-8 h-8 rounded-full" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#0d0e14] rounded-full ${
                  friend.status === 'online' ? 'bg-green-500' : friend.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm truncate transition-colors ${
                  selectedFriendHandle === friend.handle ? 'text-white' : 'text-muted/90 group-hover/f:text-white'
                }`}>{friend.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Bar at bottom */}
      <div className="px-2 py-2 border-t border-white/[0.06] bg-black/20">
        <div className="flex items-center gap-2 px-1">
          <div className="relative">
            <Users size={16} className="text-primary" />
          </div>
          <span className="text-xs text-muted truncate">Conectado</span>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
