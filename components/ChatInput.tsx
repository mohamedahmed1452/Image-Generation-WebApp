
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { AppMode, ImageFile } from '../types';
import PaperclipIcon from './icons/PaperclipIcon';
import SendIcon from './icons/SendIcon';
import XCircleIcon from './icons/XCircleIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ChatInputProps {
  onSendMessage: (prompt: string, imageFile?: ImageFile) => void;
  mode: AppMode;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, mode, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImageFile({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if ((!prompt.trim() && !imageFile) || isLoading) return;
    onSendMessage(prompt, imageFile || undefined);
    setPrompt('');
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }

  const removeImage = () => {
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const placeholderText = mode === AppMode.CHAT ? "Message Gemini..." : "Enter a prompt to generate an image...";
  const buttonText = mode === AppMode.IMAGE ? 'Generate' : 'Send';
  const ButtonIcon = mode === AppMode.IMAGE ? SparklesIcon : SendIcon;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm sticky bottom-0 border-t border-gray-700 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {imageFile && mode === AppMode.CHAT && (
            <div className="relative inline-block mb-2">
                <img src={`data:${imageFile.mimeType};base64,${imageFile.base64}`} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-800 rounded-full text-white hover:bg-gray-700">
                    <XCircleIcon className="w-6 h-6"/>
                </button>
            </div>
        )}
        <div className="flex items-center p-1.5 pl-4 bg-gray-800 rounded-2xl">
          {mode === AppMode.CHAT && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Attach file"
            >
              <PaperclipIcon className="w-6 h-6" />
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
            </button>
          )}
          <textarea
            ref={textAreaRef}
            value={prompt}
            onChange={handleTextAreaInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            rows={1}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none max-h-48"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center justify-center bg-blue-600 text-white rounded-xl px-4 py-2 ml-2 font-semibold transition-opacity hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ButtonIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
