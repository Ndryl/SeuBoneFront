"use client";
import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import Input from "@/app/components/input";
import { Select } from "@/app/components/SelectComponet";

interface Option {
  id: string;
  value: string;
}

interface FormProps {
  nomeModelo: string;
  setNomeModelo: (value: string) => void;
  placeholderInput?: string;
  recorte: string;
  setRecorte: (value: string) => void;
  className?: string;
  placeholder?: string;
  posicao: string;
  setPosicao: (value: string) => void;
  exibicao: string;
  setExibicao: (value: string) => void;
  tecido: string;
  setTecido: (value: string) => void;
  corTecido: string;
  setCorTecido: (value: string) => void;
}

const posicaoImagem = [{ id: "1", value: "frente" }];

export default function FormCard({
  recorte,
  setRecorte,
  setNomeModelo,
  nomeModelo,
  className,
  placeholder,
  placeholderInput,
  posicao,
  setPosicao,
  exibicao,
  setExibicao,
  tecido,
  corTecido,
  setCorTecido,
  setTecido,
}: FormProps) {
  const [recorteOptions, setRecorteOptions] = useState<Option[]>([]);
  const [modeloOptions, setModeloOptions] = useState<Option[]>([]);
  const [corTecidoOptions, setCorTecidoOptions] = useState<Option[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/tipo-recorte", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          value: item.nome,
        }));
        setRecorteOptions(mapped);
      });

    fetch("http://localhost:3001/modelo-disponivel", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          value: item.nome,
        }));
        setModeloOptions(mapped);
      });

    fetch("http://localhost:3001/cor-tecido", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          value: item.nome,
        }));
        setCorTecidoOptions(mapped);
      });
  }, []);

  return (
    <Card className="p-4">
      <h1 className="text-black text-sm font-bold mb-4">Especificações</h1>

      {/* Modelo Disponível - 1 linha */}
      <div className="w-full mb-4">
        <Select
          placeholder={placeholderInput ?? "Selecionar modelo"}
          options={modeloOptions}
          selectedValue={nomeModelo}
          setSelectedValue={setNomeModelo}
          titulo="Modelo Disponível"
          className="w-full"
        />
      </div>

      {/* Tipo de Recorte - 2 linha */}
      <div className="w-full mb-4">
        <Select
          placeholder={placeholder ?? "Selecione o recorte"}
          options={recorteOptions}
          selectedValue={recorte}
          setSelectedValue={setRecorte}
          titulo="Tipo de Recorte"
          className="w-full"
        />
      </div>

      {/* Posição da imagem - 3 linha */}
      <div className="w-full mb-4">
        <Select
          placeholder={placeholder ?? "Selecionar posição"}
          options={posicaoImagem}
          selectedValue={posicao}
          setSelectedValue={setPosicao}
          titulo="Posição da imagem"
          className="w-full"
        />
      </div>

      {/* Ordem de exibição - 4 linha */}
      <div className="w-full mb-4">
        <Input
          Title="Ordem de exibição"
          setValue={setExibicao}
          value={exibicao}
          placeholder={placeholderInput ?? "Digite a ordem de exibição"}
          className="w-full"
        />
      </div>

      {/* Cor do Tecido - 5 linha */}
      <div className="w-full mb-4">
        <Select
          placeholder={placeholder ?? "Selecionar cor do tecido"}
          options={corTecidoOptions}
          selectedValue={corTecido}
          setSelectedValue={setCorTecido}
          titulo="Cor do Tecido"
          className="w-full"
        />
      </div>

      {/* Tecido - 6 linha */}
      <div className="w-full">
        <Input
          Title="Tecido"
          setValue={setTecido}
          value={tecido}
          placeholder={placeholderInput ?? "Digite o nome do tecido"}
          className="w-full"
        />
      </div>
    </Card>
  );
}
