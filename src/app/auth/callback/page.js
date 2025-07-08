"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
        router.push("/login");
        return;
      }

      if (session) {
        const { data, error: supaError } = await supabase.auth.getUser();
        if (supaError) {
          console.log(supaError);
          return;
        }
        console.log(data);
        router.push("/");
      } else {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("Error setting session:", sessionError.message);
            router.push("/login");
          } else {
            router.push("/");
          }
        } else {
          router.push("/login");
        }
      }
    };

    handleAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
}
