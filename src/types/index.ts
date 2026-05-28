export interface User {
  id: string;
  uid?: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}
