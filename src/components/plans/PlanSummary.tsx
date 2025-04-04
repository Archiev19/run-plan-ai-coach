
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PlanSummaryProps {
  duration: number;
  totalDistance: number;
  keyFeatures: string[];
  notes: string[];
}

const PlanSummary = ({ duration, totalDistance, keyFeatures, notes }: PlanSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Plan Overview</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{duration} weeks</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Total Distance:</span>
                <span className="font-medium">{totalDistance} km</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Weekly Average:</span>
                <span className="font-medium">{(totalDistance / duration).toFixed(1)} km</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Key Features</h3>
            <ul className="space-y-1 text-sm">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-run-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Notes & Recommendations</h3>
          <ul className="space-y-2 text-sm">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-run-accent">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSummary;
