import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#D1D1D6] shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
