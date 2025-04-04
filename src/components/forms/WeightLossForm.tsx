
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface WeightLossFormData {
  currentWeight: number;
  targetWeight: number;
  height: number;
  timeframe: number;
  stressLevel: number;
  activityLevel: string;
  trainingDays: string[];
  injuryHistory: string;
  dietaryPreferences: string;
  trackingCalories: boolean;
}

interface WeightLossFormProps {
  formData: WeightLossFormData;
  onChange: (data: Partial<WeightLossFormData>) => void;
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

const WeightLossForm = ({ formData, onChange, onSubmit }: WeightLossFormProps) => {
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
                <Label htmlFor="currentWeight">Current Weight (kg) <span className="text-run-accent">*</span></Label>
                <Input
                  id="currentWeight"
                  type="number"
                  placeholder="70"
                  value={formData.currentWeight || ''}
                  onChange={(e) => onChange({ currentWeight: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Weight (kg) <span className="text-run-accent">*</span></Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="65"
                  value={formData.targetWeight || ''}
                  onChange={(e) => onChange({ targetWeight: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) <span className="text-run-accent">*</span></Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height || ''}
                  onChange={(e) => onChange({ height: Number(e.target.value) })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeframe">Weight Loss Timeframe (months) <span className="text-run-accent">*</span></Label>
                <Input
                  id="timeframe"
                  type="number"
                  placeholder="3"
                  min="1"
                  max="24"
                  value={formData.timeframe || ''}
                  onChange={(e) => onChange({ timeframe: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Daily Activity Level <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.activityLevel} 
                  onValueChange={(value) => onChange({ activityLevel: value })}
                  required
                >
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Office job, little exercise)</SelectItem>
                    <SelectItem value="lightly-active">Lightly Active (Light exercise/sports 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately-active">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Stress Level <span className="text-run-accent">*</span></Label>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Low</span>
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
                <Slider
                  value={[formData.stressLevel || 3]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => onChange({ stressLevel: value[0] })}
                  className="py-2"
                />
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div 
                      key={value}
                      className={`h-1 w-1 rounded-full ${
                        formData.stressLevel >= value ? 'bg-run-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
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
                  <Label htmlFor="tracking-calories">Tracking Calories</Label>
                  <Switch
                    id="tracking-calories"
                    checked={formData.trackingCalories}
                    onCheckedChange={(checked) => onChange({ trackingCalories: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dietaryPreferences">Dietary Preferences (Optional)</Label>
            <Textarea
              id="dietaryPreferences"
              placeholder="Any dietary preferences or restrictions (e.g., vegetarian, no sugar, etc.)"
              value={formData.dietaryPreferences}
              onChange={(e) => onChange({ dietaryPreferences: e.target.value })}
              className="min-h-[60px]"
            />
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
            Generate Weight Loss Running Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeightLossForm;
