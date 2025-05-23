import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Table2 from "@/app/components/Table/Table2";
import { SelectedPiecesProvider } from "@/app/context/selectedCapBuild";

export default function pageVizualizacao() {
  return (
    <div className="flex w-full flex-col min-h-4/5">
      <div className="w-full justify-between flex mb-5 items-center">
        <h1 className=" font-bold">Peças gerais</h1>
        <div className="flex gap-2">
          <Button conteudo="Gerar Imagem" Link="/visualizacao/imagem-gerada" />
          <Button conteudo="Adicionar Peças" Link="/produtos/adicionar-peca" />
        </div>
      </div>
      <Card>
        <Table2 />
      </Card>
    </div>
  );
}
