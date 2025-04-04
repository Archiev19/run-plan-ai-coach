import { GoalType } from '@/components/forms/GoalSelector';
import { RunningPlan } from '@/components/plans/RunningPlanDisplay';

// Calculate training paces based on user input
const calculatePaces = (userData: any): { 
  easy: string; 
  moderate: string; 
  threshold: string; 
  interval: string; 
  repetition: string; 
} => {
  // Base pace calculations on various inputs
  let targetPace = '6:00';
  let targetPaceSeconds = 360; // 6 minutes in seconds
  
  // For race training plans, use target time to calculate paces
  if (userData.goalType === 'race-training' && userData.targetTime) {
    // Parse target time (format: "h:mm:ss" or "mm:ss")
    const timeParts = userData.targetTime.split(':').map(Number);
    let totalSeconds = 0;
    
    if (timeParts.length === 3) {
      // Format: "h:mm:ss"
      totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else if (timeParts.length === 2) {
      // Format: "mm:ss"
      totalSeconds = timeParts[0] * 60 + timeParts[1];
    }
    
    // Calculate target pace in seconds per km
    let distanceInKm = 5; // Default
    switch (userData.raceDistance) {
      case '5k':
        distanceInKm = 5;
        break;
      case '10k':
        distanceInKm = 10;
        break;
      case 'half-marathon':
        distanceInKm = 21.1;
        break;
      case 'marathon':
        distanceInKm = 42.2;
        break;
      case 'ultra':
        distanceInKm = 50; // Simplified
        break;
    }
    
    targetPaceSeconds = Math.round(totalSeconds / distanceInKm);
  } 
  // For weight loss or general fitness, estimate based on fitness level
  else {
    if (userData.fitnessLevel === 'beginner') {
      targetPaceSeconds = 390; // 6:30 min/km
    } else if (userData.fitnessLevel === 'intermediate') {
      targetPaceSeconds = 330; // 5:30 min/km
    } else if (userData.fitnessLevel === 'advanced') {
      targetPaceSeconds = 270; // 4:30 min/km
    } else {
      // Default for weight loss plans or undefined fitness level
      targetPaceSeconds = 360; // 6:00 min/km
    }
  }
  
  // Format seconds to mm:ss
  const formatPace = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} min/km`;
  };
  
  // Calculate different training paces based on target race pace
  return {
    easy: formatPace(Math.round(targetPaceSeconds * 1.3)),
    moderate: formatPace(Math.round(targetPaceSeconds * 1.15)),
    threshold: formatPace(Math.round(targetPaceSeconds * 1.05)),
    interval: formatPace(Math.round(targetPaceSeconds * 0.95)),
    repetition: formatPace(Math.round(targetPaceSeconds * 0.9))
  };
};

// Add pace guidance to workout plans
const addPaceGuidance = (days: any[], paces: any): any[] => {
  return days.map(day => {
    // Skip rest days
    if (day.intensityLevel === 'rest') {
      return day;
    }
    
    let paceGuidance = '';
    
    // Assign pace guidance based on workout type and intensity
    if (day.workoutType.includes('Interval') || day.workoutType.includes('Speed')) {
      paceGuidance = `Work intervals: ${paces.interval}, Recovery: ${paces.easy}`;
    } else if (day.workoutType.includes('Tempo')) {
      paceGuidance = `Main effort: ${paces.threshold}, Warm-up/cooldown: ${paces.easy}`;
    } else if (day.intensityLevel === 'easy' || day.workoutType.includes('Recovery')) {
      paceGuidance = paces.easy;
    } else if (day.intensityLevel === 'moderate' || day.workoutType.includes('Steady')) {
      paceGuidance = paces.moderate;
    } else if (day.intensityLevel === 'hard') {
      paceGuidance = paces.threshold;
    }
    
    return {
      ...day,
      paceGuidance
    };
  });
};

// Mock generator for weight loss running plan
export const generateWeightLossPlan = (userData: any): RunningPlan => {
  // Calculate base data
  const weeklyVolume = userData.currentWeight > 80 ? 20 : 25; // Adjust based on weight
  const duration = userData.timeframe * 4; // 4 weeks per month
  
  // Calculate pace recommendations
  const paces = calculatePaces(userData);
  
  // Generate weekly plans based on training days
  const weeklySummary = Array.from({ length: duration }, (_, i) => {
    const weekNumber = i + 1;
    const progressFactor = Math.min(1 + (weekNumber / duration) * 0.5, 1.4);
    const totalDistance = Math.round(weeklyVolume * progressFactor);
    
    // Create daily workouts based on selected training days
    let days = generateDailyWorkouts(userData.trainingDays, totalDistance, 'weight-loss');
    
    // Add pace guidance to workouts
    days = addPaceGuidance(days, paces);
    
    return {
      weekNumber,
      totalDistance,
      days,
    };
  });
  
  // Calculate total distance across all weeks
  const totalDistance = weeklySummary.reduce((sum, week) => sum + week.totalDistance, 0);
  
  return {
    title: "Weight Loss Running Plan",
    subtitle: `${duration}-week progressive plan focused on fat burning`,
    type: 'weight-loss',
    duration,
    totalDistance,
    weeklySummary,
    paces,
    keyFeatures: [
      "Gradually increasing intensity to maximize calorie burn",
      "Mix of steady-state and interval training for metabolic boost",
      "Strategic rest days to prevent overtraining",
      "Combination of shorter frequent runs and longer steady-state sessions"
    ],
    notes: [
      "Combine this plan with a moderate calorie deficit (300-500 calories/day) for optimal results",
      "Fuel properly before and after runs - focus on protein and complex carbs",
      "Stay hydrated throughout the day, not just during runs",
      "Consider strength training on 1-2 non-running days for best results",
      "Listen to your body and take extra rest if needed"
    ]
  };
};

// Mock generator for general fitness running plan
export const generateFitnessPlan = (userData: any): RunningPlan => {
  // Calculate base data
  let baseWeeklyVolume = userData.currentVolume || 15;
  const duration = 12; // 12-week general fitness plan
  
  // Calculate pace recommendations
  const paces = calculatePaces(userData);
  
  // Generate weekly plans based on training days
  const weeklySummary = Array.from({ length: duration }, (_, i) => {
    const weekNumber = i + 1;
    const isRecoveryWeek = weekNumber % 4 === 0;
    
    // Every 4th week is a recovery week with reduced volume
    const progressFactor = isRecoveryWeek ? 0.8 : Math.min(1 + (weekNumber / duration) * 0.3, 1.3);
    const totalDistance = Math.round(baseWeeklyVolume * progressFactor);
    
    // Create daily workouts based on selected training days
    let days = generateDailyWorkouts(userData.trainingDays, totalDistance, 'general-fitness', userData.primaryFocus);
    
    // Add pace guidance to workouts
    days = addPaceGuidance(days, paces);
    
    return {
      weekNumber,
      totalDistance,
      days,
    };
  });
  
  // Calculate total distance across all weeks
  const totalDistance = weeklySummary.reduce((sum, week) => sum + week.totalDistance, 0);
  
  return {
    title: "General Fitness Running Plan",
    subtitle: `12-week progressive plan for ${userData.primaryFocus} improvement`,
    type: 'general-fitness',
    duration,
    totalDistance,
    weeklySummary,
    paces,
    keyFeatures: [
      "Gradually increasing volume with recovery weeks",
      "Balanced mix of easy, moderate and challenging sessions",
      "Focus on building aerobic base with strategic intensity",
      userData.strengthTraining ? "Integrated strength training recommendations" : "Optional cross-training suggestions"
    ],
    notes: [
      "Run at conversational pace for easy runs (you should be able to talk)",
      "Recovery is just as important as training - prioritize sleep and nutrition",
      "Pay attention to your body's signals and adjust as needed",
      "Consider a running log to track progress and identify patterns",
      "Have fun with your running - mix up routes and types of runs to stay motivated"
    ]
  };
};

// Mock generator for race training running plan
export const generateRaceTrainingPlan = (userData: any): RunningPlan => {
  // Calculate base data
  const baseWeeklyVolume = userData.currentVolume || 20;
  
  // Determine duration based on race distance and current fitness
  let duration = 12; // Default
  if (userData.raceDistance === 'marathon') duration = 16;
  if (userData.raceDistance === 'ultra') duration = 20;
  if (userData.raceDistance === '5k' && userData.currentVolume > 30) duration = 8;
  
  // Calculate pace recommendations
  const paces = calculatePaces(userData);
  
  // Generate weekly plans
  const weeklySummary = Array.from({ length: duration }, (_, i) => {
    const weekNumber = i + 1;
    const isRecoveryWeek = weekNumber % 4 === 0;
    const isTaperWeek = weekNumber > duration - 3;
    
    let progressFactor = 1;
    if (isTaperWeek) {
      // Tapering period
      progressFactor = 0.6 - (duration - weekNumber) * 0.1;
    } else if (isRecoveryWeek) {
      // Recovery week
      progressFactor = 0.8;
    } else {
      // Normal progression
      progressFactor = Math.min(1 + (weekNumber / (duration - 3)) * 0.5, 1.6);
    }
    
    const totalDistance = Math.round(baseWeeklyVolume * progressFactor);
    
    // Create daily workouts based on selected training days
    let days = generateDailyWorkouts(userData.trainingDays, totalDistance, 'race-training', userData.approachPreference, userData.raceDistance);
    
    // Add pace guidance to workouts
    days = addPaceGuidance(days, paces);
    
    return {
      weekNumber,
      totalDistance,
      days,
    };
  });
  
  // Calculate total distance across all weeks
  const totalDistance = weeklySummary.reduce((sum, week) => sum + week.totalDistance, 0);
  
  return {
    title: `${formatRaceDistance(userData.raceDistance)} Training Plan`,
    subtitle: `${duration}-week plan focused on ${userData.approachPreference} training approach`,
    type: 'race-training',
    duration,
    totalDistance,
    weeklySummary,
    paces,
    keyFeatures: [
      "Progressive overload with strategic recovery weeks",
      `Race-specific workouts tailored for ${formatRaceDistance(userData.raceDistance)} distance`,
      "Proper tapering period to optimize race day performance",
      userData.raceTerrain !== 'road' ? `Terrain-specific training for ${userData.raceTerrain} conditions` : "Road-optimized training",
      userData.strengthTraining ? "Complementary strength training for running economy" : "Focus on running-specific conditioning"
    ],
    notes: [
      "The long run is the cornerstone of your training - prioritize it each week",
      "Practice your race day nutrition strategy during longer training runs",
      "Consider race-pace segments in your longer runs as you approach race day",
      "Taper properly by reducing volume but maintaining some intensity",
      "Trust your training and focus on consistent execution rather than perfect workouts"
    ]
  };
};

// Helper function to generate daily workouts
const generateDailyWorkouts = (trainingDays: string[], totalWeekDistance: number, planType: GoalType, focus?: string, raceDistance?: string) => {
  const sortedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const selectedDays = sortedDays.filter(day => trainingDays.includes(day));
  const workoutDays = [...selectedDays];
  const allDays = sortedDays.map(day => ({
    day: capitalizeFirstLetter(day),
    workoutType: 'Rest Day',
    distance: 0,
    description: 'Complete rest or light stretching',
    intensityLevel: 'rest' as const
  }));
  
  // Calculate workout distribution based on number of training days
  const workoutDistribution = distributeWorkouts(totalWeekDistance, workoutDays.length, planType, focus, raceDistance);
  
  // Assign workouts to selected days
  workoutDays.forEach((day, index) => {
    const dayIndex = sortedDays.indexOf(day);
    
    if (index < workoutDistribution.length) {
      const workout = workoutDistribution[index];
      allDays[dayIndex] = {
        day: capitalizeFirstLetter(day),
        workoutType: workout.type,
        distance: workout.distance,
        description: workout.description,
        intensityLevel: workout.intensity
      };
    }
  });
  
  return allDays;
};

// Helper function to distribute workouts across days
const distributeWorkouts = (totalDistance: number, numberOfDays: number, planType: GoalType, focus?: string, raceDistance?: string) => {
  const workouts = [];
  
  // Handle edge case of no training days
  if (numberOfDays === 0) return workouts;
  
  if (planType === 'weight-loss') {
    // Weight loss plans focus on frequency and metabolic boost
    if (numberOfDays >= 3) {
      // Long steady run (30% of volume)
      workouts.push({
        type: 'Long Easy Run',
        distance: Math.round(totalDistance * 0.3),
        description: 'Steady pace in fat-burning zone (60-70% max HR)',
        intensity: 'easy' as const
      });
      
      // Interval session (20% of volume)
      workouts.push({
        type: 'Interval Training',
        distance: Math.round(totalDistance * 0.2),
        description: '5-8 x 2min hard efforts with 2min recovery jogs',
        intensity: 'hard' as const
      });
      
      // Distribute remaining volume to easy runs
      const remainingDistance = totalDistance - (Math.round(totalDistance * 0.3) + Math.round(totalDistance * 0.2));
      const remainingDays = numberOfDays - 2;
      const distancePerDay = Math.round(remainingDistance / remainingDays);
      
      for (let i = 0; i < remainingDays; i++) {
        workouts.push({
          type: 'Easy Run',
          distance: distancePerDay,
          description: 'Easy pace, focus on form and enjoying the run',
          intensity: 'easy' as const
        });
      }
    } else {
      // With only 1-2 days, split between steady and intervals
      workouts.push({
        type: 'Steady Run',
        distance: Math.round(totalDistance * 0.6),
        description: 'Moderate pace with 5min easy warmup and cooldown',
        intensity: 'moderate' as const
      });
      
      if (numberOfDays > 1) {
        workouts.push({
          type: 'Interval Mix',
          distance: Math.round(totalDistance * 0.4),
          description: 'Alternating 3min moderate/1min hard throughout run',
          intensity: 'hard' as const
        });
      }
    }
  } else if (planType === 'general-fitness') {
    // Fitness plans based on focus
    if (focus === 'endurance') {
      // Endurance focus with more volume in long runs
      if (numberOfDays >= 3) {
        // Long run (35-40% of volume)
        workouts.push({
          type: 'Long Run',
          distance: Math.round(totalDistance * 0.4),
          description: 'Build endurance with consistent easy pace',
          intensity: 'moderate' as const
        });
        
        // Tempo run (20% of volume)
        workouts.push({
          type: 'Tempo Run',
          distance: Math.round(totalDistance * 0.2),
          description: 'Comfortably hard pace for 15-20min in the middle',
          intensity: 'moderate' as const
        });
        
        // Distribute remaining as easy runs
        const remainingDistance = totalDistance - (Math.round(totalDistance * 0.4) + Math.round(totalDistance * 0.2));
        const remainingDays = numberOfDays - 2;
        const distancePerDay = Math.round(remainingDistance / remainingDays);
        
        for (let i = 0; i < remainingDays; i++) {
          workouts.push({
            type: 'Recovery Run',
            distance: distancePerDay,
            description: 'Very easy effort, focus on recovery',
            intensity: 'easy' as const
          });
        }
      } else {
        // With fewer days, focus on quality
        workouts.push({
          type: 'Long Endurance Run',
          distance: Math.round(totalDistance * 0.6),
          description: 'Build endurance with steady effort',
          intensity: 'moderate' as const
        });
        
        if (numberOfDays > 1) {
          workouts.push({
            type: 'Easy Run',
            distance: Math.round(totalDistance * 0.4),
            description: 'Recovery pace, keep it light',
            intensity: 'easy' as const
          });
        }
      }
    } else if (focus === 'speed') {
      // Speed focus with more quality workouts
      if (numberOfDays >= 3) {
        // Speed intervals (25% of volume)
        workouts.push({
          type: 'Speed Intervals',
          distance: Math.round(totalDistance * 0.25),
          description: '8-10 x 400m at 5K pace with 200m jog recovery',
          intensity: 'hard' as const
        });
        
        // Tempo run (20% of volume)
        workouts.push({
          type: 'Tempo Run',
          distance: Math.round(totalDistance * 0.2),
          description: '15-20min at threshold pace (comfortably hard)',
          intensity: 'moderate' as const
        });
        
        // Long run (30% of volume)
        workouts.push({
          type: 'Long Run',
          distance: Math.round(totalDistance * 0.3),
          description: 'Easy pace to build endurance base',
          intensity: 'moderate' as const
        });
        
        // Distribute remaining as easy runs
        const remainingDistance = totalDistance - (Math.round(totalDistance * 0.25) + Math.round(totalDistance * 0.2) + Math.round(totalDistance * 0.3));
        const remainingDays = numberOfDays - 3;
        const distancePerDay = Math.round(remainingDistance / Math.max(remainingDays, 1));
        
        for (let i = 0; i < remainingDays; i++) {
          workouts.push({
            type: 'Recovery Run',
            distance: distancePerDay,
            description: 'Very easy pace to aid recovery',
            intensity: 'easy' as const
          });
        }
      } else {
        // With fewer days, focus on quality
        workouts.push({
          type: 'Speed + Endurance',
          distance: Math.round(totalDistance * 0.6),
          description: '10min warmup, 6x3min hard w/2min jog, 10min cooldown',
          intensity: 'hard' as const
        });
        
        if (numberOfDays > 1) {
          workouts.push({
            type: 'Easy Run',
            distance: Math.round(totalDistance * 0.4),
            description: 'Recovery pace to balance the hard day',
            intensity: 'easy' as const
          });
        }
      }
    } else {
      // Maintenance focus - balanced approach
      if (numberOfDays >= 3) {
        // Long run (30% of volume)
        workouts.push({
          type: 'Long Run',
          distance: Math.round(totalDistance * 0.3),
          description: 'Steady comfortable pace throughout',
          intensity: 'moderate' as const
        });
        
        // Fartlek (20% of volume)
        workouts.push({
          type: 'Fartlek Run',
          distance: Math.round(totalDistance * 0.2),
          description: 'Mix of paces - alternate 2min hard/2min easy',
          intensity: 'moderate' as const
        });
        
        // Distribute remaining as easy runs
        const remainingDistance = totalDistance - (Math.round(totalDistance * 0.3) + Math.round(totalDistance * 0.2));
        const remainingDays = numberOfDays - 2;
        const distancePerDay = Math.round(remainingDistance / remainingDays);
        
        for (let i = 0; i < remainingDays; i++) {
          workouts.push({
            type: 'Easy Run',
            distance: distancePerDay,
            description: 'Comfortable conversational pace',
            intensity: 'easy' as const
          });
        }
      } else {
        // With fewer days, focus on balanced workouts
        workouts.push({
          type: 'Mixed Pace Run',
          distance: Math.round(totalDistance * 0.6),
          description: '10min easy, 15min moderate, 5min hard, 10min easy',
          intensity: 'moderate' as const
        });
        
        if (numberOfDays > 1) {
          workouts.push({
            type: 'Easy Run',
            distance: Math.round(totalDistance * 0.4),
            description: 'Very easy recovery pace',
            intensity: 'easy' as const
          });
        }
      }
    }
  } else if (planType === 'race-training') {
    // Race training plans
    if (numberOfDays >= 3) {
      // Long run (40% for marathon/ultra, 30% for shorter distances)
      const longRunPercent = (raceDistance === 'marathon' || raceDistance === 'ultra') ? 0.4 : 0.3;
      
      workouts.push({
        type: 'Long Run',
        distance: Math.round(totalDistance * longRunPercent),
        description: raceDistance === 'marathon' || raceDistance === 'ultra' 
          ? 'Build endurance with steady effort, practice nutrition strategy' 
          : 'Build base endurance at conversational pace',
        intensity: 'moderate' as const
      });
      
      // Workout based on race distance
      if (raceDistance === '5k' || raceDistance === '10k') {
        workouts.push({
          type: 'Speed Intervals',
          distance: Math.round(totalDistance * 0.2),
          description: raceDistance === '5k' 
            ? '8-10 x 400m at 5K pace with 90sec recovery' 
            : '5-6 x 800m at 10K pace with 2min recovery',
          intensity: 'hard' as const
        });
      } else {
        workouts.push({
          type: 'Tempo Run',
          distance: Math.round(totalDistance * 0.2),
          description: 'Sustained effort at threshold pace (marathon or half pace +10-20sec/km)',
          intensity: 'moderate' as const
        });
      }
      
      // Third quality session based on approach
      if (focus === 'speed') {
        workouts.push({
          type: 'Hill Repeats',
          distance: Math.round(totalDistance * 0.15),
          description: '6-8 x 60-90sec hill repeats with jog down recovery',
          intensity: 'hard' as const
        });
      } else if (focus === 'high-mileage') {
        workouts.push({
          type: 'Medium-Long Run',
          distance: Math.round(totalDistance * 0.2),
          description: 'Steady run at easy to moderate effort',
          intensity: 'moderate' as const
        });
      } else {
        workouts.push({
          type: 'Steady State Run',
          distance: Math.round(totalDistance * 0.15),
          description: 'Comfortable but purposeful pace throughout',
          intensity: 'moderate' as const
        });
      }
      
      // Distribute remaining as easy runs
      const assignedVolume = raceDistance === 'marathon' || raceDistance === 'ultra'
        ? Math.round(totalDistance * (0.4 + 0.2 + 0.15))
        : Math.round(totalDistance * (0.3 + 0.2 + 0.15));
      
      const remainingDistance = totalDistance - assignedVolume;
      const remainingDays = numberOfDays - 3;
      const distancePerDay = Math.round(remainingDistance / Math.max(remainingDays, 1));
      
      for (let i = 0; i < remainingDays; i++) {
        workouts.push({
          type: 'Recovery Run',
          distance: distancePerDay,
          description: 'Very easy effort to promote recovery',
          intensity: 'easy' as const
        });
      }
    } else {
      // With fewer days, prioritize long run and speed
      workouts.push({
        type: 'Long Run',
        distance: Math.round(totalDistance * 0.65),
        description: 'Build endurance for race day',
        intensity: 'moderate' as const
      });
      
      if (numberOfDays > 1) {
        workouts.push({
          type: 'Quality Session',
          distance: Math.round(totalDistance * 0.35),
          description: 'Mixed intervals based on race distance',
          intensity: 'hard' as const
        });
      }
    }
  }
  
  return workouts;
};

// Helper function to format race distance for display
const formatRaceDistance = (distance: string): string => {
  switch (distance) {
    case '5k':
      return '5K';
    case '10k':
      return '10K';
    case 'half-marathon':
      return 'Half Marathon';
    case 'marathon':
      return 'Marathon';
    case 'ultra':
      return 'Ultra Marathon';
    default:
      return distance;
  }
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Generic function to generate a running plan based on goal type
export const generateRunningPlan = (userData: any): RunningPlan => {
  const { goalType } = userData;
  
  switch (goalType) {
    case 'weight-loss':
      return generateWeightLossPlan(userData);
    case 'general-fitness':
      return generateFitnessPlan(userData);
    case 'race-training':
      return generateRaceTrainingPlan(userData);
    default:
      throw new Error("Unsupported goal type");
  }
};
