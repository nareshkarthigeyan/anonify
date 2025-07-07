"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Post from "./Post";

const Feed = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = (now - then) / 1000; // in seconds

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff / unit.seconds);
      if (value >= 1) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          -value,
          unit.name
        );
      }
    }

    return "just now";
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      // .limit(10);

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [refreshTrigger]);

  if (loading) return <div className="text-center p-4 text-rose-500"></div>;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl p-2 space-y-2">
        {/* Map posts here */}
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            content={post.content}
            time={formatRelativeTime(post.created_at)}
            likeCount={post.likes}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
