"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading)
    return <div className="text-center p-4 text-rose-500">Loading feed...</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post
          key={post.id}
          content={post.content}
          time={post.created_at}
          likeCount={post.likes}
        />
      ))}
    </div>
  );
};

export default Feed;
