import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Reciter } from "@/types";

interface ReciterCardProps {
  reciter: Reciter;
  isAdmin: boolean;
  onComplete: (id: number, completed: boolean) => void;
}

const ReciterCard = ({ reciter, isAdmin, onComplete }: ReciterCardProps) => {
  const handleComplete = () => {
    onComplete(reciter.id, !reciter.completed);
    toast({
      title: "Status Updated",
      description: `${reciter.name}'s progress has been updated.`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{reciter.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Assigned Juz':</p>
            <p className="text-lg font-medium">
              {reciter.assignedJuz ? `Juz' ${reciter.assignedJuz}` : "Not assigned"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`complete-${reciter.id}`}
              checked={reciter.completed}
              onCheckedChange={handleComplete}
              disabled={!reciter.assignedJuz || (reciter.completed && !isAdmin)}
              className="h-6 w-6"
            />
            <label htmlFor={`complete-${reciter.id}`} className="text-sm font-medium">
              Completed
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReciterCard;