
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, Loader2 } from 'lucide-react';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import { generateAIResponse, initializeAICoach } from '@/utils/aiCoachService';
import { useToast } from '@/components/ui/use-toast';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        const success = await initializeAICoach();
        setModelLoaded(success);
        if (success) {
          console.log('AI Coach model loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load AI Coach model:', error);
        toast({
          title: "AI Coach Warning",
          description: "Running in offline mode. Some advanced features may be limited.",
          variant: "destructive",
        });
      }
    };
    
    loadModel();
  }, [toast]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
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
    setIsProcessing(true);
    
    try {
      // Get AI response using Hugging Face model
      const response = await generateAIResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[600px] md:h-[700px] border rounded-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">AI Running Coach</h2>
            <p className="text-sm text-muted-foreground">Ask about training, nutrition, recovery, and more</p>
          </div>
          {!modelLoaded && (
            <div className="flex items-center text-amber-600 text-sm">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              <span>Loading model...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          message.sender === 'ai' ? (
            <AIMessage key={message.id} content={message.content} />
          ) : (
            <UserMessage key={message.id} content={message.content} />
          )
        ))}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          placeholder="Ask a question about running or your plan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={isProcessing}
        />
        <Button type="submit" size="icon" disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default AICoach;
