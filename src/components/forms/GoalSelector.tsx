
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';

export type GoalType = 'weight-loss' | 'general-fitness' | 'race-training';

interface GoalSelectorProps {
  selectedGoal: GoalType | null;
  onSelectGoal: (goal: GoalType) => void;
}

const GoalSelector = ({ selectedGoal, onSelectGoal }: GoalSelectorProps) => {
  const goals = [
    {
      id: 'weight-loss',
      title: 'Lose Weight',
      description: 'Burn calories and shed weight with running',
      icon: '🏃',
    },
    {
      id: 'general-fitness',
      title: 'General Fitness',
      description: 'Improve your endurance and overall health',
      icon: '💪',
    },
    {
      id: 'race-training',
      title: 'Train for a Race',
      description: 'Prepare for 5K, 10K, Half or Full Marathon',
      icon: '⏱️',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">What's your running goal?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Card 
            key={goal.id}
            className={`cursor-pointer transition-all hover:shadow-md group ${
              selectedGoal === goal.id 
                ? 'border-run-primary ring-2 ring-run-primary/20' 
                : 'hover:border-run-primary/50'
            }`}
            onClick={() => onSelectGoal(goal.id as GoalType)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
                <div className="text-3xl">{goal.icon}</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-sm mt-1">{goal.description}</CardDescription>
              {selectedGoal === goal.id && (
                <div className="absolute top-3 right-3 bg-run-primary text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSelector;
