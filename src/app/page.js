import Image from "next/image";
import Post from "./components/Post";
import Feed from "./components/Feed";

export default function Home() {
  
  return (
    <div className="p-2">
      {/* <Post content={"This is my first post"} likeCount={4} /> */}
      <Feed />
    </div>
  );
}
