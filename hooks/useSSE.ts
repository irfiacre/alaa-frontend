import { useState, useCallback } from "react";

interface StreamingChatOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (message?: string) => void;
  onError?: (error: string) => void;
}

export const useStreamingChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const sendMessage = useCallback(
    async (question: string, options?: StreamingChatOptions) => {
      let fullMessage = "";
      const controller = new AbortController();
      setAbortController(controller);
      setIsStreaming(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sse/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setIsStreaming(false);
            options?.onComplete?.(fullMessage);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) {
                  options?.onChunk?.(data.chunk);
                  fullMessage += data.chunk;
                } else if (data.done) {
                  setIsStreaming(false);
                  options?.onComplete?.(fullMessage);
                  break;
                } else if (data.error) {
                  options?.onError?.(data.error);
                  setIsStreaming(false);
                }
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Streaming error:", error);
          options?.onError?.(error.message);
        }
        setIsStreaming(false);
      } finally {
        setAbortController(null);
      }
    },
    []
  );

  const stopStreaming = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsStreaming(false);
    }
  }, [abortController]);

  return {
    sendMessage,
    stopStreaming,
    isStreaming,
  };
};
