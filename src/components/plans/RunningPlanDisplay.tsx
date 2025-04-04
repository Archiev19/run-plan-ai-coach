import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import WeeklyPlanView from './WeeklyPlanView';
import PlanSummary from './PlanSummary';
import { GoalType } from '@/components/forms/GoalSelector';
import { useReactToPrint } from 'react-to-print';
import PlanPrintView from './PlanPrintView';
import { toast } from "@/components/ui/use-toast";

export interface RunningPlan {
  title: string;
  subtitle: string;
  type: GoalType;
  duration: number; // in weeks
  totalDistance: number; // in km
  weeklySummary: WeeklyPlan[];
  keyFeatures: string[];
  notes: string[];
  paces?: {
    easy: string;
    moderate: string;
    threshold: string;
    interval: string;
    repetition: string;
  };
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
  paceGuidance?: string;
}

interface RunningPlanDisplayProps {
  plan: RunningPlan;
  onReset: () => void;
  onAskCoach: () => void;
}

const RunningPlanDisplay = ({ plan, onReset, onAskCoach }: RunningPlanDisplayProps) => {
  const [activeWeek, setActiveWeek] = React.useState(1);
  const printRef = React.useRef<HTMLDivElement>(null);
  
  const handleWeekChange = (weekNumber: number) => {
    setActiveWeek(weekNumber);
  };

  const handlePrint = useReactToPrint({
    documentTitle: `${plan.title}_Training_Plan`,
    onPrintError: () => toast({
      title: "Print Error",
      description: "An error occurred while generating PDF",
      variant: "destructive",
    }),
    contentRef: printRef,
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground">{plan.subtitle}</p>
        </div>
        
        <Button 
          onClick={() => handlePrint()}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          <span>Export PDF</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Weekly Training Schedule</CardTitle>
              <CardDescription className="text-base">
                Follow this tailored plan to achieve your running goals
              </CardDescription>
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
          
          {plan.paces && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">Your Recommended Training Paces:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                <div className="bg-run-success/10 p-2 rounded">
                  <span className="font-medium block">Easy:</span> 
                  <span>{plan.paces.easy}</span>
                </div>
                <div className="bg-run-warning/10 p-2 rounded">
                  <span className="font-medium block">Moderate:</span> 
                  <span>{plan.paces.moderate}</span>
                </div>
                <div className="bg-run-warning/20 p-2 rounded">
                  <span className="font-medium block">Threshold:</span> 
                  <span>{plan.paces.threshold}</span>
                </div>
                <div className="bg-run-danger/10 p-2 rounded">
                  <span className="font-medium block">Interval:</span> 
                  <span>{plan.paces.interval}</span>
                </div>
                <div className="bg-run-danger/20 p-2 rounded">
                  <span className="font-medium block">Repetition:</span> 
                  <span>{plan.paces.repetition}</span>
                </div>
              </div>
            </div>
          )}
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

      <div className="hidden">
        <div ref={printRef}>
          <PlanPrintView plan={plan} />
        </div>
      </div>
    </div>
  );
};

export default RunningPlanDisplay;
