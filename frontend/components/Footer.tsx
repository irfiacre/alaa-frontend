import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="absolute bottom-0 flex flex-col items-center justify-center w-full md:-mx-20 -mx-5">
      <div className="w-full text-center text-white/80 flex flex-row max-md:flex-col items-center justify-center gap-5">
        <span className="max-md:hidden">Iradukunda</span>
        <div className="flex flex-row items-center justify-center gap-5">
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
      </div>
      <p className="text-center text-white/50 text-sm md:py-10 py-5">Made in Rwanda</p>
    </div>
  );
};

export default Footer;
