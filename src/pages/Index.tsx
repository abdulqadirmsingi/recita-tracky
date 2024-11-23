import { useState, useEffect } from "react";
import ReciterCard from "@/components/ReciterCard";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Reciter } from "@/types";
import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  // Fetch reciters
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: api.getReciters,
  });

  // Assign Juz mutation
  const assignJuzMutation = useMutation({
    mutationFn: ({ reciterId, juz }: { reciterId: number; juz: number }) =>
      api.assignJuz(reciterId, juz),
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
    mutationFn: ({ reciterId, completed }: { reciterId: number; completed: boolean }) =>
      api.updateCompletion(reciterId, completed),
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
          <Button
            onClick={() => setIsAdmin(!isAdmin)}
            variant={isAdmin ? "destructive" : "default"}
          >
            {isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}
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