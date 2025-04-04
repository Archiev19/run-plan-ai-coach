
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WeeklyPlan } from './RunningPlanDisplay';

interface WeeklyPlanViewProps {
  weekPlan: WeeklyPlan;
}

const WeeklyPlanView = ({ weekPlan }: WeeklyPlanViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Week {weekPlan.weekNumber}</h3>
        <span className="text-sm text-muted-foreground">Total: {weekPlan.totalDistance} km</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
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
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-xl">{workout.day}</h4>
                  <span 
                    className={`
                      text-sm px-3 py-1 rounded-full font-medium
                      ${workout.intensityLevel === 'easy' ? 'bg-run-success/10 text-run-success' : ''}
                      ${workout.intensityLevel === 'moderate' ? 'bg-run-warning/10 text-run-warning' : ''}
                      ${workout.intensityLevel === 'hard' ? 'bg-run-danger/10 text-run-danger' : ''}
                      ${workout.intensityLevel === 'rest' ? 'bg-muted/20 text-muted-foreground' : ''}
                    `}
                  >
                    {workout.intensityLevel.charAt(0).toUpperCase() + workout.intensityLevel.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium px-3 py-1 bg-muted/30 rounded-full">{workout.workoutType}</span>
                  {workout.distance > 0 && (
                    <span className="text-sm font-medium px-3 py-1 bg-muted/50 rounded-full">{workout.distance} km</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-base text-muted-foreground">{workout.description}</p>
                {workout.paceGuidance && (
                  <div className="bg-muted/30 p-3 rounded-lg border border-muted">
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
