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
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    } else if (initialMessage && !initialMessageProcessed.current) {
      // Start new conversation with message from home page
      // Only process once using ref to prevent duplicate calls
      initialMessageProcessed.current = true;
      handleSendMessage(initialMessage);
      // Clear the message parameter from URL after using it
      router.replace('/chat', { scroll: false });
    }
  }, [searchParams, currentChatId]);

  // Remove localStorage persistence - data is now in database

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

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
    router.push('/chat', { scroll: false });
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Mobile Sidebar Overlay - Only show for authenticated users */}
      {user && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Only show for authenticated users */}
      {user && (
        <div className={`
          w-64 bg-gray-800 border-r border-gray-700 flex flex-col
          fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Chatbot</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewChat}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-700 rounded lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">Today</h3>
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-2 rounded hover:bg-gray-700 text-sm truncate ${
                    currentChatId === chat.id ? 'bg-gray-700' : ''
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-8">
            You have reached the end of your chat history.
          </div>
        </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <UserButton />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName || user?.primaryEmail || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
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
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 hover:bg-gray-700 rounded lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
              <option value="openai/gpt-4o">GPT-4o</option>
              <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Hello there!</h2>
                <p className="text-gray-400 text-lg">How can I help you today?</p>
              </div>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full px-4">
                {SUGGESTION_CARDS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-left transition-colors"
                  >
                    <div className="text-sm text-gray-300">{suggestion}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 bg-gray-800 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2 bg-gray-800 rounded-lg border border-gray-600 p-2">
              <button className="p-2 hover:bg-gray-700 rounded">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                className="flex-1 bg-transparent resize-none outline-none min-h-[20px] max-h-32 text-white placeholder-gray-400"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}