import { Icon } from "@iconify/react";
import React from "react";

const SelectModeButton = ({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (selected: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-center text-primary px-3 py-2.5 max-md:p-0">
      <Icon icon={value == "thinking" ? "flowbite:brain-outline" :"mynaui:lightning-solid"} fontSize={24} />
      <select
        name="model"
        id="model"
        className="bg-inherit w-full px-2 bg-neutral-secondary-medium text-heading rounded-base outline-none shadow-xs placeholder:text-body font-medium max-md:text-sm"
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="thinking">Thinking</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  );
};

export default SelectModeButton;
