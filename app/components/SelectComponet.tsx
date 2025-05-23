"use client";
import { useState, useRef, useEffect } from "react";

interface SelectProps {
  titulo: string;
  options: { id: string; value: string }[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function Select({
  titulo,
  options,
  selectedValue,
  setSelectedValue,
  className = "",
  placeholder = "Selecione o tipo de recorte",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === selectedValue);

  return (
    <div
      className={`flex-1 flex gap-1 flex-col relative ${className}`}
      ref={selectRef}
    >
      <span className="text-sm">{titulo}</span>

      {/* Select personalizado */}
      <div
        className={`rounded-md border border-[#E5E5EA] text-sm p-2 bg-white cursor-pointer flex justify-between items-center ${
          !selectedValue ? "text-[#8E8E93]" : "text-[#181C32]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.value || placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-[#E5E5EA] rounded-md shadow-lg z-50">
          <div
            className="p-2 cursor-pointer text-[#8E8E93] hover:bg-gray-50"
            onClick={() => {
              setSelectedValue("");
              setIsOpen(false);
            }}
          >
            Nenhum valor selecionado
          </div>
          {options.map((option) => (
            <div
              key={option.id}
              className={`p-2 cursor-pointer hover:bg-gray-50 ${
                selectedValue === option.id ? "bg-[#F5F5F5]" : ""
              }`}
              onClick={() => {
                setSelectedValue(option.id);
                setIsOpen(false);
              }}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
