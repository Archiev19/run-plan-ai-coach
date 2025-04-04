
import React, { useState } from 'react';
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
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// Time format validation helper
const isValidTimeFormat = (time: string): boolean => {
  const regex = /^(\d+:)?[0-5]?\d:[0-5]\d$/;
  return regex.test(time);
};

// Parse time to seconds
const timeToSeconds = (time: string): number => {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

// Format seconds to time string
const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
};

// Race pace benchmarks by fitness level (seconds per km)
const racePaceBenchmarks: Record<string, Record<string, { beginner: number; intermediate: number; advanced: number }>> = {
  '5k': {
    target: { beginner: 360, intermediate: 300, advanced: 240 }, // 6:00, 5:00, 4:00 min/km
  },
  '10k': {
    target: { beginner: 378, intermediate: 315, advanced: 252 }, // 6:18, 5:15, 4:12 min/km
  },
  'half-marathon': {
    target: { beginner: 396, intermediate: 330, advanced: 264 }, // 6:36, 5:30, 4:24 min/km
  },
  'marathon': {
    target: { beginner: 420, intermediate: 348, advanced: 276 }, // 7:00, 5:48, 4:36 min/km
  },
  'ultra': {
    target: { beginner: 480, intermediate: 390, advanced: 300 }, // 8:00, 6:30, 5:00 min/km
  },
};

const RaceTrainingForm = ({ formData, onChange, onSubmit }: RaceTrainingFormProps) => {
  const [open, setOpen] = useState(false);
  const [paceAnalysis, setPaceAnalysis] = useState<{
    isFeasible: boolean;
    message: string;
    suggestion?: string;
  } | null>(null);

  const handleDayToggle = (day: string) => {
    const updatedDays = formData.trainingDays.includes(day)
      ? formData.trainingDays.filter(d => d !== day)
      : [...formData.trainingDays, day];
    
    onChange({ trainingDays: updatedDays });
  };

  const analyzePace = () => {
    // Reset previous analysis
    setPaceAnalysis(null);
    
    // Check if we have all the required data to analyze
    if (!formData.raceDistance || !formData.targetTime || !formData.currentVolume || !formData.longestRun) {
      return;
    }
    
    // Check time format
    if (!isValidTimeFormat(formData.targetTime)) {
      return;
    }
    
    // Calculate target pace in seconds per km
    const totalSeconds = timeToSeconds(formData.targetTime);
    let distanceInKm = 5; // Default
    
    switch (formData.raceDistance) {
      case '5k': distanceInKm = 5; break;
      case '10k': distanceInKm = 10; break;
      case 'half-marathon': distanceInKm = 21.1; break;
      case 'marathon': distanceInKm = 42.2; break;
      case 'ultra': distanceInKm = 50; break;
    }
    
    const targetPaceSeconds = Math.round(totalSeconds / distanceInKm);
    const targetPaceFormatted = secondsToTime(targetPaceSeconds);
    
    // Get benchmarks for this distance
    const benchmarks = racePaceBenchmarks[formData.raceDistance]?.target;
    
    if (!benchmarks) return;
    
    // Evaluate based on current volume, longest run, and target pace
    const isBeginner = formData.currentVolume < 20 || formData.longestRun < 5;
    const isIntermediate = (formData.currentVolume >= 20 && formData.currentVolume < 50) || 
                         (formData.longestRun >= 5 && formData.longestRun < 15);
    const isAdvanced = formData.currentVolume >= 50 || formData.longestRun >= 15;
    
    let feasibilityLevel = 0;
    let category = 'intermediate';
    
    if (isBeginner) {
      category = 'beginner';
      feasibilityLevel = targetPaceSeconds <= benchmarks.beginner ? 0 : 1;
    } else if (isIntermediate) {
      category = 'intermediate';
      feasibilityLevel = targetPaceSeconds <= benchmarks.intermediate ? 1 : 
                         targetPaceSeconds <= benchmarks.beginner ? 2 : 0;
    } else if (isAdvanced) {
      category = 'advanced';
      feasibilityLevel = targetPaceSeconds <= benchmarks.advanced ? 2 : 
                         targetPaceSeconds <= benchmarks.intermediate ? 2 : 1;
    }
    
    // Determine if goal is feasible
    const isFeasible = feasibilityLevel > 0;
    
    // Suggestion for more realistic goal if needed
    let suggestion = '';
    
    if (!isFeasible) {
      // Calculate a more realistic time (add 10-15% buffer to benchmark)
      const adjustmentFactor = 1.12; // 12% buffer
      const suggestedPaceSeconds = Math.round(benchmarks[category as keyof typeof benchmarks] * adjustmentFactor);
      const suggestedTotalTime = secondsToTime(suggestedPaceSeconds * distanceInKm);
      
      suggestion = `Consider a more achievable target time of ${suggestedTotalTime} (${secondsToTime(suggestedPaceSeconds)}/km) for your first ${formData.raceDistance}.`;
    }
    
    // Set pace analysis
    setPaceAnalysis({
      isFeasible,
      message: `Your target pace is ${targetPaceFormatted}/km which appears to be ${isFeasible ? 'realistic' : 'challenging'} for your current fitness level.`,
      suggestion: !isFeasible ? suggestion : undefined
    });
  };

  // Analyze pace whenever relevant inputs change
  React.useEffect(() => {
    analyzePace();
  }, [formData.raceDistance, formData.targetTime, formData.currentVolume, formData.longestRun]);

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
                <Popover open={open} onOpenChange={setOpen}>
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
                      onSelect={(date) => {
                        onChange({ raceDate: date });
                        setOpen(false); // Close popover after selection
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="p-3 pointer-events-auto"
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
                <p className="text-xs text-muted-foreground">Format: h:mm:ss or mm:ss</p>
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
              {paceAnalysis && (
                <Alert variant={paceAnalysis.isFeasible ? "default" : "destructive"} className="border-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Pace Analysis</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>{paceAnalysis.message}</p>
                    {paceAnalysis.suggestion && <p className="font-medium">{paceAnalysis.suggestion}</p>}
                  </AlertDescription>
                </Alert>
              )}

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
            <Label htmlFor="injuryHistory">Injury History</Label>
            <Textarea
              id="injuryHistory"
              placeholder="Please list any running-related injuries you've had in the past (e.g., knee pain, shin splints, etc.)"
              value={formData.injuryHistory}
              onChange={(e) => onChange({ injuryHistory: e.target.value })}
              className="min-h-[80px]"
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
