'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { AssistantRuntimeProvider, useThread, useComposerRuntime } from '@assistant-ui/react';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Thread } from '@/components/assistant-ui/thread';

function ChatPageContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial message from URL parameter
  const initialMessage = searchParams.get('message');

  const runtime = useChatRuntime({
    api: '/api/chat',
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatWrapper
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        messageCount={messageCount}
        setMessageCount={setMessageCount}
        initialMessage={initialMessage}
        router={router}
      />
    </AssistantRuntimeProvider>
  );
}

function ChatWrapper({
  showAuthModal,
  setShowAuthModal,
  messageCount,
  setMessageCount,
  initialMessage,
  router
}: {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  messageCount: number;
  setMessageCount: (count: number) => void;
  initialMessage: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const thread = useThread();
  const composer = useComposerRuntime();
  const initialSubmitted = useRef(false);
  const [sponsorText, setSponsorText] = useState<string | null>(null);

  // Handle initial message submission using composer
  useEffect(() => {
    if (initialMessage && !initialSubmitted.current && composer) {
      initialSubmitted.current = true;

      // Clear URL parameter
      router.replace('/chat', { scroll: false });

      // Use composer to set text and send
      try {
        composer.setText(initialMessage);
        composer.send();
      } catch (error) {
        console.error('Failed to send initial message:', error);
      }
    }
  }, [initialMessage, router, composer]);

  // Monitor message count for auth modal and sponsor text
  useEffect(() => {
    const messages = thread.messages;
    const userMessages = messages.filter(m => m.role === 'user');

    if (userMessages.length !== messageCount) {
      setMessageCount(userMessages.length);

      // Show auth modal after 3 user messages
      if (userMessages.length === 3) {
        setShowAuthModal(true);
      }

      // Set sponsor text on first message
      if (userMessages.length === 1 && !sponsorText) {
        setSponsorText(Math.random() < 0.9 ? 'AWS infrastructure in Switzerland' : 'Exoscale infrastructure in Switzerland and Austria');
      }
    }
  }, [thread.messages, messageCount, setMessageCount, setShowAuthModal, sponsorText]);

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Sponsor Attribution - shown above first message */}
      {sponsorText && thread.messages.length > 0 && (
        <div className="text-center py-4 bg-background">
          <span className="text-xs text-muted-foreground">
            ⚡ This is running on {sponsorText}.
          </span>
        </div>
      )}
      <Thread />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <div className="flex flex-col items-center justify-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Welcome to Public AI</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              You&apos;re talking to Apertus, from Switzerland. Log in for access to a more intelligent model and the full experience.
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