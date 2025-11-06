
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, ChatMessage, ImageFile, MessagePart, Role } from './types';
import { generateText, generateImage } from './services/geminiService';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: Role.MODEL,
        parts: [{ text: "Hello! I'm Gemini. How can I help you today? You can ask me questions or switch to image mode to generate images." }],
      },
    ]);
  }, []);
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (prompt: string, imageFile?: ImageFile) => {
    if (!prompt.trim() && !imageFile) return;

    setIsLoading(true);

    const userParts: MessagePart[] = [];
    if(prompt.trim()) userParts.push({ text: prompt });
    if(imageFile) userParts.push({ imageUrl: `data:${imageFile.mimeType};base64,${imageFile.base64}` });

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      parts: userParts,
    };

    const loadingMessageId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      role: Role.MODEL,
      parts: [],
      isLoading: true,
    };
    
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      let responseText = '';
      let responseImageUrl: string | undefined = undefined;

      if (mode === AppMode.CHAT) {
        responseText = await generateText(prompt, imageFile);
      } else {
        const imageUrl = await generateImage(prompt);
        // Check if the response is an image URL or an error message
        if (imageUrl.startsWith('data:image')) {
            responseImageUrl = imageUrl;
        } else {
            responseText = imageUrl;
        }
      }

      const modelParts: MessagePart[] = [];
      if(responseText) modelParts.push({ text: responseText });
      if(responseImageUrl) modelParts.push({ imageUrl: responseImageUrl });
      
      const modelMessage: ChatMessage = {
        id: loadingMessageId,
        role: Role.MODEL,
        parts: modelParts,
      };
      
      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessageId ? modelMessage : msg))
      );
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: loadingMessageId,
        role: Role.MODEL,
        parts: [{ text: 'Something went wrong. Please try again.' }],
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <SparklesIcon className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-200">How can I help you today?</h2>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header mode={mode} setMode={setMode} />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.length > 1 ? (
             <div className="space-y-6">
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}
            </div>
          ) : <WelcomeScreen />}
        </div>
      </main>
      <ChatInput onSendMessage={handleSendMessage} mode={mode} isLoading={isLoading} />
    </div>
  );
};

export default App;
