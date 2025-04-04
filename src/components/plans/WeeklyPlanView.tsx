
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WeeklyPlan } from './RunningPlanDisplay';

interface WeeklyPlanViewProps {
  weekPlan: WeeklyPlan;
}

const WeeklyPlanView = ({ weekPlan }: WeeklyPlanViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Week {weekPlan.weekNumber}</h3>
        <span className="text-sm text-muted-foreground">Total: {weekPlan.totalDistance} km</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {weekPlan.days.map((workout) => (
          <Card 
            key={workout.day} 
            className={`
              ${workout.intensityLevel === 'easy' ? 'border-l-4 border-l-run-success' : ''}
              ${workout.intensityLevel === 'moderate' ? 'border-l-4 border-l-run-warning' : ''}
              ${workout.intensityLevel === 'hard' ? 'border-l-4 border-l-run-danger' : ''}
              ${workout.intensityLevel === 'rest' ? 'border-l-4 border-l-muted' : ''}
            `}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{workout.day}</h4>
                <span 
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${workout.intensityLevel === 'easy' ? 'bg-run-success/10 text-run-success' : ''}
                    ${workout.intensityLevel === 'moderate' ? 'bg-run-warning/10 text-run-warning' : ''}
                    ${workout.intensityLevel === 'hard' ? 'bg-run-danger/10 text-run-danger' : ''}
                    ${workout.intensityLevel === 'rest' ? 'bg-muted/20 text-muted-foreground' : ''}
                  `}
                >
                  {workout.intensityLevel.charAt(0).toUpperCase() + workout.intensityLevel.slice(1)}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{workout.workoutType}</span>
                  {workout.distance > 0 && (
                    <span className="text-sm">{workout.distance} km</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{workout.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanView;
