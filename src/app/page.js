"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/login");
      } else {
        setSession(data.session);
      }
    };
    getSession();
  }, [router]);

  if (!session) {
    return null; // or a loading spinner
  }

  return (
    <div className="bg-rose-100">
      <div className="min-w-full fixed ">
        <Navbar onPostSubmit={() => setRefreshKey((prev) => prev + 1)} />
      </div>
      <div
        style={{ paddingTop: "calc(var(--spacing) * 21)" }}
        className="bg-rose-100"
      >
        <Feed refreshTrigger={refreshKey} />
      </div>
    </div>
  );
}
