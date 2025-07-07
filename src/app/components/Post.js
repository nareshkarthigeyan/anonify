"use client";
import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { supabase } from "../../../lib/supabaseClient";
import { Chicle } from "next/font/google";
const chicle = Chicle({ subsets: ["latin"], weight: "400" });

const colorPalette = [
  "#e11d48",
  "#db2777",
  "#9333ea",
  "#2563eb",
  "#059669",
  "#d97706",
  "#f43f5e",
  "#10b981",
];

const getColorFromId = (id) => {
  let ID = parseInt(id);
  if (typeof ID !== "number" || isNaN(ID) || ID < 0) return "#6b7280"; // gray fallback
  // Simple hash to get better spread even with sequential IDs
  const hashed = (ID * 2654435761) >>> 0; // Knuth multiplicative hash
  const index = hashed % colorPalette.length;
  return colorPalette[index];
};

const Post = ({ id, time, content, likeCount }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const anonColor = getColorFromId(id);

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));

    const { error } = await supabase
      .from("posts")
      .update({ likes: newLiked ? likes + 1 : likes - 1 })
      .eq("id", id);

    if (error) {
      console.error("Error updating like count:", error.message);
    }
  };

  return (
    <div className="text-sm shadow-2xs border border-rose-600 rounded-md p-2 bg-rose-50">
      <div className="flex items-center space-x-4 w-full align-top">
        {/* Left: Anonymous + Time */}
        <div className="flex flex-col justify-start min-w-max align-text-top">
          <div
            style={{ color: anonColor, fontWeight: "bold" }}
            className={`text-left text-md mr-2`}
          >
            Anonymous
          </div>
          <div className="text-gray-500 text-left text-xs">{time}</div>
        </div>

        {/* Middle: Content (stretches) */}
        <div className="flex-1 text-left text-zinc-800 text-lg">{content}</div>

        {/* Right: Like Button */}
        <div className="flex items-center text-gray-500">
          <button onClick={toggleLike} className="pr-1">
            {liked ? <BsHeartFill size={12} /> : <FiHeart size={12} />}
          </button>
          <div className="pr-2">{likes}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
