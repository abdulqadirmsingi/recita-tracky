export interface Reciter {
  id: number;
  name: string;
  assigned_juz: number | null;
  completed: boolean;
}

export interface AdminState {
  isAdmin: boolean;
}