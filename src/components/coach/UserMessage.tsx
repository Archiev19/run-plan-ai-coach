
import React from 'react';

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="bg-run-primary text-white rounded-xl px-4 py-3 max-w-[85%]">
        <p>{content}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
        <span className="text-xs font-semibold">You</span>
      </div>
    </div>
  );
};

export default UserMessage;
