import axios from 'axios';
import { Reciter } from '@/types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Reciters
  getReciters: async () => {
    const response = await axios.get(`${API_URL}/reciters`);
    return response.data;
  },

  assignJuz: async (reciterId: number, juz: number) => {
    const response = await axios.put(`${API_URL}/reciters/${reciterId}/assign`, { juz });
    return response.data;
  },

  updateCompletion: async (reciterId: number, completed: boolean) => {
    const response = await axios.put(`${API_URL}/reciters/${reciterId}/complete`, { completed });
    return response.data;
  },
};