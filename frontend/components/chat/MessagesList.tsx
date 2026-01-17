import { AnimatePresence } from "framer-motion";
import React from "react";
import MessageBubble, { MessageStructure } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const MessagesList = ({
  messages,
  isTyping,
  currentMessage,
  messagesEndRef,
}: {
  messages: MessageStructure[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentMessage?: string;
}) => {
  const currentMessageObj: MessageStructure = {
    id: Math.floor(Math.random() * 10000 + 1).toString(),
    text: `${currentMessage}`,
    isUser: false,
    timestamp: new Date(),
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {currentMessage && (
          <MessageBubble
            key={currentMessageObj.id}
            message={currentMessageObj}
          />
        )}
      </AnimatePresence>
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
