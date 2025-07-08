"use client";
import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { supabase } from "../../../lib/supabaseClient";
import { Chicle } from "next/font/google";
import { useEffect } from "react";
const chicle = Chicle({ subsets: ["latin"], weight: "400" });

const Post = ({ id, time, content, likeCount, username, color }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Check if user already liked this post
        const { data, error } = await supabase
          .from("likes")
          .select("*")
          .eq("post_id", id)
          .eq("user_id", user.id);

        if (data?.length > 0) {
          setLiked(true);
        }
      }
    };
    fetchUser();
  }, [id]);

  const toggleLike = async () => {
    if (!userId) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));

    if (newLiked) {
      const { error } = await supabase.from("likes").insert({
        user_id: userId,
        post_id: id,
      });
      if (error) console.error("Error liking post:", error.message);
    } else {
      // Remove from likes table
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", id);
      if (error) console.error("Error unliking post:", error.message);
    }
  };

  return (
    <div className="text-sm shadow-2xs border border-rose-600 rounded-md p-2 bg-rose-50">
      <div className="flex flex-col space-x-4 w-full align-top">
        {/* Left: Anonymous + Time */}
        <div className="flex items-end gap-2 min-w-max pl-1 pb-1">
          <div style={{ color: color, fontWeight: "bold" }} className="text-lg">
            {username}
          </div>
          <div className="text-gray-500 text-xs pb-1">{time}</div>
        </div>

        {/* Middle: Content (stretches) */}
        <div className="flex-1 text-left text-zinc-800 text-lg pl-1">
          {content}
        </div>

        {/* Right: Like Button */}
        <div className="flex justify-end text-rose-500 pt-3">
          <button onClick={toggleLike} className="pr-1">
            {liked ? <BsHeartFill size={18} /> : <FiHeart size={18} />}
          </button>
          <div className="pr-2 text-md">{likes}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
