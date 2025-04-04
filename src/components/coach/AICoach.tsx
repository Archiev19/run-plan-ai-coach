
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from 'lucide-react';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI running coach. I can help with questions about your training plan, running technique, nutrition, recovery, and more. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const response = generateCoachResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const generateCoachResponse = (question: string): string => {
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
    
    // Default response for other questions
    return "That's a great question about running! While I don't have a specific answer prepared, the key principles of effective training include consistency, gradual progression, variety in workouts, and proper recovery. Would you like more specific information about training plans, nutrition, injury prevention, or running technique?";
  };
  
  return (
    <div className="flex flex-col h-[600px] md:h-[700px] border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Running Coach</h2>
        <p className="text-sm text-muted-foreground">Ask about training, nutrition, recovery, and more</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          message.sender === 'ai' ? (
            <AIMessage key={message.id} content={message.content} />
          ) : (
            <UserMessage key={message.id} content={message.content} />
          )
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          placeholder="Ask a question about running or your plan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default AICoach;
