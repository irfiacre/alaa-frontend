"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageStructure } from "@/components/chat/MessageBubble";
import MessagesList from "@/components/chat/MessagesList";
import ChatComponent from "@/components/ChatComponent";
import TopNavigation from "@/components/TopNavigation";
import { useStreamingChat } from "@/hooks/useSSE";

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, stopStreaming, isStreaming } = useStreamingChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // scrollToBottom();
    console.log("----> hahah");
    
  }, [messages, currentAssistantMessage]);

  const handleSend = async (text: string, file: File | null) => {
    if (!text.trim()) return;

    const userMessage: MessageStructure = {
      id: `user-${Date.now()}`,
      text: text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentAssistantMessage("");

    const assistantMessageId = `assistant-${Date.now()}`;

    await sendMessage(text, {
      onChunk: (chunk) => {
        setCurrentAssistantMessage((prev) => prev + chunk);
      },
      onComplete: () => {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            text: currentAssistantMessage,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        setCurrentAssistantMessage("");
      },
      onError: (error) => {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            text: `Error: ${error}`,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        setCurrentAssistantMessage("");
      },
    });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-screen bg-chat-background py-12 px-20 max-md:px-5 max-md:py-0"
    >
      <TopNavigation />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* <MessagesList
          messages={messages}
          isTyping={isStreaming}
          messagesEndRef={messagesEndRef}
        /> */}
        <MessagesList
          messages={messages}
          currentMessage={currentAssistantMessage}
          isTyping={isStreaming}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatComponent handleSend={handleSend} darkMode />
    </motion.div>
  );
}
