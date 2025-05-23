import { useState } from "react";
import TitleComponent from "./TitleComponent";

interface ToggleComponentProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleComponent({
  isActive,
  setIsActive,
}: ToggleComponentProps) {
  return (
    <div className="w-full">
      <div className="w-full justify-between flex items-center">
        <TitleComponent />
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-7 w-11 items-center rounded-full transition-colors border-2 bg-white ${
            isActive ? "border-[#440986]" : "border-[#D1D1D6]"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform border-2 ${
              isActive
                ? "translate-x-4 border-[#440986]"
                : "translate-x-1 border-[#D1D1D6]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
