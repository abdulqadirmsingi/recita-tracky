export interface Reciter {
  id: number;
  name: string;
  assignedJuz: number | null;
  completed: boolean;
}

export interface AdminState {
  isAdmin: boolean;
}