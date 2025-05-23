import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Table from "@/app/components/Table/Table";

export default function pageProdutos() {
  return (
    <div className="flex w-full flex-col ">
      <div className="w-full justify-between flex my-5 items-center">
        <h1 className=" font-bold">Peças gerais</h1>
        <Button conteudo="Adicionar Peças" Link="/produtos/adicionar-peca" />
      </div>
      <Card>
        <Table />
      </Card>
    </div>
  );
}
