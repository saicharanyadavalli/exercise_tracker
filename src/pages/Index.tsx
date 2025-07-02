
import React, { useState } from 'react';
import { Camera, Play, Activity, Timer, Target, Zap, Users, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WorkoutCamera from '@/components/WorkoutCamera';
import ExerciseInstructions from '@/components/ExerciseInstructions';

const exercises = [
  {
    id: 'pushups',
    name: 'Push-ups',
    icon: Activity,
    description: 'Upper body strength exercise',
    color: 'from-blue-500 to-cyan-500',
    targetMuscles: 'Chest, Arms, Core',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'squats',
    name: 'Squats',
    icon: Target,
    description: 'Lower body compound movement',
    color: 'from-purple-500 to-pink-500',
    targetMuscles: 'Legs, Glutes, Core',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'planks',
    name: 'Planks',
    icon: Timer,
    description: 'Core stability hold',
    color: 'from-green-500 to-emerald-500',
    targetMuscles: 'Core, Shoulders',
    image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'situps',
    name: 'Sit-ups',
    icon: RotateCcw,
    description: 'Abdominal strengthening',
    color: 'from-orange-500 to-red-500',
    targetMuscles: 'Abs, Hip Flexors',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    icon: Users,
    description: 'Unilateral leg exercise',
    color: 'from-indigo-500 to-purple-500',
    targetMuscles: 'Legs, Glutes, Balance',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'jumpingjacks',
    name: 'Jumping Jacks',
    icon: Zap,
    description: 'Full body cardio movement',
    color: 'from-yellow-500 to-orange-500',
    targetMuscles: 'Full Body, Cardio',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

const Index = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const selectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowInstructions(true);
  };

  const startWorkout = () => {
    setShowInstructions(false);
    setIsWorkoutActive(true);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setShowInstructions(false);
    setSelectedExercise(null);
  };

  if (isWorkoutActive && selectedExercise) {
    return <WorkoutCamera exercise={selectedExercise} onStop={stopWorkout} />;
  }

  if (showInstructions && selectedExercise) {
    return <ExerciseInstructions exerciseId={selectedExercise.id} onStart={startWorkout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            FitTracker AI
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real-time pose detection and exercise tracking powered by MediaPipe AI
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {exercises.map((exercise) => {
            const IconComponent = exercise.icon;
            return (
              <Card 
                key={exercise.id}
                className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${exercise.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Exercise Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className={`absolute top-4 right-4 p-2 bg-gradient-to-r ${exercise.color} rounded-lg shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{exercise.name}</h3>
                  <p className="text-slate-300 mb-3">{exercise.description}</p>
                  <p className="text-sm text-slate-400 mb-6">Target: {exercise.targetMuscles}</p>
                  
                  <Button 
                    onClick={() => selectExercise(exercise)}
                    className={`w-full bg-gradient-to-r ${exercise.color} hover:shadow-lg hover:shadow-purple-500/25 border-0 rounded-xl font-semibold text-white py-3 transition-all duration-300`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    View Instructions
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">AI-Powered Fitness Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Detection</h3>
                <p className="text-slate-300 text-sm">Advanced pose estimation using MediaPipe AI</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Form Analysis</h3>
                <p className="text-slate-300 text-sm">Get instant feedback on your exercise form</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rep Counting</h3>
                <p className="text-slate-300 text-sm">Automatic repetition counting and tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
