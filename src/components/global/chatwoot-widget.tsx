"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Multi-inbox Chatwoot tokens per Section 5.6 of design/spec.md:
 * - WEBSITE: General website routes (/, /projects/*, /research/*, /about, /contributing, /kiosks, /tc)
 * - CHAT: Chat product routes (/chat, /products/chat, /products/mobile)
 * - PLATFORM: API Platform & developer documentation routes (/docs/*, /models, /pricing, /products/api, /products/agents, /batch, /voice, /agents)
 */
export const CHATWOOT_TOKENS = {
  WEBSITE: "w9uGuvbAEpf5Z6rvDnva9S8o",
  CHAT: "hV2UdNaY7oA6kg3sA3qbae4y",
  PLATFORM: "AP6os8SLpF933WEnEzRqdfnT",
} as const;

const BASE_URL = "https://app.chatwoot.com";
const SCRIPT_ID = "chatwoot-sdk-script";

export function resolveChatwootToken(pathname: string): string {
  if (
    pathname === "/chat" ||
    pathname.startsWith("/chat/") ||
    pathname === "/products/chat" ||
    pathname.startsWith("/products/chat/") ||
    pathname === "/products/mobile"
  ) {
    return CHATWOOT_TOKENS.CHAT;
  }

  if (
    pathname === "/docs" ||
    pathname.startsWith("/docs/") ||
    pathname === "/models" ||
    pathname === "/pricing" ||
    pathname === "/products/api" ||
    pathname.startsWith("/products/api/") ||
    pathname === "/products/agents" ||
    pathname === "/batch" ||
    pathname === "/voice" ||
    pathname === "/agents"
  ) {
    return CHATWOOT_TOKENS.PLATFORM;
  }

  return CHATWOOT_TOKENS.WEBSITE;
}

declare global {
  interface Window {
    chatwootSettings?: {
      position?: string;
      type?: string;
      launcherTitle?: string;
      [key: string]: unknown;
    };
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
      [key: string]: unknown;
    };
  }
}

export function ChatwootWidget() {
  const pathname = usePathname() || "/";
  const activeTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const token = resolveChatwootToken(pathname);

    window.chatwootSettings = {
      position: "right",
      type: "standard",
      launcherTitle: "",
    };

    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      if (window.chatwootSDK && activeTokenRef.current !== token) {
        activeTokenRef.current = token;
        window.chatwootSDK.run({
          websiteToken: token,
          baseUrl: BASE_URL,
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;

    script.onload = () => {
      activeTokenRef.current = token;
      window.chatwootSDK?.run({
        websiteToken: token,
        baseUrl: BASE_URL,
      });
    };

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}

export default ChatwootWidget;
