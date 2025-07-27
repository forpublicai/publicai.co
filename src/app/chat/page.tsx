'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Paperclip, Send, Plus, Menu, X } from 'lucide-react';
import { useUser, UserButton } from '@stackframe/stack';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: Date;
  messages: Message[];
}

const SUGGESTION_CARDS = [
  "What are the advantages of using Next.js?",
  "Write code to demonstrate dijkstra's algorithm",
  "Help me write an essay about silicon valley",
  "What is the weather in San Francisco?"
];

export default function ChatPage() {
  // Get current user (null for guests, user object for authenticated users)
  const user = useUser();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('aisingapore/Gemma-SEA-LION-v3-9B-IT');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load chat histories from database on mount (only for authenticated users)
  useEffect(() => {
    if (!user) return; // Skip loading for guest users
    
    const loadConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const { conversations } = await response.json();
          setChatHistories(conversations.map((conv: { id: string; title: string; updatedAt: string }) => ({
            id: conv.id,
            title: conv.title || 'New Chat',
            lastMessage: new Date(conv.updatedAt),
            messages: [] // Messages will be loaded when conversation is selected
          })));
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };
    
    loadConversations();
  }, [user]);

  // Handle URL parameters and conversation loading
  useEffect(() => {
    const conversationId = searchParams.get('id');
    const initialMessage = searchParams.get('message');
    
    if (conversationId && conversationId !== currentChatId) {
      // Load specific conversation only if it's different from current
      loadChat(conversationId);
    } else if (!conversationId && currentChatId) {
      // If URL has no conversation ID but we have a current chat, we're starting a new chat
      // Don't reload anything, just stay in the new chat state
      return;
    } else if (initialMessage && !initialMessageProcessed.current) {
      // Start new conversation with message from home page
      // Only process once using ref to prevent duplicate calls
      initialMessageProcessed.current = true;
      handleSendMessage(initialMessage);
      // Clear the message parameter from URL after using it
      router.replace('/chat', { scroll: false });
    }
  }, [searchParams]);

  // Remove localStorage persistence - data is now in database

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Show auth modal for guest users on first message (but still allow sending)
    if (!user && messages.length === 0) {
      setShowAuthModal(true);
    }

    // Create new chat if none exists
    let chatId = currentChatId;
    if (!chatId) {
      try {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: content.length > 30 ? content.substring(0, 30) + '...' : content,
            model: selectedModel
          })
        });
        
        if (response.ok) {
          const { conversation } = await response.json();
          chatId = conversation.id;
          setCurrentChatId(chatId);
          
          // Update URL to reflect new conversation
          router.push(`/chat?id=${chatId}`, { scroll: false });
          
          // Add to chat histories
          const newChat: ChatHistory = {
            id: chatId!,
            title: conversation.title,
            lastMessage: new Date(conversation.updatedAt),
            messages: []
          };
          setChatHistories(prev => [newChat, ...prev]);
        } else {
          console.error('Failed to create conversation');
          return;
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
        return;
      }
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

    // Update chat title if it's still "New Chat"
    if (chatId) {
      updateChatTitle(chatId, content.trim());
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: selectedModel,
          conversationId: chatId
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
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    router.replace('/chat', { scroll: false });
  };

  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/conversations/${chatId}/messages`);
      if (response.ok) {
        const { messages: dbMessages } = await response.json();
        const formattedMessages = dbMessages.map((msg: { id: string; role: string; content: string; createdAt: string }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt)
        }));
        setMessages(formattedMessages);
        setCurrentChatId(chatId);
        // Update URL to reflect current conversation
        router.push(`/chat?id=${chatId}`, { scroll: false });
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...'
      : firstMessage;
    
    setChatHistories(prev => prev.map(chat => 
      chat.id === chatId && chat.title === 'New Chat'
        ? { ...chat, title }
        : chat
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile Sidebar Overlay - Only show for authenticated users */}
      {user && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Only show for authenticated users */}
      {user && (
        <div className={`
          w-64 bg-sidebar border-r border-sidebar-border flex flex-col
          fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.png" alt="PublicAI" className="w-6 h-6" />
              <h1 className="text-lg font-semibold">PublicAI</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewChat}
                className="p-1 hover:bg-sidebar-accent rounded"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-sidebar-accent rounded lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm text-sidebar-foreground/70 mb-2">Today</h3>
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-2 rounded hover:bg-sidebar-accent text-sm truncate ${
                    currentChatId === chat.id ? 'bg-sidebar-accent' : ''
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-sidebar-foreground/50 mt-8">
            You have reached the end of your chat history.
          </div>
        </div>

          {/* User Profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-8">
              <UserButton />
              <div className="flex-1 min-w-0 pl-2">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.displayName || user?.primaryEmail || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.primaryEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 hover:bg-muted rounded lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-card border border-border rounded px-3 py-1 text-sm"
            >
              <optgroup label="SEA-LION Models">
                <option value="aisingapore/Gemma-SEA-LION-v3-9B-IT">SEA-LION v3 9B Instruct</option>
                <option value="aisingapore/Llama-SEA-LION-v3.5-8B-R">SEA-LION v3.5 8B Reasoning</option>
                <option value="aisingapore/Llama-SEA-Guard-Prompt-v1">SEA-Guard Safety Model</option>
              </optgroup>
              <optgroup label="Mistral Models">
                <option value="mistralai/mistral-nemo">Mistral Nemo</option>
                <option value="mistralai/mistral-small-24b-instruct-2501">Mistral Small 24B</option>
                <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</option>
              </optgroup>
            </select>
          </div>
          
          {/* Auth buttons for guests */}
          {!user && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-border"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded"
              >
                Sign Up
              </button>
            </div>
          )}
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
            <div className="flex items-center justify-center mb-6">
              <img src="/logo.png" alt="PublicAI" className="w-12 h-12 mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Welcome to PublicAI</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              By the Public, For the Public. Log in or sign up to save your chat history and get the full experience.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Log in
              </button>
              
              <button
                onClick={() => router.push('/register')}
                className="w-full py-3 px-6 border border-border text-foreground rounded-full font-medium hover:bg-muted transition-colors"
              >
                Sign up for free
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