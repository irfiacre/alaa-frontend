import React, { useState } from "react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import { Icon } from "@iconify/react";

export interface MessageStructure {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MessageBubble = ({ message }: { message: MessageStructure }) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} `}
    >
      <div
        className={`max-w-full rounded-2xl px-4 py-3 ${
          message.isUser
            ? "bg-chat-text-field-background-dark text-white rounded-br-sm"
            : "text-white"
        }`}
      >
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          <Markdown>{message.text}</Markdown>
        </div>

        {!message.isUser && (
          <button
            className="text-[#4F555C] py-2 flex flex-row items-center justify-center gap-2"
            title="Copy to clipboard"
            onClick={() => {
              navigator.clipboard.writeText(message.text);
              setCopiedText(true);
              setTimeout(() => {
                setCopiedText(false);
              }, 2000);
            }}
          >
            <Icon
              icon={copiedText ? "tabler:copy-check-filled" : "tabler:copy"}
              fontSize={18}
              className={copiedText ? "text-green-400/80" : ""}
            />
            {copiedText && (
              <span className="text-xs text-green-400/80">
                Copied to clipboard
              </span>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
