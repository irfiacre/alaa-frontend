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
    
//     // Add user message immediately
//     const userMessage: MessageStructure = {
//       id: Date.now().toString(),
//       isUser: true,
//       text: text,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setAskedQuestions((prev) => [...prev, text]);

//     // Create placeholder for assistant message
//     const assistantMessageId = (Date.now() + 1).toString();
//     const assistantMessage: MessageStructure = {
//       id: assistantMessageId,
//       isUser: false,
//       text: "",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, assistantMessage]);
// console.log("-----", messages);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/sse/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question: text }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();

//       if (!reader) {
//         throw new Error("No reader available");
//       }

//       let accumulatedContent = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         console.log("::::::", done, value);
        

//         if (done) break;

//         // Decode the chunk
//         const chunk = decoder.decode(value, { stream: true });

//         // Split by SSE event boundaries
//         const lines = chunk.split("\n");

//         for (const line of lines) {
//           console.log("=======", line);
          
//           if (line.startsWith("data: ")) {
//             const data = line.slice(6); // Remove "data: " prefix

//             // Check for completion or error signals
//             if (data === "[DONE]") {
//               return;
//             }

//             if (data.startsWith("[ERROR]")) {
//               console.error("Stream error:", data);
//               setMessages((prev) =>
//                 prev.map((msg) =>
//                   msg.id === assistantMessageId
//                     ? { ...msg, content: "Sorry, an error occurred." }
//                     : msg
//                 )
//               );
//               return;
//             }

//             // Accumulate content
//             accumulatedContent += data;

//             // Update the assistant message with accumulated content
//             setMessages((prev) =>
//               prev.map((msg) =>
//                 msg.id === assistantMessageId
//                   ? { ...msg, content: accumulatedContent }
//                   : msg
//               )
//             );
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error in SSE:", error);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === assistantMessageId
//             ? { ...msg, content: "Failed to get response. Please try again." }
//             : msg
//         )
//       );
//     }
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
