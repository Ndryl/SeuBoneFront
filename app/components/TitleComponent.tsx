"uce slient";
import { ArrowLeft } from "lucide-react";
import { capDataType } from "../type/types";
import { useRouter } from "next/navigation";

interface TitleComponentProps {
  Mycap?: capDataType;
}
export default function TitleComponent({ Mycap }: TitleComponentProps) {
  const router = useRouter();
  return Mycap ? (
    <div className="flex flex-col gap-2">
      <h1 className="flex gap-2 text-black items-center">
        <ArrowLeft
          strokeWidth={1}
          className="w-5 h-5 cursor-pointer"
          onClick={() => router.push("/pecas")}
        />
        {Mycap.nomeModel}
      </h1>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 text-black items-center">
        <ArrowLeft
          strokeWidth={2}
          className="w-6 h-6 cursor-pointer"
          onClick={() => router.push("/pecas")}
        />
        <h1 className="text-2xl font-bold">Adicionar uma nova peça</h1>
      </div>
    </div>
  );
}
