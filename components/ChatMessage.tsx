
import React from 'react';
import { ChatMessage, Role } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface ChatMessageProps {
  message: ChatMessage;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
    </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  const containerClasses = `flex items-start gap-3 ${!isModel && 'flex-row-reverse'}`;
  const bubbleClasses = `p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl break-words ${
    isModel
      ? 'bg-gray-700/60 text-gray-200 rounded-tl-none'
      : 'bg-blue-600 text-white rounded-tr-none'
  }`;

  const Avatar: React.FC = () => (
    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
      isModel ? 'bg-gray-800' : 'bg-blue-800'
    }`}>
      {isModel ? <SparklesIcon className="w-5 h-5 text-blue-400" /> : <span className="font-bold text-sm">You</span>}
    </div>
  );

  return (
    <div className={containerClasses}>
      <Avatar />
      <div className={bubbleClasses}>
        {message.isLoading ? (
            <LoadingIndicator />
        ) : (
          <div className="space-y-3">
            {message.parts.map((part, index) => (
              <div key={index}>
                {part.imageUrl && (
                  <img
                    src={part.imageUrl}
                    alt="content"
                    className="rounded-lg mb-2 max-h-80 object-contain"
                  />
                )}
                {part.text && <p className="whitespace-pre-wrap">{part.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
