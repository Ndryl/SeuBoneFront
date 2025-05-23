"use client";
import { useEffect, useState } from "react";
import { useSelectedPieces } from "@/app/context/selectedCapBuild";
import Link from "next/link";

type CapDetail = {
  id: string;
  key: string;
  ordermExibicao: number;
  // Adicione outros campos necessários
};

export default function Table3() {
  const { selectedPieces } = useSelectedPieces();
  const [capDetails, setCapDetails] = useState<CapDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCapDetails = async () => {
      try {
        const details = await Promise.all(
          selectedPieces.map(async (piece) => {
            const response = await fetch(
              `http://localhost:3001/caps/${piece.id}`
            );
            if (!response.ok) throw new Error("Falha ao carregar detalhes");
            return response.json();
          })
        );
        setCapDetails(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedPieces.length > 0) {
      fetchCapDetails();
    } else {
      setCapDetails([]);
      setIsLoading(false);
    }
  }, [selectedPieces]);

  return (
    <div className="w-full min-h-96">
      {/* Header com fundo cinza claro e sem borda */}
      <div className="grid grid-cols-[2fr_1fr] text-center text-sm text-[#8E8E93] bg-[#F2F2F7] py-2 justify-center px-2 rounded-t-2xl">
        <div className="text-center pl-4">Set</div>
        <div>Ordem de Exibição</div>
      </div>

      {/* Linhas da tabela */}
      {isLoading ? (
        <div className="text-center p-5">Carregando...</div>
      ) : capDetails.length === 0 ? (
        <div className="text-center p-5">
          {selectedPieces.length === 0
            ? "Nenhum item selecionado"
            : "Nenhum detalhe encontrado para os itens selecionados"}
        </div>
      ) : (
        capDetails.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr] text-center font-bold text-[#1C1C1C] py-4 mx-3"
          >
            <Link
              href={`/pecas/${encodeURIComponent(
                item.key
              )}?id=${encodeURIComponent(item.id)}`}
              className="hover:underline cursor-pointer text-left pl-4"
            >
              {item.key}
            </Link>
            <div>{item.ordermExibicao}</div>
          </div>
        ))
      )}
    </div>
  );
}
