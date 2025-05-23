"use client";
import { useEffect, useRef, useState } from "react";
import { useSelectedPieces } from "@/app/context/selectedCapBuild";
import Card from "@/app/components/Card";
import Table3 from "@/app/components/Table/Table3";
import TitleComponent2 from "@/app/components/TitleComent2";

type CapDetail = {
  id: string;
  key: string;
  ordermExibicao: number;
  imagemUrl: string; // importante: nome deve bater com o que vem da API
};

export default function GerarImagePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedPieces } = useSelectedPieces();
  const [capDetails, setCapDetails] = useState<CapDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchCapDetails = async () => {
      setIsLoading(true);
      try {
        const details: CapDetail[] = await Promise.all(
          selectedPieces.map(async (piece) => {
            const response = await fetch(
              `http://localhost:3001/caps/${piece.id}`
            );
            if (!response.ok) throw new Error("Erro ao buscar detalhes");
            return response.json();
          })
        );
        setCapDetails(details);
      } catch (err) {
        console.error("Erro ao buscar imagens:", err);
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

  useEffect(() => {
    if (capDetails.length === 0 || isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sortedDetails = [...capDetails].sort(
      (a, b) => a.ordermExibicao - b.ordermExibicao
    );
    const urls = sortedDetails
      .map((detail) => detail.imagemUrl)
      .filter(Boolean);

    if (urls.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setImagesLoaded(false);
      return;
    }

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    urls.forEach((url, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.crossOrigin = "anonymous";
      img.src = `/api/proxy/image?url=${encodeURIComponent(url)}`;

      img.onload = () => {
        images[index] = img;
        loadedCount++;
        if (loadedCount === urls.length) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          images.forEach((img) => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          });
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        console.error("Erro ao carregar imagem:", url);
        loadedCount++;
        if (loadedCount === urls.length && images.length > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          images.forEach((img) => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          });
          setImagesLoaded(true);
        }
      };
    });
  }, [capDetails, isLoading]);

  return (
    <div className="flex w-full flex-col">
      <TitleComponent2 />
      <div className="flex w-full gap-x-20 px-20 mt-10">
        <div className="flex flex-col flex-1">
          <h1 className="font-bold">Ordem</h1>
          <Card className="min-h-96">
            <Table3 />
          </Card>
        </div>

        <div className="flex flex-col flex-1">
          <h1 className="font-bold">Imagem</h1>
          <Card className="min-h-96 flex items-center justify-center max-h-48 mt-30">
            {isLoading ? (
              <div className="text-center">Carregando imagens...</div>
            ) : capDetails.length === 0 ? (
              <div className="text-center">Nenhuma imagem disponível</div>
            ) : (
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="border border-gray-400"
              />
            )}
          </Card>
          {imagesLoaded && (
            <p className="text-green-600 text-sm mt-2 px-4">
              Imagem combinada com sucesso!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
