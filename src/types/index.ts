export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  createdAt: string;
}
