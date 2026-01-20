"use client";

import { useState, useRef, useEffect } from "react";
import { MessageStructure } from "@/components/chat/MessageBubble";
import MessagesList from "@/components/chat/MessagesList";
import ChatComponent from "@/components/ChatComponent";
import TopNavigation from "@/components/TopNavigation";
import { useStreamingChat } from "@/hooks/useSSE";
import { generateRandomUUID, generateTextID } from "@/utils/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { find_relevant_cases, read_pdf_document } from "@/utils/tools";

export default function ChatPage({ params }: any) {
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const [updateLocalHost, setUpdateLocalHost] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  const router = useRouter();

  const { sendMessage, stopStreaming, isStreaming } = useStreamingChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    (async () => {
      const result = await read_pdf_document('https://files.amategeko.gov.rw/documents-7872/PROSECUTOR%20v.%20URAYENEZA_WITH_HYPERLINK.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ocrminioadmin%2F20260120%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260120T202804Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=15d68c36b6648addbd5d20053bd80581d8878fcabd92491a841077954fafb9d5')
      console.log("========", result)

    })()

    // if (!conversationId) {
    //   router.push("/");
    // }
    // const savedConversation = localStorage.getItem(`${conversationId}`);
    // if (savedConversation) {
    //   const conversationHistory = JSON.parse(savedConversation);
    //   setMessages(conversationHistory);
    // }
  }, []);

  useEffect(() => {
    if (messages.length === 1 && !currentAssistantMessage) {
      // Handling initial messages.
      const initialMessage = messages[0].text;
      handleSend(initialMessage);
    }
    scrollToBottom();
  }, [messages, currentAssistantMessage]);

  useEffect(() => {
    if (updateLocalHost && !currentAssistantMessage) {
      localStorage.setItem(`${conversationId}`, JSON.stringify(messages));
      setUpdateLocalHost(false)
    }
  }, [updateLocalHost]);

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
    setUpdateLocalHost(true)
  };

  return (
    <div className="flex flex-col h-screen bg-chat-background py-12 px-20 max-md:px-5 max-md:py-0">
      <div className="w-full flex items-center justify-center">
        <div className="w-[70%]">
          <TopNavigation />
        </div></div>
      <div className="flex-1 overflow-y-auto py-6 flex justify-center">
        <div className="w-[70%]">
          <MessagesList
            messages={messages}
            currentMessage={currentAssistantMessage}
            isTyping={isStreaming}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="w-[70%]">
          <ChatComponent
            handleSend={handleSend}
            darkMode
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
