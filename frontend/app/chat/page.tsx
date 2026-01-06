"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageStructure } from "@/components/chat/MessageBubble";
import MessagesList from "@/components/chat/MessagesList";
import ChatComponent from "@/components/ChatComponent";
import TopNavigation from "@/components/TopNavigation";

// Input area component
const ChatInput = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  inputRef,
}: {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  return (
    <div className="border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  120
                )}px`;
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400 font-sans"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageStructure[]>([
    {
      id: "1",
      text: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: MessageStructure = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: MessageStructure = {
        id: (Date.now() + 1).toString(),
        text: `This is a simulated response. In a real application, this would come from your AI backend. ## First ordered list item         2. Another item         ⋅⋅* Unordered sub-list.         1. Actual numbers don't matter, just that it's a number         ⋅⋅1. Ordered sub-list         4. And another item.          ⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).          ⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅         ⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅         ⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)          * Unordered list can use asterisks         - Or minuses         + Or pluses          1. Make my changes             1. Fix bug             2. Improve formatting                 - Make the headings bigger         2. Push my commits to GitHub         3. Open a pull request             * Describe my changes             * Mention all the members of my team                 * Ask for feedback          + Sub-lists are made by indenting 2 spaces:           - Marker character change forces new list start:             * Ac tristique libero volutpat at             + Facilisis in pretium nisl aliquet             - Nulla volutpat aliquam velit         + Very easy!`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-screen bg-chat-background  py-12 px-20"
    >
      <TopNavigation />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <MessagesList
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatComponent handleSend={handleSend} darkMode/>
    </motion.div>
  );
}
