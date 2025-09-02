'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send } from 'lucide-react';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTION_CARDS = [
  "I want to hike the Alps",
  "I want to make a linzertorte",
  "I want to make a lot of money very slowly",
  "I want to give back to my community"
];

function ChatPageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel] = useState('swiss-ai/apertus-8b-instruct');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageProcessed = useRef(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Show auth modal for guest users on first message and after 8 messages (but still allow sending)
    if (messages.length === 0 || messages.length === 8) {
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
    
    // Keep textarea focused after sending message
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(errorData.error || 'Too many requests. Please wait a moment before trying again.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Message too long. Please keep messages under 10000 characters.');
        } else {
          throw new Error(errorData.error || 'Failed to send message. Please try again.');
        }
      }

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
      
      // Remove the user message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      
      // Set error message for display
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      
      // Restore the input
      setInput(content.trim());
    } finally {
      setIsLoading(false);
      // Refocus textarea when loading completes
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
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
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">What can you do?</h2>
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
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center space-x-2 bg-card rounded-lg border border-border p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                className="flex-1 bg-transparent resize-none outline-none min-h-[20px] max-h-32 text-foreground placeholder-muted-foreground pl-2"
                rows={1}
                autoFocus
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
              <h2 className="text-2xl font-bold text-foreground">Welcome to Public AI</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              You&apos;re talking to Apertus, from Switzerland. Log in for the full experience.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => window.open('https://chat.publicai.co', '_blank')}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Log in or sign up
              </button>
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-muted-foreground hover:text-foreground underline text-sm mt-4"
              >
                Stay logged out
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
    <Suspense fallback={<div className="flex h-[calc(100vh-4rem)] bg-background items-center justify-center">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}