import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import AttachButton from "./buttons/AttachButton";
import SelectModeButton from "./buttons/SelectModeButton";
import Link from "next/link";

const ChatComponent = ({
  handleSend,
  darkMode
}: {
  handleSend: (message: string, file: File | null) => void;
  darkMode?: boolean
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [aiMode, setAiMode] = useState("thinking");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  const handleSendMessage = () => handleSend(message, file);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`${darkMode ? "bg-chat-text-field-background-dark":"bg-white/80" } p-4 rounded-3xl`}
      >
        <div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.height = "auto"; // Reset height before recalculating
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onInput={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.height = "auto"; // Reset height before recalculating
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onKeyPress={handleKeyPress}
            placeholder="What do you need help with..."
            style={{ minHeight: "48px", maxHeight: "300px", overflowY: "auto" }}
            className={`${darkMode && "text-white"} w-full h-auto p-4 rounded-2xl bg-inherit outline-none placeholder-gray-500 resize-none font-sans`}
            rows={1}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-center gap-5">
            <SelectModeButton value={aiMode} onSelect={setAiMode} />
            <AttachButton
              darkMode={darkMode}
              fileName={fileName}
              handleFileChange={handleFileChange}
              setFile={setFile}
              setFileName={setFileName}
            />
          </div>
          <div>
            <button
              disabled={!message.trim() && !file}
              className={`w-full p-2 rounded-full cursor-pointer bg-primary text-white hover:bg-primary/80 hover:text-white/80 ${darkMode?"disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40":"disabled:bg-black/10 disabled:text-black/40 disabled:hover:bg-black/10 disabled:hover:text-black/40"}`}
              onClick={handleSendMessage}
            >
              <Icon icon="lucide:arrow-up" fontSize={20} />
            </button>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/50 p-2 text-sm text-center"
      >
        <span className="font-thin">
          Please note that this model was trained using the
          <Link
            href="https://www.minijust.gov.rw/laws"
            target="_blank"
            className="text-white/70 hover:underline hover:text-white p-1"
          >
            Rwandan official laws
          </Link>
          only!
        </span>
      </motion.div>
    </div>
  );
};

export default ChatComponent;
