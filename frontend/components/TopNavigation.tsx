import React from "react";
import LogoComponent from "./LogoComponent";
import Link from "next/link";

const TopNavigation = () => {
  return (
    <nav className="flex flex-row items-center justify-between md:justify-between max-md:py-5">
      <LogoComponent />
      <div>
        <div className="gap-10 hidden md:flex">
          <Link
            href="mailto:irfiacre@gmail.com"
            className="text-white/90 hover:text-white hover:underline"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="text-white/90 hover:text-white hover:underline"
          >
            Checkout how I built it!
          </Link>
        </div>

        <div className="relative md:hidden">
          <input type="checkbox" id="menu-toggle" className="peer hidden" />
          <label
            htmlFor="menu-toggle"
            className="flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
          >
            <span className="block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 peer-checked:rotate-45 peer-checked:translate-y-1.5"></span>
            <span className="block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 peer-checked:opacity-0"></span>
            <span className="block w-6 h-0.5 bg-white rounded transition-all duration-300 peer-checked:-rotate-45 peer-checked:-translate-y-1.5"></span>
          </label>
          <div className="absolute right-0 mt-2 w-64 py-2 space-y-5 bg-white text-chat-background rounded-lg shadow-lg opacity-0 scale-95 pointer-events-none transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 peer-checked:pointer-events-auto z-50">
            <nav className="flex flex-col gap-4 py-4 px-6">
              <Link
                href="mailto:irfiacre@gmail.com"
                className="hover:underline"
              >
                Contact
              </Link>
              <hr />
              <Link href="#" className="hover:underline">
                Checkout how I built it!
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
