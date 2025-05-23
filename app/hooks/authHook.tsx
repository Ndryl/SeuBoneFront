"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/auth/firebase";

const publicPaths = ["/login"];

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);

      if (!user) {
        // Usuário não autenticado
        if (!publicPaths.includes(pathname)) {
          router.push("/login");
          setShouldRender(false); // não renderiza enquanto redireciona
        } else {
          setShouldRender(true); // rota pública, pode renderizar
        }
      } else {
        // Usuário autenticado — pode renderizar qualquer coisa
        setShouldRender(true);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return { user, shouldRender, isLoading };
}
