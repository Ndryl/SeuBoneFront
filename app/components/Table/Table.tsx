"use client";
import { useEffect, useState } from "react";
import Filters from "./Filters";
import TableHeader from "./TableHeader";
import Link from "next/link";

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

export default function Table() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dados, setDados] = useState<CapDataFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const paginacao = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isMobile = windowWidth < 768;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full p-4 md:p-5">
        <Filters />
      </div>

      <TableHeader />

      {isLoading ? (
        <div className="text-center p-5">Carregando...</div>
      ) : currentItems.length === 0 ? (
        <div className="text-center p-5">Nenhum item encontrado.</div>
      ) : isMobile ? (
        <div className="space-y-3 px-2">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="border border-[#878B8D4D] rounded-lg p-4"
            >
              <Link
                href={`/pecas/${encodeURIComponent(
                  item.nomeModel
                )}?id=${encodeURIComponent(item.id)}`}
                className="hover:underline font-medium text-[#1C1C1C]"
              >
                {item.key}
              </Link>

              <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
                <div className="text-[#878B8D]">SKU:</div>
                <div>{item.sku}</div>

                <div className="text-[#878B8D]">Tipo Recorte:</div>
                <div>{item.tipoRecorte?.nome || "-"}</div>

                <div className="text-[#878B8D]">Ordem:</div>
                <div>{item.ordemExibicao}</div>

                <div className="text-[#878B8D]">Status:</div>
                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-xs ${
                      item.status
                        ? "bg-[#AFD8AF] text-[#00681B]"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Versão Desktop - Tabela
        <div className="overflow-x-auto">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] text-center text-[#1C1C1C] border-b border-[#878B8D4D] py-4 mx-3"
            >
              <Link
                href={`/pecas/${encodeURIComponent(
                  item.nomeModel
                )}?id=${encodeURIComponent(item.id)}`}
                className="hover:underline cursor-pointer text-left pl-4"
              >
                {item.key}
              </Link>

              <div>{item.sku}</div>
              <div>{item.tipoRecorte?.nome || "-"}</div>
              <div>{item.ordemExibicao}</div>
              <div className="rounded-lg bg-[#AFD8AF] text-[#00681B] max-w-16 mx-auto px-2 py-1 text-sm">
                {item.status ? "Ativo" : "Inativo"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação Responsiva */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 my-5 px-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
        >
          {"<"}
        </button>

        {isMobile ? (
          <span className="px-3 py-1 text-sm">
            {currentPage} / {totalPages}
          </span>
        ) : (
          paginacao.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 text-sm sm:px-3 sm:py-1 rounded ${
                currentPage === page
                  ? "bg-[#070707] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
