
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface GeneralFitnessFormData {
  currentVolume: number;
  fitnessLevel: string;
  primaryFocus: string;
  strengthTraining: boolean;
  trainingDays: string[];
  injuryHistory: string;
}

interface GeneralFitnessFormProps {
  formData: GeneralFitnessFormData;
  onChange: (data: Partial<GeneralFitnessFormData>) => void;
  onSubmit: () => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

const GeneralFitnessForm = ({ formData, onChange, onSubmit }: GeneralFitnessFormProps) => {
  const handleDayToggle = (day: string) => {
    const updatedDays = formData.trainingDays.includes(day)
      ? formData.trainingDays.filter(d => d !== day)
      : [...formData.trainingDays, day];
    
    onChange({ trainingDays: updatedDays });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentVolume">Current Weekly Running Volume (km) <span className="text-run-accent">*</span></Label>
                <Input
                  id="currentVolume"
                  type="number"
                  placeholder="20"
                  value={formData.currentVolume || ''}
                  onChange={(e) => onChange({ currentVolume: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.fitnessLevel} 
                  onValueChange={(value) => onChange({ fitnessLevel: value })}
                  required
                >
                  <SelectTrigger id="fitnessLevel">
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (New to running)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Running for 6+ months)</SelectItem>
                    <SelectItem value="advanced">Advanced (Running for 2+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryFocus">Primary Focus <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.primaryFocus} 
                  onValueChange={(value) => onChange({ primaryFocus: value })}
                  required
                >
                  <SelectTrigger id="primaryFocus">
                    <SelectValue placeholder="Select your focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="endurance">Endurance (Longer distances)</SelectItem>
                    <SelectItem value="maintenance">Fitness Maintenance</SelectItem>
                    <SelectItem value="speed">Speed Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Training Days <span className="text-run-accent">*</span></Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day.id}
                      type="button"
                      variant={formData.trainingDays.includes(day.id) ? "default" : "outline"}
                      className={`rounded-full px-3 py-1 h-auto text-xs ${
                        formData.trainingDays.includes(day.id) 
                          ? 'bg-run-primary hover:bg-run-primary/90' 
                          : ''
                      }`}
                      onClick={() => handleDayToggle(day.id)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="strength-training">Include Strength Training</Label>
                  <Switch
                    id="strength-training"
                    checked={formData.strengthTraining}
                    onCheckedChange={(checked) => onChange({ strengthTraining: checked })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Strength training helps prevent injuries and improves running economy
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="injuryHistory">Injury History <span className="text-run-accent">*</span></Label>
            <Textarea
              id="injuryHistory"
              placeholder="Please list any running-related injuries you've had in the past (e.g., knee pain, shin splints, etc.)"
              value={formData.injuryHistory}
              onChange={(e) => onChange({ injuryHistory: e.target.value })}
              className="min-h-[80px]"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-run-primary hover:bg-run-primary/90"
          >
            Generate Fitness Running Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralFitnessForm;
