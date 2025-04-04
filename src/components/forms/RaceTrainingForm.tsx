
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
import { Calendar as CalendarIcon, AlertCircle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RaceTrainingFormData {
  raceDistance: string;
  raceDate: Date | undefined;
  targetTime: string;
  currentVolume: number;
  longestRun: number;
  currentPace: string; // New field
  recentRaceTime: string; // New field
  recentRaceDistance: string; // New field
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
  if (!time) return true; // Allow empty for optional fields
  const regex = /^(\d+:)?[0-5]?\d:[0-5]\d$/;
  return regex.test(time);
};

// Parse time to seconds
const timeToSeconds = (time: string): number => {
  if (!time) return 0;
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

// Training paces relative to race pace
const trainingPaceRatios = {
  easy: 1.3, // 30% slower than race pace
  moderate: 1.15, // 15% slower than race pace
  threshold: 1.05, // 5% slower than race pace
  interval: 0.95, // 5% faster than race pace
  repetition: 0.90, // 10% faster than race pace
};

// Convert race distance to kilometers
const getDistanceInKm = (raceDistance: string): number => {
  switch (raceDistance) {
    case '5k': return 5;
    case '10k': return 10;
    case 'half-marathon': return 21.1;
    case 'marathon': return 42.2;
    case 'ultra': return 50;
    default: return 0;
  }
};

const RaceTrainingForm = ({ formData, onChange, onSubmit }: RaceTrainingFormProps) => {
  const [open, setOpen] = useState(false);
  const [paceAnalysis, setPaceAnalysis] = useState<{
    isFeasible: boolean;
    confidence: 'low' | 'medium' | 'high';
    message: string;
    suggestion?: string;
    trainingPaces?: Record<string, string>;
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
    if (!formData.raceDistance || !formData.targetTime) {
      return;
    }
    
    // Check time format
    if (!isValidTimeFormat(formData.targetTime)) {
      return;
    }
    
    // Calculate target pace in seconds per km
    const totalSeconds = timeToSeconds(formData.targetTime);
    const distanceInKm = getDistanceInKm(formData.raceDistance);
    if (distanceInKm === 0) return;
    
    const targetPaceSeconds = Math.round(totalSeconds / distanceInKm);
    const targetPaceFormatted = secondsToTime(targetPaceSeconds);
    
    // Get benchmarks for this distance
    const benchmarks = racePaceBenchmarks[formData.raceDistance]?.target;
    if (!benchmarks) return;
    
    let fitnessLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
    let confidenceScore = 'medium' as 'low' | 'medium' | 'high';
    
    // Gather evidence for fitness assessment
    const evidence = [];
    
    // Evidence from volume and long run
    if (formData.currentVolume > 0 && formData.longestRun > 0) {
      if (formData.currentVolume < 20 || formData.longestRun < 5) {
        fitnessLevel = 'beginner';
        evidence.push('low weekly volume or short longest run');
      } else if (formData.currentVolume >= 50 || formData.longestRun >= 15) {
        fitnessLevel = 'advanced';
        evidence.push('high weekly volume or long longest run');
      } else {
        fitnessLevel = 'intermediate';
        evidence.push('moderate weekly volume and longest run');
      }
      confidenceScore = 'medium';
    }
    
    // Evidence from current pace if provided
    if (formData.currentPace && isValidTimeFormat(formData.currentPace)) {
      const currentPaceSeconds = timeToSeconds(formData.currentPace);
      if (currentPaceSeconds > 0) {
        if (currentPaceSeconds > benchmarks.beginner + 30) {
          // Much slower than beginner benchmark
          if (fitnessLevel !== 'beginner') {
            fitnessLevel = 'beginner';
            evidence.push('current pace is slower than typical beginner paces');
          }
        } else if (currentPaceSeconds < benchmarks.advanced + 15) {
          // Closer to advanced benchmark
          if (fitnessLevel !== 'advanced') {
            fitnessLevel = 'advanced';
            evidence.push('current pace is close to advanced runner paces');
          }
        }
        confidenceScore = 'high';
      }
    }
    
    // Evidence from recent race if provided
    if (formData.recentRaceTime && formData.recentRaceDistance && 
        isValidTimeFormat(formData.recentRaceTime)) {
      const recentRaceSeconds = timeToSeconds(formData.recentRaceTime);
      const recentDistanceKm = getDistanceInKm(formData.recentRaceDistance);
      
      if (recentRaceSeconds > 0 && recentDistanceKm > 0) {
        const recentPaceSeconds = recentRaceSeconds / recentDistanceKm;
        
        // Use recent race to predict target race using Riegel formula
        // T2 = T1 × (D2/D1)^1.06
        const predictedSeconds = recentRaceSeconds * 
                                Math.pow(distanceInKm / recentDistanceKm, 1.06);
        const predictedPace = predictedSeconds / distanceInKm;
        
        // Compare predicted pace with target pace
        const paceRatio = targetPaceSeconds / predictedPace;
        let predictionMessage = '';
        
        if (paceRatio < 0.9) {
          // Target is >10% faster than prediction (ambitious)
          predictionMessage = `Based on your recent ${formData.recentRaceDistance} time, your target is very ambitious (${Math.round((1-paceRatio)*100)}% faster than predicted).`;
          confidenceScore = 'high';
        } else if (paceRatio < 0.97) {
          // Target is 3-10% faster than prediction (challenging)
          predictionMessage = `Based on your recent ${formData.recentRaceDistance} time, your target is challenging but potentially achievable.`;
          confidenceScore = 'high';
        } else {
          // Target is in line with or slower than prediction
          predictionMessage = `Based on your recent ${formData.recentRaceDistance} time, your target pace appears achievable.`;
          confidenceScore = 'high';
        }
        
        evidence.push(predictionMessage);
      }
    }
    
    // Determine if goal is feasible based on target vs benchmark
    let isFeasible = true;
    let feasibilityMessage = '';
    
    if (targetPaceSeconds < benchmarks[fitnessLevel]) {
      // Target is faster than typical for assessed fitness level
      const percentFaster = Math.round((1 - targetPaceSeconds / benchmarks[fitnessLevel]) * 100);
      if (percentFaster > 15) {
        isFeasible = false;
        feasibilityMessage = `Your target pace is ${percentFaster}% faster than typical for your fitness level.`;
      } else {
        feasibilityMessage = `Your target pace is challenging but potentially achievable for your fitness level.`;
      }
    } else {
      feasibilityMessage = `Your target pace is realistic based on your fitness level.`;
    }
    
    // Calculate training paces based on target race pace
    const trainingPaces: Record<string, string> = {};
    trainingPaces.easy = secondsToTime(Math.round(targetPaceSeconds * trainingPaceRatios.easy));
    trainingPaces.moderate = secondsToTime(Math.round(targetPaceSeconds * trainingPaceRatios.moderate));
    trainingPaces.threshold = secondsToTime(Math.round(targetPaceSeconds * trainingPaceRatios.threshold));
    trainingPaces.interval = secondsToTime(Math.round(targetPaceSeconds * trainingPaceRatios.interval));
    trainingPaces.repetition = secondsToTime(Math.round(targetPaceSeconds * trainingPaceRatios.repetition));
    
    // Suggestion for more realistic goal if needed
    let suggestion = '';
    
    if (!isFeasible) {
      // Calculate a more realistic time (add buffer to benchmark)
      const adjustmentFactor = 1.05; // 5% buffer
      const suggestedPaceSeconds = Math.round(benchmarks[fitnessLevel] * adjustmentFactor);
      const suggestedTotalTime = secondsToTime(suggestedPaceSeconds * distanceInKm);
      
      suggestion = `Consider a more achievable target time of ${suggestedTotalTime} (${secondsToTime(suggestedPaceSeconds)}/km) for your ${formData.raceDistance}.`;
    }
    
    // Put together the full analysis message
    let fullMessage = `Your target pace is ${targetPaceFormatted}/km which appears to be ${isFeasible ? 'realistic' : 'challenging'} for your current fitness level. `;
    
    if (evidence.length > 0) {
      fullMessage += evidence.join(' ');
    }
    
    // Set pace analysis
    setPaceAnalysis({
      isFeasible,
      confidence: confidenceScore,
      message: fullMessage,
      suggestion: !isFeasible ? suggestion : undefined,
      trainingPaces
    });
  };

  // Analyze pace whenever relevant inputs change
  React.useEffect(() => {
    analyzePace();
  }, [
    formData.raceDistance, 
    formData.targetTime, 
    formData.currentVolume, 
    formData.longestRun,
    formData.currentPace,
    formData.recentRaceTime,
    formData.recentRaceDistance
  ]);

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
              
              {/* New current pace field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="currentPace">Current Easy Pace (min/km)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Your comfortable, conversational running pace</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="currentPace"
                  type="text"
                  placeholder="e.g. 6:30"
                  value={formData.currentPace || ''}
                  onChange={(e) => onChange({ currentPace: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Format: mm:ss</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Recent race performance */}
              <div className="space-y-2 border p-3 rounded-md border-muted bg-muted/10">
                <Label className="text-sm font-medium">Recent Race Performance (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">This helps us analyze your goal more accurately</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="recentRaceDistance" className="text-xs">Race Distance</Label>
                    <Select 
                      value={formData.recentRaceDistance || ''} 
                      onValueChange={(value) => onChange({ recentRaceDistance: value })}
                    >
                      <SelectTrigger id="recentRaceDistance" className="h-8 text-xs">
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k">5K</SelectItem>
                        <SelectItem value="10k">10K</SelectItem>
                        <SelectItem value="half-marathon">Half Marathon</SelectItem>
                        <SelectItem value="marathon">Marathon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="recentRaceTime" className="text-xs">Finish Time</Label>
                    <Input
                      id="recentRaceTime"
                      type="text"
                      placeholder="e.g. 25:30"
                      value={formData.recentRaceTime || ''}
                      onChange={(e) => onChange({ recentRaceTime: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
              
              {paceAnalysis && (
                <Alert variant={paceAnalysis.isFeasible ? "default" : "destructive"} className="border-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    Pace Analysis 
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      paceAnalysis.confidence === 'high' ? 'bg-run-success/20 text-run-success' : 
                      paceAnalysis.confidence === 'medium' ? 'bg-run-warning/20 text-run-warning' : 
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {paceAnalysis.confidence.charAt(0).toUpperCase() + paceAnalysis.confidence.slice(1)} Confidence
                    </span>
                  </AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>{paceAnalysis.message}</p>
                    {paceAnalysis.suggestion && <p className="font-medium">{paceAnalysis.suggestion}</p>}
                    
                    {paceAnalysis.trainingPaces && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Your Training Paces:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-run-success/10 p-1.5 rounded">
                            <span className="font-medium block">Easy:</span> 
                            <span>{paceAnalysis.trainingPaces.easy}/km</span>
                          </div>
                          <div className="bg-run-warning/10 p-1.5 rounded">
                            <span className="font-medium block">Moderate:</span> 
                            <span>{paceAnalysis.trainingPaces.moderate}/km</span>
                          </div>
                          <div className="bg-run-warning/20 p-1.5 rounded">
                            <span className="font-medium block">Threshold:</span> 
                            <span>{paceAnalysis.trainingPaces.threshold}/km</span>
                          </div>
                          <div className="bg-run-danger/10 p-1.5 rounded">
                            <span className="font-medium block">Interval:</span> 
                            <span>{paceAnalysis.trainingPaces.interval}/km</span>
                          </div>
                        </div>
                      </div>
                    )}
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
            <Label htmlFor="injuryHistory">Injury History (Optional)</Label>
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
