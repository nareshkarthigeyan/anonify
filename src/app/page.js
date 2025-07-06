"use client";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";
import { useState } from "react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <Navbar onPostSubmit={() => setRefreshKey((prev) => prev + 1)} />
      <Feed refreshTrigger={refreshKey} />
    </>
  );
}
