'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Paperclip, Send } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


const SUGGESTION_CARDS = [
  "What are the advantages of using Next.js?",
  "Write code to demonstrate dijkstra's algorithm",
  "Help me write an essay about silicon valley",
  "What is the weather in San Francisco?"
];

function ChatPageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('aisingapore/Gemma-SEA-LION-v3-9B-IT');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Show auth modal for guest users on first message (but still allow sending)
    if (messages.length === 0) {
      setShowAuthModal(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + parsed.content }
                    : msg
                ));
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, selectedModel]);

  // Handle initial message from URL parameters
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    
    if (initialMessage && !initialMessageProcessed.current) {
      // Start new conversation with message from home page
      initialMessageProcessed.current = true;
      handleSendMessage(initialMessage);
      // Clear the message parameter from URL after using it
      router.replace('/chat', { scroll: false });
    }
  }, [searchParams, router, handleSendMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <Image src="/logo-large.png" alt="PublicAI" width={120} height={24} className="h-6" />
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-card border border-border rounded px-3 py-1 text-sm"
            >
              <optgroup label="SEA-LION Models">
                <option value="aisingapore/Llama-SEA-LION-v3.5-70B-R">SEA-LION v3.5 (70B, R)</option>
                <option value="aisingapore/Llama-SEA-LION-v3.5-8B-R">SEA-LION v3.5 (8B, R)</option>
                <option value="aisingapore/Llama-SEA-LION-v3-70B-IT">SEA-LION v3 (70B, Instruction-Tuned)</option>
                <option value="aisingapore/Gemma-SEA-LION-v3-9B-IT">SEA-LION v3 (9B, IT, Gemma base)</option>
              </optgroup>
              <optgroup label="Mistral Models">
                <option value="mistralai/mistral-nemo">Mistral Nemo</option>
                <option value="mistralai/mistral-small-24b-instruct-2501">Mistral Small 24B</option>
                <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</option>
              </optgroup>
            </select>
          </div>
          
          {/* Get Started button */}
          <div className="flex items-center">
            <button
              onClick={() => window.open('https://app.publicai.company', '_blank')}
              className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Hello there!</h2>
                <p className="text-muted-foreground text-lg">How can I help you today?</p>
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full px-4">
                {SUGGESTION_CARDS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 bg-card hover:bg-muted border border-border rounded-lg text-left transition-colors"
                  >
                    <div className="text-sm text-card-foreground">{suggestion}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-card-foreground border border-border'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 bg-card border border-border rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2 bg-card rounded-lg border border-border p-2">
              <button className="p-2 hover:bg-muted rounded">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                className="flex-1 bg-transparent resize-none outline-none min-h-[20px] max-h-32 text-foreground placeholder-muted-foreground"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for Guest Users */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <div className="flex flex-col items-center justify-center mb-6">
              <Image src="/logo-large.png" alt="PublicAI" width={120} height={64} className="h-16 mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Welcome to PublicAI</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              By the Public, For the Public. Join us to save your chat history and get the full experience.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.open('https://app.publicai.company', '_blank')}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </button>
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-muted-foreground hover:text-foreground underline text-sm mt-4"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-background items-center justify-center">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}