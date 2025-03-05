
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseProgressChart from '@/components/ExerciseProgressChart';
import ExerciseSelector from '@/components/ExerciseSelector';
import { Workout } from '@/pages/Workouts';

const Analytics = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Load workouts from localStorage
  const loadWorkouts = (): Workout[] => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      return JSON.parse(storedWorkouts).map((workout: any) => ({
        ...workout,
        date: new Date(workout.date)
      }));
    }
    return [];
  };

  const workouts = loadWorkouts();
  
  // Extract all unique exercise names from all workouts
  const uniqueExerciseNames = Array.from(
    new Set(
      workouts
        .flatMap(workout => workout.exercises)
        .map(exercise => exercise.name)
    )
  ).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Workout Analytics</h1>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="progress">Exercise Progress</TabsTrigger>
            <TabsTrigger value="summary">Workout Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Progress Tracker</CardTitle>
                <CardDescription>
                  Track your progression for specific exercises over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExerciseSelector 
                  exercises={uniqueExerciseNames}
                  selectedExercise={selectedExercise}
                  onSelectExercise={setSelectedExercise}
                />
                
                {selectedExercise ? (
                  <ExerciseProgressChart 
                    exerciseName={selectedExercise}
                    workouts={workouts}
                  />
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground">
                      Select an exercise to view your progress over time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  More detailed analytics will be available in future updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 text-center bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">
                  Workout summaries, volume tracking, and more analytics features are coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
