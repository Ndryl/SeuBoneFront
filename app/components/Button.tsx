"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  conteudo?: string;
  Link?: string;
  submit?: "submit";
  estilo?: "neutro";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  conteudo,
  Link,
  submit,
  estilo,
  disabled = false,
  className,
}: ButtonProps) {
  const router = useRouter();

  const handleSubmitLink = (link: string) => {
    router.push(link);
  };

  const baseStyles = "p-4 cursor-pointer rounded-2xl transition-all";
  const styleNeutro = "border border-black text-black bg-transparent";
  const stylePadrao = "bg-[#070707] text-white";
  const styleDisabled = "opacity-50 cursor-not-allowed";

  const estiloClasse = `${estilo === "neutro" ? styleNeutro : stylePadrao} ${
    disabled ? styleDisabled : ""
  }`;

  return (
    <button
      className={`${baseStyles} ${estiloClasse} ${className}`}
      onClick={() => {
        if (!disabled && Link) handleSubmitLink(Link);
      }}
      type={submit ?? "button"}
      disabled={disabled}
    >
      {conteudo ?? <Search />}
    </button>
  );
}
