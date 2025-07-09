"use client";
import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { supabase } from "../../../lib/supabaseClient";
import { Chicle } from "next/font/google";

const chicle = Chicle({ subsets: ["latin"], weight: "400" });

const Post = ({ id, time, content, likeCount, username, posterId, color }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [userId, setUserId] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  // Check if this user already liked the post
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userId) return;

      const { data: likeData, error } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", id)
        .eq("user_id", userId);

      if (error) console.error("Like check error:", error.message);

      if (likeData?.length > 0) {
        setLiked(true);
      }
    };

    checkIfLiked();
  }, [userId, id]);

  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      // UNLIKE
      setLiked(false);
      setLikes((prev) => prev - 1);

      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", id);

      if (!error) {
        await supabase
          .from("posts")
          .update({ likes: likes - 1 })
          .eq("id", id);
      } else {
        console.error("Error unliking:", error.message);
        setLiked(true); // rollback
        setLikes((prev) => prev + 1);
      }
    } else {
      // LIKE
      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", userId)
        .eq("post_id", id);

      if (existingLike?.length > 0) return; // already liked

      setLiked(true);
      setLikes((prev) => prev + 1);

      const { error } = await supabase.from("likes").insert({
        user_id: userId,
        post_id: id,
      });

      if (!error) {
        await supabase
          .from("posts")
          .update({ likes: likes + 1 })
          .eq("id", id);
      } else {
        console.error("Error liking:", error.message);
        setLiked(false); // rollback
        setLikes((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="text-sm shadow-2xs border border-rose-600 rounded-md p-2 bg-rose-50">
      <div className="flex flex-col space-x-4 w-full align-top">
        {/* Left: Anonymous + Time */}
        <div className="flex items-end gap-2 min-w-max pl-1 pb-1">
          <div style={{ color: color, fontWeight: "bold" }} className="text-lg">
            <a href={`/user/${posterId}`}>{username}</a>
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
