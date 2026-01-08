import { Icon } from "@iconify/react";
import React, { useRef } from "react";

const AttachButton = ({
  fileName,
  handleFileChange,
  setFile,
  setFileName,
  darkMode
}: {
  fileName: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFile: (file: File | null) => void;
  setFileName: (text: string) => void;
  darkMode?: boolean
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        accept=".pdf,.doc,.docx,.txt"
      />
      <label
        htmlFor="file-upload"
        className={`flex items-center justify-center px-4 py-2 rounded-2xl border cursor-pointer ${darkMode ? "border-white/10 text-white hover:bg-white/50":"border-black/10 hover:bg-white/50"} transition-colors max-md:px-2.5 max-md:py-1`}
      >
        <Icon icon="tdesign:attach" />
        <span className="font-medium px-2">
          {fileName || "Attach"}
        </span>
      </label>
      {fileName && (
        <div className="mt-2 flex items-center justify-between p-2 bg-white/30 rounded-lg">
          <span className="text-sm text-gray-700 truncate">{fileName}</span>
          <button
            onClick={() => {
              setFile(null);
              setFileName("");
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachButton;
