"use client";
import { useState } from "react";
import Button from "../Button";
import { ListFilter, Search } from "lucide-react";

export default function Filters() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="-w-full hidden md:flex justify-between">
      <div className="w-full flex gap-2 ">
        <button
          className={`p-4 border-none ${
            selected === 1
              ? "bg-[#070707] text-white rounded-xl"
              : "bg-none text-[#8E8E93]"
          }`}
          onClick={() => setSelected(1)}
        >
          Todos (000)
        </button>
        <button
          className={`p-4 border-none ${
            selected === 2
              ? "bg-[#070707] text-white rounded-xl"
              : "bg-none text-[#8E8E93]"
          }`}
          onClick={() => setSelected(2)}
        >
          Ativos (0)
        </button>
        <button
          className={`p-4 border-none ${
            selected === 3
              ? "bg-[#070707] text-white rounded-xl"
              : "bg-none text-[#8E8E93]"
          }`}
          onClick={() => setSelected(3)}
        >
          Expirados (0)
        </button>
      </div>
      <div className="flex items-center justify-center gap-10">
        <div className="flex">
          <input type="text " className="border border-[#C7C7CC] rounded-2xl" />
          <Button />
        </div>
        <ListFilter />
      </div>
    </div>
  );
}
