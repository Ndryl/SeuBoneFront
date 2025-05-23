// app/context/SelectedPiecesContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Piece {
  id: string;
  // adicione outras propriedades da peça conforme necessário
}

interface SelectedPiecesContextType {
  selectedPieces: Piece[];
  addPiece: (piece: Piece) => void;
  removePiece: (pieceId: string) => void;
  clearPieces: () => void;
}

const SelectedPiecesContext = createContext<
  SelectedPiecesContextType | undefined
>(undefined);

export function SelectedPiecesProvider({ children }: { children: ReactNode }) {
  const [selectedPieces, setSelectedPieces] = useState<Piece[]>([]);

  const addPiece = (piece: Piece) => {
    setSelectedPieces((prev) => {
      // Verifica se a peça já está selecionada
      if (!prev.some((p) => p.id === piece.id)) {
        return [...prev, piece];
      }
      return prev;
    });
  };

  // No seu arquivo de contexto (selectedCapBuild)
  const removePiece = (id: string) => {
    setSelectedPieces((prev) => prev.filter((p) => p.id !== id)); // Alterado para filtrar por id
  };

  const clearPieces = () => {
    setSelectedPieces([]);
  };

  return (
    <SelectedPiecesContext.Provider
      value={{ selectedPieces, addPiece, removePiece, clearPieces }}
    >
      {children}
    </SelectedPiecesContext.Provider>
  );
}

export function useSelectedPieces() {
  const context = useContext(SelectedPiecesContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedPieces must be used within a SelectedPiecesProvider"
    );
  }
  return context;
}
