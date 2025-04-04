import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoalSelector, { GoalType } from '@/components/forms/GoalSelector';
import WeightLossForm from '@/components/forms/WeightLossForm';
import GeneralFitnessForm from '@/components/forms/GeneralFitnessForm';
import RaceTrainingForm from '@/components/forms/RaceTrainingForm';
import RunningPlanDisplay, { RunningPlan } from '@/components/plans/RunningPlanDisplay';
import AICoach from '@/components/coach/AICoach';
import RunningFAQ from '@/components/faq/RunningFAQ';
import { generateRunningPlan } from '@/services/planGenerator';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const initialWeightLossData = {
  currentWeight: 0,
  targetWeight: 0,
  height: 0,
  timeframe: 3,
  stressLevel: 3,
  activityLevel: '',
  trainingDays: ['monday', 'wednesday', 'friday'],
  injuryHistory: '',
  dietaryPreferences: '',
  trackingCalories: false,
};

const initialFitnessData = {
  currentVolume: 0,
  fitnessLevel: '',
  primaryFocus: '',
  strengthTraining: true,
  trainingDays: ['monday', 'wednesday', 'saturday'],
  injuryHistory: '',
};

const initialRaceTrainingData = {
  raceDistance: '',
  raceDate: undefined,
  targetTime: '',
  currentVolume: 0,
  longestRun: 0,
  approachPreference: '',
  raceTerrain: '',
  strengthTraining: true,
  trainingDays: ['tuesday', 'thursday', 'saturday'],
  injuryHistory: '',
};

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<RunningPlan | null>(null);
  
  const [weightLossData, setWeightLossData] = useState(initialWeightLossData);
  const [fitnessData, setFitnessData] = useState(initialFitnessData);
  const [raceTrainingData, setRaceTrainingData] = useState(initialRaceTrainingData);
  
  const { toast } = useToast();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleGoalSelect = (goal: GoalType) => {
    setSelectedGoal(goal);
    setGeneratedPlan(null);
    setShowCoach(false);
  };

  const updateWeightLossData = (data: Partial<typeof weightLossData>) => {
    setWeightLossData(prev => ({ ...prev, ...data }));
  };

  const updateFitnessData = (data: Partial<typeof fitnessData>) => {
    setFitnessData(prev => ({ ...prev, ...data }));
  };

  const updateRaceTrainingData = (data: Partial<typeof raceTrainingData>) => {
    setRaceTrainingData(prev => ({ ...prev, ...data }));
  };
  
  const handleWeightLossSubmit = () => {
    try {
      if (
        !weightLossData.currentWeight ||
        !weightLossData.targetWeight ||
        !weightLossData.height ||
        !weightLossData.timeframe ||
        !weightLossData.activityLevel ||
        weightLossData.trainingDays.length === 0
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      const userData = {
        ...weightLossData,
        goalType: 'weight-loss',
      };
      
      const plan = generateRunningPlan(userData);
      setGeneratedPlan(plan);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem generating your plan. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  const handleFitnessSubmit = () => {
    try {
      if (
        !fitnessData.currentVolume ||
        !fitnessData.fitnessLevel ||
        !fitnessData.primaryFocus ||
        fitnessData.trainingDays.length === 0
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      const userData = {
        ...fitnessData,
        goalType: 'general-fitness',
      };
      
      const plan = generateRunningPlan(userData);
      setGeneratedPlan(plan);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem generating your plan. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  const handleRaceTrainingSubmit = () => {
    try {
      if (
        !raceTrainingData.raceDistance ||
        !raceTrainingData.raceDate ||
        !raceTrainingData.targetTime ||
        !raceTrainingData.currentVolume ||
        !raceTrainingData.longestRun ||
        !raceTrainingData.approachPreference ||
        !raceTrainingData.raceTerrain ||
        raceTrainingData.trainingDays.length === 0
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      const userData = {
        ...raceTrainingData,
        goalType: 'race-training',
      };
      
      const plan = generateRunningPlan(userData);
      setGeneratedPlan(plan);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem generating your plan. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  const handleReset = () => {
    setSelectedGoal(null);
    setGeneratedPlan(null);
    setShowCoach(false);
    
    setWeightLossData(initialWeightLossData);
    setFitnessData(initialFitnessData);
    setRaceTrainingData(initialRaceTrainingData);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAskCoach = () => {
    setShowCoach(true);
    
    setTimeout(() => {
      document.getElementById('coach-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-1">
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container max-w-5xl mx-auto space-y-8">
            {!generatedPlan ? (
              <>
                <div className="text-center space-y-4 mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-run-dark">
                    Generate Your <span className="text-run-primary">Personalized</span> Running Plan
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Whether you're looking to lose weight, improve general fitness, or train for a race, we'll create a customized plan just for you.
                  </p>
                </div>
                
                {!selectedGoal ? (
                  <GoalSelector
                    selectedGoal={selectedGoal}
                    onSelectGoal={handleGoalSelect}
                  />
                ) : selectedGoal === 'weight-loss' ? (
                  <WeightLossForm
                    formData={weightLossData}
                    onChange={updateWeightLossData}
                    onSubmit={handleWeightLossSubmit}
                  />
                ) : selectedGoal === 'general-fitness' ? (
                  <GeneralFitnessForm
                    formData={fitnessData}
                    onChange={updateFitnessData}
                    onSubmit={handleFitnessSubmit}
                  />
                ) : (
                  <RaceTrainingForm
                    formData={raceTrainingData}
                    onChange={updateRaceTrainingData}
                    onSubmit={handleRaceTrainingSubmit}
                  />
                )}
              </>
            ) : (
              <RunningPlanDisplay
                plan={generatedPlan}
                onReset={handleReset}
                onAskCoach={handleAskCoach}
              />
            )}
            
            {showCoach && (
              <div id="coach-section" className="mt-8 pt-4">
                <h2 className="text-2xl font-semibold mb-4">Your AI Running Coach</h2>
                <AICoach />
              </div>
            )}
          </div>
        </section>
        
        {!generatedPlan && <RunningFAQ />}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
