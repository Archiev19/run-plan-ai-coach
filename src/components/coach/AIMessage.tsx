
import React from 'react';

interface AIMessageProps {
  content: string;
}

const AIMessage = ({ content }: AIMessageProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-run-primary flex items-center justify-center text-white shrink-0">
        <span className="text-xs font-semibold">AI</span>
      </div>
      <div className="bg-muted rounded-xl px-4 py-3 max-w-[85%]">
        {content.split('\n').map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AIMessage;
