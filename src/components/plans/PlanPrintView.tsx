
import React from 'react';
import { RunningPlan } from './RunningPlanDisplay';

interface PlanPrintViewProps {
  plan: RunningPlan;
}

const PlanPrintView: React.FC<PlanPrintViewProps> = ({ plan }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{plan.title}</h1>
        <p className="text-xl">{plan.subtitle}</p>
      </div>

      {plan.paces && (
        <div className="mb-6 p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Recommended Training Paces</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Easy:</strong> {plan.paces.easy}</p>
              <p><strong>Moderate:</strong> {plan.paces.moderate}</p>
              <p><strong>Threshold:</strong> {plan.paces.threshold}</p>
            </div>
            <div>
              <p><strong>Interval:</strong> {plan.paces.interval}</p>
              <p><strong>Repetition:</strong> {plan.paces.repetition}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Plan Overview</h2>
        <div className="flex gap-8 mb-4">
          <div><strong>Duration:</strong> {plan.duration} weeks</div>
          <div><strong>Total Distance:</strong> {plan.totalDistance} km</div>
          <div><strong>Weekly Average:</strong> {(plan.totalDistance / plan.duration).toFixed(1)} km</div>
        </div>
        
        <h3 className="font-medium mb-2">Key Features:</h3>
        <ul className="list-disc pl-5 mb-4">
          {plan.keyFeatures.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
        
        <h3 className="font-medium mb-2">Notes & Recommendations:</h3>
        <ul className="list-disc pl-5">
          {plan.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Weekly Training Schedule</h2>
        
        {plan.weeklySummary.map((week) => (
          <div key={week.weekNumber} className="mb-6 page-break-inside-avoid">
            <h3 className="text-lg font-medium border-b pb-2 mb-3">
              Week {week.weekNumber} - {week.totalDistance} km
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {week.days.map((day) => (
                <div key={day.day} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{day.day}</h4>
                    <span className={`text-sm px-2 py-0.5 rounded-full
                      ${day.intensityLevel === 'easy' ? 'bg-green-100 text-green-800' : ''}
                      ${day.intensityLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${day.intensityLevel === 'hard' ? 'bg-red-100 text-red-800' : ''}
                      ${day.intensityLevel === 'rest' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {day.intensityLevel.charAt(0).toUpperCase() + day.intensityLevel.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <div><strong>{day.workoutType}</strong></div>
                    {day.distance > 0 && <div>{day.distance} km</div>}
                  </div>
                  
                  <p className="text-sm">{day.description}</p>
                  {day.paceGuidance && (
                    <p className="text-sm mt-1 italic">Pace: {day.paceGuidance}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm mt-8 pt-4 border-t">
        <p>Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PlanPrintView;
