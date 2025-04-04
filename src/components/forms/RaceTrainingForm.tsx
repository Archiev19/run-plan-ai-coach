
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface RaceTrainingFormData {
  raceDistance: string;
  raceDate: Date | undefined;
  targetTime: string;
  currentVolume: number;
  longestRun: number;
  approachPreference: string;
  raceTerrain: string;
  strengthTraining: boolean;
  trainingDays: string[];
  injuryHistory: string;
}

interface RaceTrainingFormProps {
  formData: RaceTrainingFormData;
  onChange: (data: Partial<RaceTrainingFormData>) => void;
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

const RaceTrainingForm = ({ formData, onChange, onSubmit }: RaceTrainingFormProps) => {
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
                <Label htmlFor="raceDistance">Race Distance <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.raceDistance} 
                  onValueChange={(value) => onChange({ raceDistance: value })}
                  required
                >
                  <SelectTrigger id="raceDistance">
                    <SelectValue placeholder="Select race distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k">5K</SelectItem>
                    <SelectItem value="10k">10K</SelectItem>
                    <SelectItem value="half-marathon">Half Marathon (21.1km)</SelectItem>
                    <SelectItem value="marathon">Marathon (42.2km)</SelectItem>
                    <SelectItem value="ultra">Ultra Marathon (50km+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="raceDate">Race Date <span className="text-run-accent">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.raceDate ? format(formData.raceDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.raceDate}
                      onSelect={(date) => onChange({ raceDate: date })}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetTime">Target Finish Time <span className="text-run-accent">*</span></Label>
                <Input
                  id="targetTime"
                  type="text"
                  placeholder="e.g. 1:45:00 for Half Marathon"
                  value={formData.targetTime}
                  onChange={(e) => onChange({ targetTime: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Format: h:mm:ss</p>
              </div>
              
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
                <Label htmlFor="longestRun">Longest Recent Run (km) <span className="text-run-accent">*</span></Label>
                <Input
                  id="longestRun"
                  type="number"
                  placeholder="10"
                  value={formData.longestRun || ''}
                  onChange={(e) => onChange({ longestRun: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="approachPreference">Training Approach <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.approachPreference} 
                  onValueChange={(value) => onChange({ approachPreference: value })}
                  required
                >
                  <SelectTrigger id="approachPreference">
                    <SelectValue placeholder="Select approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">Traditional (Balanced training)</SelectItem>
                    <SelectItem value="speed">Speed-focused (More intervals)</SelectItem>
                    <SelectItem value="high-mileage">High mileage (More volume)</SelectItem>
                    <SelectItem value="low-mileage">Low mileage (Less runs, more quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="raceTerrain">Race Terrain <span className="text-run-accent">*</span></Label>
                <Select 
                  value={formData.raceTerrain} 
                  onValueChange={(value) => onChange({ raceTerrain: value })}
                  required
                >
                  <SelectTrigger id="raceTerrain">
                    <SelectValue placeholder="Select terrain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Road (Flat)</SelectItem>
                    <SelectItem value="mixed">Mixed (Some hills)</SelectItem>
                    <SelectItem value="hilly">Hilly (Significant elevation)</SelectItem>
                    <SelectItem value="trail">Trail</SelectItem>
                  </SelectContent>
                </Select>
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
            Generate Race Training Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RaceTrainingForm;
