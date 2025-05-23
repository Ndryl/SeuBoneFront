import React from "react";

export interface OptionType {
  id: number;
  image: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  url: string;
}

export type capDataType = {
  nomeModel: string;
  tipoRecorte: "Frente" | "Aba" | "Lateral";
  modeloDisponivel: "Trucker" | "Americano";
  tecido: "Linho";
  coresTecido: "Azul marinho" | "Laranja";
  imagemUrl?: string;
  sku: string;
  ordermExibicao: number;
  status: boolean;
  criateAt: string;
  updateAt: string;
};
