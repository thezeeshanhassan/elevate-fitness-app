
import { Workout } from '@/pages/Workouts';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Exercise } from '@/pages/WorkoutDetail';

interface WorkoutListProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  onToggleComplete: (workoutId: string) => void;
  onView: (workoutId: string) => void;
}

const WorkoutList = ({ workouts, onEdit, onDelete, onToggleComplete, onView }: WorkoutListProps) => {
  // Helper function to render text for sets
  const getSetsSummary = (exercise: Exercise) => {
    if (!exercise.sets || !Array.isArray(exercise.sets) || exercise.sets.length === 0) {
      return 'No sets';
    }
    return `${exercise.sets.length} set${exercise.sets.length !== 1 ? 's' : ''}`;
  };

  // Helper function to get average reps across all sets
  const getAverageReps = (exercise: Exercise) => {
    if (!exercise.sets || !Array.isArray(exercise.sets) || exercise.sets.length === 0) {
      return 'N/A';
    }
    
    const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
    return Math.round(totalReps / exercise.sets.length);
  };

  // Helper function to get weight range
  const getWeightRange = (exercise: Exercise) => {
    if (!exercise.sets || !Array.isArray(exercise.sets) || exercise.sets.length === 0) {
      return 'N/A';
    }
    
    const weights = exercise.sets
      .map(set => set.weight)
      .filter((weight): weight is number => weight !== undefined);
    
    if (weights.length === 0) return 'bodyweight';
    
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    
    return min === max ? `${min} lbs` : `${min}-${max} lbs`;
  };

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className={`${workout.completed ? 'border-primary bg-primary/5' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {workout.name}
                  {workout.completed && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">
                      Completed
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onView(workout.id)}
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onToggleComplete(workout.id)}
                  title={workout.completed ? "Mark as incomplete" : "Mark as completed"}
                >
                  <CheckCircle className={`h-4 w-4 ${workout.completed ? 'text-primary fill-primary' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(workout)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive"
                  onClick={() => onDelete(workout.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="exercises">
                <AccordionTrigger className="text-sm font-medium py-2">
                  View Exercises
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id} className="border rounded-md p-3">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                          <span>{getSetsSummary(exercise)}</span>
                          <span>~{getAverageReps(exercise)} reps</span>
                          <span>{getWeightRange(exercise)}</span>
                        </div>
                        {exercise.notes && (
                          <div className="text-sm mt-2 italic">
                            Note: {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="pt-0 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(workout.id)}
              className="gap-1"
            >
              <Eye className="h-4 w-4" /> 
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutList;
