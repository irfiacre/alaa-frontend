import React from "react";
import LogoComponent from "./LogoComponent";
import Link from "next/link";

const TopNavigation = () => {
  return (
    <nav className="flex flex-row items-center justify-between">
      <LogoComponent />
      <div className="flex gap-10">
        <Link
          href="mailto:irfiacre@gmail.com"
          className="text-white/90 hover:text-white hover:underline"
        >
          Contact
        </Link>
        {/* TO DO: Add video link for youtube */}
        <Link
          href="#"
          className="text-white/90 hover:text-white hover:underline"
        >
          Checkout how I built it!
        </Link>
      </div>
    </nav>
  );
};

export default TopNavigation;
