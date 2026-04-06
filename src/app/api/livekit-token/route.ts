import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { RoomConfiguration, RoomAgentDispatch } from "@livekit/protocol";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    const roomName = body.room_name || `dialogue-${Date.now()}`;
    const participantIdentity =
      body.participant_identity || `citizen-${Date.now()}`;
    const participantName = body.participant_name || "Citizen";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
      metadata: body.participant_metadata || "",
      attributes: body.participant_attributes || {},
      ttl: "15m",
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    // Dispatch to the dialogue-agent
    at.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: "dialogue-agent",
          metadata: JSON.stringify({
            language: body.language || "en",
          }),
        }),
      ],
    });

    const participantToken = await at.toJwt();

    return NextResponse.json(
      {
        server_url: serverUrl,
        participant_token: participantToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
