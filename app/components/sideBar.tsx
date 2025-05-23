"use client";

import { Bone, Visualizazao, Client } from "@/images/images";
import { useAuthRedirect } from "../hooks/authHook";
import { Loader2, Menu } from "lucide-react";
import { useState } from "react";
import { OptionType } from "../type/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

const arrayOptions: OptionType[] = [
  { id: 1, image: Bone, title: "Peças", url: "/produtos" },
  { id: 2, image: Visualizazao, title: "Visualização", url: "/visualizacao" },
  { id: 3, image: Client, title: "Clientes", url: "/cliente" },
];

export default function Sidebar() {
  const { user, isLoading } = useAuthRedirect();
  const [selected, setSelected] = useState(1);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Botão visível apenas em telas pequenas */}
      <button
        onClick={() => setIsSidebarVisible(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 shadow-md rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay - só aparece quando sidebar está visível no mobile */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#F2F2F7] h-screen p-4 overflow-y-auto border-r border-gray-200 flex-col shadow-2xl w-64 z-50
        ${isSidebarVisible ? "flex" : "hidden"} sm:flex fixed sm:static`}
        onClick={(e) => e.stopPropagation()} // impede que clique dentro feche
      >
        {arrayOptions.map((option) => {
          const isSelected = selected === option.id;
          const Icon = option.image;

          return (
            <Link
              href={option.url}
              key={option.id}
              onClick={() => {
                setSelected(option.id);
                setIsSidebarVisible(false); // fecha ao clicar em um link
              }}
              className={`m-2 p-2 flex gap-4 items-center rounded-2xl transition-colors ${
                isSelected
                  ? "bg-[var(--brand-color-1)] text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{option.title}</span>
            </Link>
          );
        })}
      </aside>
    </>
  );
}
