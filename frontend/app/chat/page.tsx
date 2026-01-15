"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageStructure } from "@/components/chat/MessageBubble";
import MessagesList from "@/components/chat/MessagesList";
import ChatComponent from "@/components/ChatComponent";
import TopNavigation from "@/components/TopNavigation";

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<String[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, file: File | null) => {
    console.log("--->>>", text);
  };

console.log("---->", messages);

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
        <MessagesList
          messages={messages}
          isTyping={isStreaming}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatComponent handleSend={handleSend} darkMode />
    </motion.div>
  );
}
