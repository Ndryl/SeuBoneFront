"use client";
import { useEffect, useState } from "react";
import Filters from "./Filters";
import {
  SelectedPiecesProvider,
  useSelectedPieces,
} from "@/app/context/selectedCapBuild";

const ITEMS_PER_PAGE = 10;

type CapDataFromAPI = {
  id: string;
  key: string;
  sku: string;
  tipoRecorte: { nome: string };
  ordemExibicao: number;
  status: boolean;
  nomeModel: string;
};

export default function Table2() {
  const { selectedPieces, addPiece, removePiece } = useSelectedPieces();
  const [currentPage, setCurrentPage] = useState(1);
  const [dados, setDados] = useState<CapDataFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/caps", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDados(data))
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.ceil(dados.length / ITEMS_PER_PAGE);

  const currentItems = dados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginacao = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleCheckboxChange = (item: CapDataFromAPI) => {
    const isSelected = selectedPieces.some((p: any) => p.id === item.id); // Alterado de sku para id
    if (isSelected) {
      removePiece(item.id); // Agora remove pelo id
    } else {
      addPiece(item);
    }
  };

  const isChecked = (item: CapDataFromAPI) =>
    selectedPieces.some((p) => p.id === item.id); // Alterado de sku para id

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Filters />
      </div>

      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] text-sm font-semibold text-[#8E8E93] text-center bg-[#F2F2F7] py-3">
        <div></div>
        <div>Key</div>
        <div>Tipo</div>
        <div>Ordem de Exibição</div>
        <div>Status</div>
      </div>

      {/* Linhas da tabela */}
      {isLoading ? (
        <div className="text-center p-5">Carregando...</div>
      ) : currentItems.length === 0 ? (
        <div className="text-center p-5">Nenhum item encontrado.</div>
      ) : (
        currentItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] text-center text-[#1C1C1C] border-b border-[#878B8D4D] py-3 mx-3 items-center"
          >
            <div>
              <input
                type="checkbox"
                checked={isChecked(item)}
                onChange={() => handleCheckboxChange(item)}
                className="rounded-full border-2 border-[#D9D9D9]"
              />
            </div>
            <div className="text-left pl-4">{item.nomeModel}</div>
            <div>{item.tipoRecorte?.nome || "-"}</div>
            <div>{item.ordemExibicao}</div>
            <div className="rounded-lg bg-[#AFD8AF] text-[#00681B] max-w-16 mx-auto px-2 py-1">
              {item.status ? "Ativo" : "Inativo"}
            </div>
          </div>
        ))
      )}

      {/* Paginação */}
      <div className="flex justify-center items-center gap-2 my-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {"<"}
        </button>

        {paginacao.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-[#070707] text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
