"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { capDataType } from "@/app/type/types";
import { getAuth } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, db, storage } from "@/auth/firebase";
import { addDoc, collection } from "firebase/firestore";
import ImageInput from "@/app/components/InputImage";
import Card from "@/app/components/Card";
import Input from "@/app/components/input";
import FormCard from "../../[produtos]/adicionar-peca/components/Form";
import ToggleComponent from "@/app/components/ToggleCompoent";
import Button from "@/app/components/Button";

export default function ProdutoPage({
  params,
}: {
  params: Promise<{ produto: string }>;
}) {
  const [produto, setProduto] = useState<capDataType | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [recorte, setRecorte] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [posicao, setPosicao] = useState("");
  const [exibicao, setExibicao] = useState("");
  const [tecido, setTecido] = useState("");
  const [corTecido, setCorTecido] = useState("");
  const [SKU, setSKU] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const sku = searchParams.get("id");

  useEffect(() => {
    const fetchProduto = async () => {
      const resolved = await params;
      const id = resolved.produto;

      try {
        const res = await fetch(`http://localhost:3001/caps/${sku}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setProduto(data);

        // Preenche os estados com os dados da API
        setIsActive(data.status);
        setPosicao(data.posicaoImagem || "");
        setRecorte(data.tipoRecorte?.id || "");
        setNomeModelo(data.modeloDisponivel.id || "");
        setExibicao(data.ordemExibicao?.toString() || "");
        setTecido(data.tecido || "");
        setCorTecido(data.coresTecido.id || "");
        setSKU(data.sku || "");
        setImageUrl(data.imagemUrl || null);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar produto");
      }
    };

    fetchProduto();
  }, [params]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado");
      setIsSubmitting(false);
      return;
    }

    try {
      if (previewFile) {
        await uploadImage();
      }
      // Aqui você adicionaria a lógica para atualizar o produto no banco de dados
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao atualizar os dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!previewFile) throw new Error("Nenhum arquivo selecionado");

    const storageRef = ref(storage, `images/${Date.now()}_${previewFile.name}`);
    await uploadBytes(storageRef, previewFile);
    const fileURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "images"), {
      url: fileURL,
      fileName: previewFile.name,
      uploadedAt: new Date(),
    });

    return fileURL;
  };

  if (!produto) return <div className="p-4">Produto não encontrado.</div>;

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="w-full pl-10 pr-40" onSubmit={handleSubmit}>
        <div className="flex w-full justify-end items-center mb-5">
          <div className="flex gap-2">
            <Button conteudo="Descartar" estilo="neutro" Link="/pecas" />
            <Button
              conteudo="Atualizar"
              submit="submit"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="w-full justify-between flex mb-5">
          <ToggleComponent isActive={isActive} setIsActive={setIsActive} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="p-4 rounded ml-20 h-full flex flex-col justify-between">
              <Input
                Title="SKU"
                setValue={setSKU}
                value={SKU}
                disabled={true}
              />

              <div className="flex flex-col">
                <span>Chave key gerada</span>
                <input
                  type="text"
                  className="w-[464px] border border-[#D1D1D6] rounded-2xl"
                  value={produto.nomeModel || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <Card className="min-h-96 flex items-center justify-center mt-10">
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
