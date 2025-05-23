"use client";
import { useAuthRedirect } from "@/app/hooks/authHook";
import { auth } from "@/auth/firebase";
import ImageLogin from "@/images/images";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PageLogin() {
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { shouldRender, isLoading } = useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        process.env.NEXT_PUBLIC_EMAIL!,
        password
      );
      toast.success("Login realizado com sucesso");
      router.push("/produtos");
    } catch (e) {
      console.error("Login error:", e);
      toast.error("Falha no login. Verifique suas credenciais.");
    }
  };

  if (isLoading) {
    return null; // Ou um loading spinner
  }

  if (!shouldRender) {
    return null; // Retorna vazio se o usuário estiver logado
  }

  return (
    <form
      className="w-full mt-[8.125rem] flex items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="w-[360px] flex flex-col justify-center items-center gap-4">
        <ImageLogin className="w-36 h-8" />
        <h1 className="text-[var(--brand-color-2)] text-2xl flex flex-col gap-1">
          Bem-vindo ao Fanation
          <span className="text-base text-black text-center">
            Acesse sua conta para iniciar
          </span>
        </h1>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">Inserir senha</span>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-base bg-white border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            className="bg-black px-4 py-2 w-full rounded-lg flex items-center justify-center"
            type="submit"
          >
            <span className="text-[#FEFEFE] font-inter font-bold">Acessar</span>
          </button>
        </div>
      </div>
    </form>
  );
}
