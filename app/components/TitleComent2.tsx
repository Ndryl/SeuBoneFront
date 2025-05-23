"use client";
import { ArrowLeft } from "lucide-react";
import { capDataType } from "../type/types";
import { useRouter } from "next/navigation";

interface TitleComponentProps {
  Mycap?: capDataType;
}

export default function TitleComponent2({ Mycap }: TitleComponentProps) {
  const router = useRouter();

  return Mycap ? (
    <div className="flex flex-col w-full">
      {/* Versão com dados do Mycap */}
      <div className="flex items-center gap-2 xs:gap-3 w-full">
        <ArrowLeft
          strokeWidth={1.5}
          className="w-5 h-5 xs:w-6 xs:h-6 min-w-[20px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/visualizacao")}
          aria-label="Voltar"
        />
        <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-gray-900 truncate max-w-[calc(100%-40px)] xs:max-w-[calc(100%-50px)]">
          {Mycap.nomeModel}
        </h1>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full">
      {/* Versão padrão */}
      <div className="flex items-center gap-2 xs:gap-3 w-full">
        <ArrowLeft
          strokeWidth={2}
          className="w-6 h-6 xs:w-7 xs:h-7 min-w-[24px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/visualizacao")}
          aria-label="Voltar"
        />
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
          Imagem Gerada
        </h1>
      </div>
    </div>
  );
}
