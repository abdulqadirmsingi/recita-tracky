import { useState } from "react";
import ReciterCard from "@/components/ReciterCard";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Reciter } from "@/types";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [reciters, setReciters] = useState<Reciter[]>([
    { id: 1, name: "Reciter 1", assignedJuz: null, completed: false },
    { id: 2, name: "Reciter 2", assignedJuz: null, completed: false },
    { id: 3, name: "Reciter 3", assignedJuz: null, completed: false },
    { id: 4, name: "Reciter 4", assignedJuz: null, completed: false },
    { id: 5, name: "Reciter 5", assignedJuz: null, completed: false },
    { id: 6, name: "Reciter 6", assignedJuz: null, completed: false },
  ]);

  const handleAssignJuz = (reciterId: number, juz: number) => {
    setReciters((prev) =>
      prev.map((reciter) =>
        reciter.id === reciterId
          ? { ...reciter, assignedJuz: juz, completed: false }
          : reciter
      )
    );
  };

  const handleComplete = (id: number, completed: boolean) => {
    setReciters((prev) =>
      prev.map((reciter) =>
        reciter.id === id ? { ...reciter, completed } : reciter
      )
    );
  };

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