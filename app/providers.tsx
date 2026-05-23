"use client";

import { useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const login = async () => {
      console.log("providers loaded");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      console.log("sessionData:", sessionData);
      console.log("sessionError:", sessionError);
      console.log("current user:", sessionData.session?.user);
      console.log("supabase url:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("user id:", sessionData.session?.user?.id);

      if (!sessionData.session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        console.log("anon data:", data);
        console.log("anon error:", error);
      }
    };

    login();
  }, []);

  return <>{children}</>;
}
