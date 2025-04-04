
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
      
      <div className="grid grid-cols-1 gap-4">
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
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-lg">{workout.day}</h4>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{workout.workoutType}</span>
                  {workout.distance > 0 && (
                    <span className="text-sm bg-muted px-2 py-1 rounded">{workout.distance} km</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{workout.description}</p>
                {workout.paceGuidance && (
                  <div className="bg-muted/30 p-2 rounded border border-muted">
                    <p className="text-sm font-medium">
                      <span className="text-muted-foreground">Pace Guidance: </span> 
                      {workout.paceGuidance}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanView;
