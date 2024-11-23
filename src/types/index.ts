export interface Reciter {
  id: number;
  name: string;
  assigned_juz: number | null;
  completed: boolean;
  username: string;
  can_edit: boolean;
}

export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}