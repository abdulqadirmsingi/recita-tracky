import { useState } from "react";
import ReciterCard from "@/components/ReciterCard";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Index = () => {
  const { isAdmin, logout } = useAuth();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch reciters
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/reciters', {
        headers
      });
      if (!response.ok) throw new Error('Failed to fetch reciters');
      return response.json();
    },
  });

  // Assign Juz mutation
  const assignJuzMutation = useMutation({
    mutationFn: async ({ reciterId, juz }: { reciterId: number; juz: number }) => {
      const response = await fetch(`http://localhost:3001/api/reciters/${reciterId}/assign`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ juz }),
      });
      if (!response.ok) throw new Error('Failed to assign Juz');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reciters'] });
      toast.success("Juz assigned successfully");
    },
    onError: () => {
      toast.error("Failed to assign Juz");
    },
  });

  // Complete Juz mutation
  const completeMutation = useMutation({
    mutationFn: async ({ reciterId, completed }: { reciterId: number; completed: boolean }) => {
      const response = await fetch(`http://localhost:3001/api/reciters/${reciterId}/complete`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to update completion status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reciters'] });
      toast.success("Progress updated successfully");
    },
    onError: () => {
      toast.error("Failed to update progress");
    },
  });

  const handleAssignJuz = (reciterId: number, juz: number) => {
    assignJuzMutation.mutate({ reciterId, juz });
  };

  const handleComplete = (id: number, completed: boolean) => {
    completeMutation.mutate({ reciterId: id, completed });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#FFFBF5] p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Quran Recitation Tracker
          </h1>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </div>

        {isAdmin && <AdminPanel reciters={reciters} onAssignJuz={handleAssignJuz} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reciters.map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              isAdmin={isAdmin}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;