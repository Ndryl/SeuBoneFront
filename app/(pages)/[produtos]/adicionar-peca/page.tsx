"use client";
import Card from "@/app/components/Card";
import Input from "@/app/components/input";
import { Select } from "@/app/components/SelectComponet";
import TitleComponent from "@/app/components/TitleComponent";
import ToggleComponent from "@/app/components/ToggleCompoent";
import { useState } from "react";
import FormCard from "./components/Form";
import ImageInput from "@/app/components/InputImage";
import Button from "@/app/components/Button";
import { app, db, storage } from "@/auth/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast, Toaster } from "sonner";

const Recorte = [
  { id: "cmazxxdgx000076jx8jsrysm1", value: "Frente" },
  { id: "cmazxxdgx000076jx8jsrysm2", value: "Aba" },
  { id: "cmazxxdgx000076jx8jsrysm3", value: "Lateral" },
];

export default function Page() {
  const [isActive, setIsActive] = useState(true);
  const [recorte, setRecorte] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [posicao, setPosicao] = useState("");
  const [exibicao, setExibicao] = useState("");
  const [tecido, setTecido] = useState("");
  const [corTecido, setCorTecido] = useState("");
  const [SKU, setSKU] = useState("");
  const [key, setKey] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gerarKey = () => {
    const novaKey = `${nomeModelo}-${recorte}-${tecido}-${corTecido}`
      .toLowerCase()
      .replace(/\s+/g, "-");
    setKey(novaKey);
    setSKU(novaKey.toUpperCase());
    return novaKey;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      toast.error("Usuário não autenticado.");
      setIsSubmitting(false);
      return;
    }

    try {
      const novaKey = gerarKey();

      let finalImageUrl = imageUrl;
      if (previewFile) {
        const storageRef = ref(storage, `images/${novaKey}.jpg`);
        await uploadBytes(storageRef, previewFile);
        finalImageUrl = await getDownloadURL(storageRef);
        setImageUrl(finalImageUrl);
      }

      const body = {
        nomeModel: nomeModelo,
        tipoRecorteId: recorte,
        posicaoImagem: posicao,
        modeloDisponivelId: "cmazy5nhw000076vzdk87waax",
        tecido,
        coresTecidoId: corTecido,
        imagemUrl: finalImageUrl,
        linkImagem: `https://exemplo.com/design/${novaKey}`,
        sku: novaKey.toUpperCase(),
        ordemExibicao: parseInt(exibicao),
        status: isActive,
        key: novaKey,
      };

      const response = await fetch("http://localhost:3001/caps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar modelo");

      toast.success("Modelo cadastrado com sucesso!");
      setPreviewFile(null);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao salvar os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <form
        className="w-full px-4 sm:px-6 md:px-10 lg:pl-10 lg:pr-40"
        onSubmit={handleSubmit}
      >
        {/* Botões superiores */}
        <div className="flex w-full justify-end items-center mb-4 sm:mb-5">
          <div className="flex gap-2">
            <Button conteudo="Descartar" estilo="neutro" Link="/pecas" />
            <Button
              conteudo="Salvar"
              submit="submit"
              disabled={isSubmitting}
              className="text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Toggle */}
        <div className="w-full justify-between flex mb-4 sm:mb-5">
          <ToggleComponent isActive={isActive} setIsActive={setIsActive} />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-4">
          {/* Formulário e SKU */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormCard
              nomeModelo={nomeModelo}
              recorte={recorte}
              setNomeModelo={setNomeModelo}
              setRecorte={setRecorte}
              posicao={posicao}
              setPosicao={setPosicao}
              exibicao={exibicao}
              setExibicao={setExibicao}
              corTecido={corTecido}
              setCorTecido={setCorTecido}
              setTecido={setTecido}
              tecido={tecido}
            />

            {/* Container SKU e Key */}
            <div className="p-4 rounded lg:ml-4 xl:ml-20 h-full flex flex-col justify-between gap-4">
              <Input
                Title="SKU"
                setValue={setSKU}
                value={SKU}
                className="w-full"
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-base">Chave key gerada</span>
                <input
                  type="text"
                  value={key}
                  readOnly
                  className="w-full sm:w-[464px] border border-[#D1D1D6] rounded-2xl px-2 py-1 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Upload de imagem */}
          <Card className="min-h-60 sm:min-h-80 flex items-center justify-center mt-6 sm:mt-10">
            <ImageInput
              imageUrl={imageUrl}
              previewFile={previewFile}
              setImageUrl={setImageUrl}
              setPreviewFile={setPreviewFile}
            />
          </Card>
        </div>
      </form>
    </>
  );
}
