"use client";

import { useState, useRef, useEffect } from "react";
import { MessageStructure } from "@/components/chat/MessageBubble";
import MessagesList from "@/components/chat/MessagesList";
import ChatComponent from "@/components/ChatComponent";
import TopNavigation from "@/components/TopNavigation";
import { useStreamingChat } from "@/hooks/useSSE";
import { generateRandomUUID, generateTextID } from "@/components/utils";
import { useSearchParams, useRouter } from "next/navigation";

export default function ChatPage({ params }: any) {
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  const router = useRouter();

  const { sendMessage, stopStreaming, isStreaming } = useStreamingChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) {
      router.push("/");
    }
    const savedConversation = localStorage.getItem(`${conversationId}`);
    if (savedConversation) {
      const conversationHistory = JSON.parse(savedConversation);
      setMessages(conversationHistory);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 1 && !currentAssistantMessage) {
      // Handling initial messages.
      const initialMessage = messages[0].text;
      handleSend(initialMessage);
    }

    scrollToBottom();
  }, [messages, currentAssistantMessage]);

  const handleSend = async (text: string, file?: File | null) => {
    if (!text.trim()) return;
    setCurrentAssistantMessage("");

    if (messages.length !== 1) {
      const userMessage: MessageStructure = {
        id: generateRandomUUID(),
        text: text,
        isUser: true,
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    await sendMessage(text, {
      onChunk: (chunk) => {
        setCurrentAssistantMessage((prev) => prev + chunk);
      },
      onComplete: (message) => {
        setMessages((prev) => [
          ...prev,
          {
            id: generateTextID(`${message}`),
            text: `${message}`,
            isUser: false,
          },
        ]);
        setCurrentAssistantMessage("");
      },
      onError: (error) => {
        setMessages((prev) => [
          ...prev,
          {
            id: generateTextID(`AI Message error-${generateRandomUUID()}`),
            text: `Error: ${error}`,
            isUser: false,
          },
        ]);
        setCurrentAssistantMessage("");
      },
    });
    // To do: Add a local stystem a way to update the user's local storage. (should mock output for API)
    // localStorage.setItem(`${conversationId}`, JSON.stringify(messages));
  };

  return (
    <div className="flex flex-col h-screen bg-chat-background py-12 px-20 max-md:px-5 max-md:py-0">
      <TopNavigation />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <MessagesList
          messages={messages}
          currentMessage={currentAssistantMessage}
          isTyping={isStreaming}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatComponent
        handleSend={handleSend}
        darkMode
        isStreaming={isStreaming}
      />
    </div>
  );
}
