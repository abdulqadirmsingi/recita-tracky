import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reciter } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AdminPanelProps {
  reciters: Reciter[];
  onAssignJuz: (reciterId: number, juz: number) => void;
}

const AdminPanel = ({ reciters, onAssignJuz }: AdminPanelProps) => {
  const handleAssign = (reciterId: number, juz: string) => {
    console.log('AdminPanel handleAssign:', { reciterId, juz });
    const juzNumber = parseInt(juz);
    
    // Check if this Juz is already assigned to another reciter
    const isJuzAssigned = reciters.some(
      reciter => reciter.assigned_juz === juzNumber && reciter.id !== reciterId
    );

    if (isJuzAssigned) {
      toast({
        title: "Assignment Failed",
        description: `Juz' ${juz} is already assigned to another reciter`,
        variant: "destructive"
      });
      return;
    }

    onAssignJuz(reciterId, juzNumber);
    toast({
      title: "Juz' Assigned",
      description: `Successfully assigned Juz' ${juz}`,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
      <div className="space-y-4">
        {reciters.map((reciter) => (
          <div key={reciter.id} className="flex items-center justify-between">
            <span className="font-medium">{reciter.name}</span>
            <div className="flex items-center space-x-2">
              <Select
                value={reciter.assigned_juz?.toString()}
                onValueChange={(value) => handleAssign(reciter.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Juz'" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(30)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Juz' {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;