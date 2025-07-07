"use client";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";
import { useState } from "react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

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
