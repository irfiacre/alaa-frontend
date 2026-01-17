import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const LogoComponent = () => {
  return (
    <Link href={"/"} className="text-white">
      <div className="flex items-center gap-2">
        <Icon icon="mdi:legal" fontSize={32} />
        <span className="text-2xl">alaa</span>
      </div>
    </Link>
  );
};

export default LogoComponent;
