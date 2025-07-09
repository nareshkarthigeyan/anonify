import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import FollowButton from "../../components/FollowButton";
import Post from "../../components/Post";
import { supabase } from "../../../../lib/supabaseClient";

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

export default async function UserProfile({ params }) {
  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch user's posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false });

  // Fetch user's liked posts
  const { data: likedPosts, error: likedPostsError } = await supabase
    .from("likes")
    .select("posts(*, profiles(*))")
    .eq("user_id", params.id)
    .order("created_at", { foreignTable: "posts", ascending: false });

  // Fetch followers and following counts
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", params.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", params.id);

  return (
    <div className="p-4">
      <div className="p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-600">{profile.bio}</p>
        <FollowButton profileId={profile.id} />
      </div>

      <div className="flex justify-around my-4 p-4 bg-gray-100 rounded-lg shadow">
        <div>
          <p className="font-bold">{posts?.length || 0}</p>
          <p>Posts</p>
        </div>
        <Link href={`/user/${params.id}/followers`}>
          <div className="cursor-pointer">
            <p className="font-bold">{followersCount || 0}</p>
            <p>Followers</p>
          </div>
        </Link>
        <Link href={`/user/${params.id}/following`}>
          <div className="cursor-pointer">
            <p className="font-bold">{followingCount || 0}</p>
            <p>Following</p>
          </div>
        </Link>
      </div>

      <div>
        {/* Tabs could be implemented here */}
        <h2 className="text-xl font-bold mt-6 mb-4">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts?.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              content={post.content}
              time={formatRelativeTime(post.created_at)}
              likeCount={post.likes}
              username={post.profiles?.username || "anonymous"}
              posterId={post.profiles?.id}
              color={post.profiles?.color || "#ffffffff"}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold mt-6 mb-4">Liked Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedPosts?.map((like) => (
            <Post
              key={like.posts.id}
              id={like.posts.id}
              content={like.posts.content}
              time={formatRelativeTime(like.posts.created_at)}
              likeCount={like.posts.likes}
              username={like.posts.profiles?.username || "anonymous"}
              posterId={like.posts.profiles?.id}
              color={like.posts.profiles?.color || "#ffffffff"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
