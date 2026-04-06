"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import type { LanguageCode } from "@/lib/languages";

interface VoiceModeProps {
  language: LanguageCode;
  onEnd: () => void;
  onTranscript: (role: "user" | "assistant", text: string) => void;
}

function VoiceSession({ onEnd, onTranscript }: Omit<VoiceModeProps, "language">) {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();

  const localTrackRef = useMemo(() => {
    const audioTrack = localParticipant.microphoneTrack;
    if (!audioTrack) return undefined;
    return {
      participant: localParticipant.localParticipant,
      publication: audioTrack,
      source: Track.Source.Microphone,
    };
  }, [localParticipant.microphoneTrack, localParticipant.localParticipant]);

  const userTranscription = useTrackTranscription(localTrackRef);

  // Forward agent transcriptions
  useEffect(() => {
    if (agentTranscriptions.length === 0) return;
    const last = agentTranscriptions[agentTranscriptions.length - 1];
    if (last.final && last.text) {
      onTranscript("assistant", last.text);
    }
  }, [agentTranscriptions, onTranscript]);

  // Forward user transcriptions
  useEffect(() => {
    const segments = userTranscription.segments;
    if (segments.length === 0) return;
    const last = segments[segments.length - 1];
    if (last.final && last.text) {
      onTranscript("user", last.text);
    }
  }, [userTranscription.segments, onTranscript]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {state === "listening"
          ? "Listening..."
          : state === "thinking"
            ? "Thinking..."
            : state === "speaking"
              ? "Apertus is speaking"
              : "Connecting..."}
      </div>

      <div className="h-20 w-full max-w-xs">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          options={{ minHeight: 8 }}
        />
      </div>

      <button
        onClick={onEnd}
        className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        End voice mode
      </button>

      <RoomAudioRenderer />
    </div>
  );
}

export default function VoiceMode({ language, onEnd, onTranscript }: VoiceModeProps) {
  const [connectionDetails, setConnectionDetails] = useState<{
    serverUrl: string;
    token: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchToken() {
      try {
        const res = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language }),
        });

        if (!res.ok) throw new Error("Failed to get token");

        const data = await res.json();
        if (!cancelled) {
          setConnectionDetails({
            serverUrl: data.server_url,
            token: data.participant_token,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Connection failed");
        }
      }
    }

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [language]);

  const handleDisconnected = useCallback(() => {
    onEnd();
  }, [onEnd]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <p className="text-sm text-red-500">Voice mode unavailable: {error}</p>
        <button
          onClick={onEnd}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Switch to text
        </button>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Connecting to voice...</div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={connectionDetails.serverUrl}
      token={connectionDetails.token}
      connect={true}
      audio={true}
      onDisconnected={handleDisconnected}
      className="w-full"
    >
      <VoiceSession onEnd={onEnd} onTranscript={onTranscript} />
    </LiveKitRoom>
  );
}
