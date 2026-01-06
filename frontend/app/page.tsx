"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LogoComponent from "@/components/LogoComponent";
import ChatComponent from "@/components/ChatComponent";
import Link from "next/link";
import { Icon } from "@iconify/react";
import TopNavigation from "@/components/TopNavigation";

export default function Home() {
  const router = useRouter();

  const handleSend = (message: string, file: File | null) => {    
    if (message.trim() || file) {
      // Navigate to chat page with transition
      router.push("/chat");
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen relative overflow-hidden bg-chat-text-field-background-dark"
      >
        <div className="relative z-10 min-h-screen py-12 px-20">
          <TopNavigation />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center py-20 space-y-10"
          >
            <div className="w-full flex items-center justify-center flex-col text-white">
              <h1 className="text-7xl py-5">The first AI</h1>
              <h1 className="text-7xl py-5 text-primary">
                Legal Consultant
              </h1>
            </div>
            <div className="w-[80%]">
              <ChatComponent handleSend={handleSend} />
            </div>
          </motion.div>
          <div className="absolute bottom-0 flex flex-col items-center justify-center w-full -mx-20">
            <div className="w-full text-center text-white/80 flex flex-row items-center justify-center gap-5">
            <span>Iradukunda</span>
            <Link
              href="https://www.linkedin.com/in/irfiacre/"
              target="_blank"
              className="p-2 cursor-pointer hover:text-[#0077B5] hover:bg-white hover:rounded-full"
            >
              <Icon icon="ri:linkedin-fill" fontSize={20} />
            </Link>

            <Link
              href="https://github.com/irfiacre"
              target="_blank"
              className="p-2 cursor-pointer hover:bg-white hover:text-black hover:rounded-full"
            >
              <Icon icon="mynaui:github" fontSize={20} />
            </Link>

            <Link
              href="https://x.com/koraarw"
              target="_blank"
              className="p-2 cursor-pointer hover:bg-white hover:text-black hover:rounded-full"
            >
              <Icon icon="codicon:twitter" fontSize={20} />
            </Link>

            <Link
              href="https://www.youtube.com/@iradukunda-dev"
              target="_blank"
              className="p-2 cursor-pointer hover:text-[#FF0000] hover:bg-white hover:rounded-full"
            >
              <Icon icon="mynaui:youtube" fontSize={20} />
            </Link>

            <Link
              href="https://www.instagram.com/irfiacre/"
              target="_blank"
              className="p-2 cursor-pointer hover:text-[#833AB4] hover:bg-white hover:rounded-full"
            >
              <Icon icon="mdi:instagram" fontSize={20} />
            </Link>
          
          </div>
          <p className="text-center text-white/50 text-sm py-10">
            Made in Rwanda
          </p>
          </div>
          
        </div>
        <div className="absolute top-0 w-full h-full">
          <video
            src={require("../public/videos/landing_video.mp4")}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            style={{ filter: "blur(18px) brightness(0.28) saturate(120%)" }} // less blur for recognizability
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "rgba(30, 32, 40, 0.7)", // dark gray glassmorphism
              backdropFilter: "blur(10px) saturate(160%)",
              WebkitBackdropFilter: "blur(10px) saturate(160%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {/* Subtle noise overlay */}
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.09,
                mixBlendMode: "overlay",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='128' height='128' filter='url(%23noise)'/></svg>")`,
                backgroundRepeat: "repeat",
                zIndex: 2,
              }}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
