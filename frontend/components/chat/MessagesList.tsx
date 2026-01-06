import { AnimatePresence } from "framer-motion";
import React from "react";
import MessageBubble, { MessageStructure } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const MessagesList = ({
  messages,
  isTyping,
  messagesEndRef,
}: {
  messages: MessageStructure[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </AnimatePresence>
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
