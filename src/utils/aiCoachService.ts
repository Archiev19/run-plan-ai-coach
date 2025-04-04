
import { pipeline } from '@huggingface/transformers';

// Configure transformers.js
let textClassificationModel: any = null;

// Initialize models - calling this early will start model loading in the background
export const initializeAICoach = async () => {
  try {
    console.log('Initializing AI Coach with Hugging Face...');
    textClassificationModel = await pipeline(
      'text-classification',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { quantized: true }
    );
    console.log('AI Coach initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize AI Coach:', error);
    return false;
  }
};

// Generate a response based on user question
export const generateAIResponse = async (question: string): Promise<string> => {
  console.log('Generating AI response for:', question);
  
  // If model isn't loaded yet, try to load it
  if (!textClassificationModel) {
    try {
      await initializeAICoach();
    } catch (error) {
      console.error('Could not load model:', error);
      return "I'm still warming up. Please try again in a moment.";
    }
  }
  
  try {
    // First, analyze sentiment to understand if user is frustrated/confused
    const sentiment = await textClassificationModel(question);
    const isPositiveSentiment = sentiment[0].label === 'POSITIVE';
    
    // Use a rule-based system combined with sentiment for better responses
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('injury') || lowerQuestion.includes('pain')) {
      return "If you're experiencing pain or an injury, it's important to rest and possibly consult a healthcare professional. The RICE method (Rest, Ice, Compression, Elevation) can help with minor issues. Consider cross-training activities like swimming or cycling that don't aggravate the injury while you recover.";
    }
    
    if (lowerQuestion.includes('nutrition') || lowerQuestion.includes('food') || lowerQuestion.includes('eat')) {
      return "For runners, proper nutrition is crucial. Focus on complex carbohydrates for energy, lean proteins for muscle repair, and healthy fats. Hydration is also key - aim to drink water throughout the day. Before long runs (>60 minutes), consider carb-loading, and refuel within 30 minutes after with a 4:1 carb-to-protein ratio for optimal recovery.";
    }
    
    if (lowerQuestion.includes('improve') || lowerQuestion.includes('faster') || lowerQuestion.includes('speed')) {
      return "To improve your running speed, incorporate variety in your training: 1) Add interval training (e.g., 400m repeats at 5K pace with recovery jogs), 2) Include tempo runs at a comfortably hard pace, 3) Don't neglect your long, slow runs which build endurance, 4) Strength training, especially for your core and legs, can significantly improve running economy. Consistency is key!";
    }
    
    if (lowerQuestion.includes('beginner') || lowerQuestion.includes('start') || lowerQuestion.includes('new')) {
      return "Welcome to running! Start with a run/walk approach - try 1 minute running, 2 minutes walking, and repeat. Gradually increase your running intervals. Focus on time, not distance initially. Good running form is key: short strides, land midfoot, relaxed shoulders, and gaze forward. Most importantly, progress slowly to avoid injury - follow the 10% rule for increasing weekly mileage.";
    }
    
    if (lowerQuestion.includes('recovery') || lowerQuestion.includes('rest')) {
      return "Recovery is when your body adapts and gets stronger! Incorporate easy days between hard workouts, get 7-9 hours of sleep, stay hydrated, and consider foam rolling or gentle stretching. Active recovery (very light exercise) can be more beneficial than complete rest. Listen to your body - persistent fatigue is a warning sign that you need more recovery time.";
    }
    
    // Default response with sentiment-aware tone
    return isPositiveSentiment 
      ? "That's a great question about running! While I don't have a specific answer prepared, the key principles of effective training include consistency, gradual progression, variety in workouts, and proper recovery. Would you like more specific information about training plans, nutrition, injury prevention, or running technique?"
      : "I understand you might be looking for specific help. Running can be challenging sometimes, but remember that consistency is key. Each runner's journey is unique, and it's important to find what works for you. Could you tell me more specifically what aspect of running you'd like help with - perhaps training, recovery, or motivation?";
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble processing your question right now. Please try again in a moment, or ask something about running plans, nutrition, or training techniques.";
  }
};
