import type { StreamTextTransform, TextStreamPart, ToolSet } from "ai";

const INNER_PREFIX = "<|inner_prefix|>";
const INNER_SUFFIX = "<|inner_suffix|>";

type Phase = "detecting" | "inner" | "outer";

function maxSuffixPrefixOverlap(text: string, token: string): number {
  const max = Math.min(text.length, token.length - 1);
  for (let len = max; len > 0; len--) {
    if (text.endsWith(token.slice(0, len))) {
      return len;
    }
  }
  return 0;
}

function stripSpecialTokens(text: string): string {
  return text.replaceAll(INNER_PREFIX, "").replaceAll(INNER_SUFFIX, "");
}

/**
 * Splits Apertus thinking-model output into hidden reasoning and visible response.
 *
 * Thinking models may emit `<|inner_prefix|>...<|inner_suffix|>` around internal
 * deliberation, then repeat the final answer after the suffix. Without parsing,
 * clients show both sections as one duplicated message.
 */
export function apertusThinkingStreamTransform<
  TOOLS extends ToolSet = ToolSet,
>(): StreamTextTransform<TOOLS> {
  return () => {
    let phase: Phase = "detecting";
    let buffer = "";
    let streamId = "text-0";
    let reasoningOpen = false;
    let textOpen = false;

    const closeReasoning = (
      controller: TransformStreamDefaultController<TextStreamPart<TOOLS>>,
    ) => {
      if (!reasoningOpen) {
        return;
      }

      controller.enqueue({
        type: "reasoning-end",
        id: `${streamId}-reasoning`,
      });
      reasoningOpen = false;
    };

    const emitReasoning = (
      controller: TransformStreamDefaultController<TextStreamPart<TOOLS>>,
      text: string,
    ) => {
      const cleaned = stripSpecialTokens(text);
      if (!cleaned) {
        return;
      }

      if (!reasoningOpen) {
        controller.enqueue({
          type: "reasoning-start",
          id: `${streamId}-reasoning`,
        });
        reasoningOpen = true;
      }

      controller.enqueue({
        type: "reasoning-delta",
        id: `${streamId}-reasoning`,
        text: cleaned,
      });
    };

    const emitText = (
      controller: TransformStreamDefaultController<TextStreamPart<TOOLS>>,
      text: string,
    ) => {
      const cleaned = stripSpecialTokens(text);
      if (!cleaned) {
        return;
      }

      closeReasoning(controller);

      if (!textOpen) {
        controller.enqueue({ type: "text-start", id: streamId });
        textOpen = true;
      }

      controller.enqueue({
        type: "text-delta",
        id: streamId,
        text: cleaned,
      });
    };

    const processBuffer = (
      controller: TransformStreamDefaultController<TextStreamPart<TOOLS>>,
    ) => {
      while (buffer.length > 0) {
        if (phase === "detecting") {
          // If the buffer starts with the full INNER_PREFIX, consume it and transition to inner phase
          if (buffer.startsWith(INNER_PREFIX)) {
            buffer = buffer.slice(INNER_PREFIX.length);
            phase = "inner";
            continue;
          }

          // If the buffer is a prefix of INNER_PREFIX, wait for more chunks to decide
          if (INNER_PREFIX.startsWith(buffer)) {
            return;
          }

          // Otherwise, it does not start with the reasoning token, transition to outer (text) phase
          phase = "outer";
          continue;
        }

        if (phase === "inner") {
          if (buffer.startsWith(INNER_PREFIX)) {
            buffer = buffer.slice(INNER_PREFIX.length);
            continue;
          }

          const suffixIdx = buffer.indexOf(INNER_SUFFIX);
          if (suffixIdx >= 0) {
            emitReasoning(controller, buffer.slice(0, suffixIdx));
            closeReasoning(controller);
            buffer = buffer.slice(suffixIdx + INNER_SUFFIX.length);
            phase = "outer";
            continue;
          }

          const holdback = maxSuffixPrefixOverlap(buffer, INNER_SUFFIX);
          const emitLen = buffer.length - holdback;
          if (emitLen <= 0) {
            return;
          }

          emitReasoning(controller, buffer.slice(0, emitLen));
          buffer = buffer.slice(emitLen);
          return;
        }

        if (phase === "outer") {
          emitText(controller, buffer);
          buffer = "";
        }
      }
    };

    const finalize = (
      controller: TransformStreamDefaultController<TextStreamPart<TOOLS>>,
    ) => {
      if (buffer.length > 0) {
        emitText(controller, buffer);
        buffer = "";
      }

      closeReasoning(controller);

      if (textOpen) {
        controller.enqueue({ type: "text-end", id: streamId });
        textOpen = false;
      }
    };

    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        if (chunk.type === "text-start") {
          streamId = chunk.id;
          return;
        }

        if (chunk.type === "text-end") {
          finalize(controller);
          return;
        }

        if (chunk.type === "text-delta") {
          buffer += chunk.text;
          processBuffer(controller);
          return;
        }

        controller.enqueue(chunk);
      },
      flush(controller) {
        finalize(controller);
      },
    });
  };
}
