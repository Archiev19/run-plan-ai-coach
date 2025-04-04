
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WeeklyPlanView from './WeeklyPlanView';
import PlanSummary from './PlanSummary';
import { GoalType } from '@/components/forms/GoalSelector';

export interface RunningPlan {
  title: string;
  subtitle: string;
  type: GoalType;
  duration: number; // in weeks
  totalDistance: number; // in km
  weeklySummary: WeeklyPlan[];
  keyFeatures: string[];
  notes: string[];
}

export interface WeeklyPlan {
  weekNumber: number;
  totalDistance: number;
  days: DailyWorkout[];
}

export interface DailyWorkout {
  day: string;
  workoutType: string;
  distance: number;
  description: string;
  intensityLevel: 'easy' | 'moderate' | 'hard' | 'rest';
}

interface RunningPlanDisplayProps {
  plan: RunningPlan;
  onReset: () => void;
  onAskCoach: () => void;
}

const RunningPlanDisplay = ({ plan, onReset, onAskCoach }: RunningPlanDisplayProps) => {
  const [activeWeek, setActiveWeek] = React.useState(1);
  
  const handleWeekChange = (weekNumber: number) => {
    setActiveWeek(weekNumber);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{plan.title}</CardTitle>
              <CardDescription className="text-base">{plan.subtitle}</CardDescription>
            </div>
            <Badge 
              variant="outline" 
              className={`
                ${plan.type === 'weight-loss' ? 'border-run-accent text-run-accent' : ''}
                ${plan.type === 'general-fitness' ? 'border-run-success text-run-success' : ''}
                ${plan.type === 'race-training' ? 'border-run-primary text-run-primary' : ''}
              `}
            >
              {plan.type === 'weight-loss' ? 'Weight Loss' : ''}
              {plan.type === 'general-fitness' ? 'General Fitness' : ''}
              {plan.type === 'race-training' ? 'Race Training' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="plan" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="plan">Weekly Plan</TabsTrigger>
              <TabsTrigger value="summary">Plan Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plan" className="space-y-4">
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {plan.weeklySummary.map((week) => (
                  <Button 
                    key={week.weekNumber}
                    onClick={() => handleWeekChange(week.weekNumber)}
                    variant={activeWeek === week.weekNumber ? "default" : "outline"}
                    className={`rounded-full px-3 py-1 h-auto ${
                      activeWeek === week.weekNumber 
                        ? 'bg-run-primary hover:bg-run-primary/90' 
                        : ''
                    }`}
                  >
                    Week {week.weekNumber}
                  </Button>
                ))}
              </div>
              
              {plan.weeklySummary.map((week) => (
                week.weekNumber === activeWeek && (
                  <WeeklyPlanView key={week.weekNumber} weekPlan={week} />
                )
              ))}
            </TabsContent>
            
            <TabsContent value="summary">
              <PlanSummary 
                duration={plan.duration} 
                totalDistance={plan.totalDistance}
                keyFeatures={plan.keyFeatures}
                notes={plan.notes}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onReset}
        >
          Create New Plan
        </Button>
        <Button 
          className="flex-1 bg-run-accent hover:bg-run-accent/90"
          onClick={onAskCoach}
        >
          Ask AI Coach
        </Button>
      </div>
    </div>
  );
};

export default RunningPlanDisplay;
