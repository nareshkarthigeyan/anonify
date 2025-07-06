"use client";
import React from "react";
import Image from "next/image";
import { FiHeart } from "react-icons/fi"; // outline heart
import { BsHeartFill } from "react-icons/bs"; // filled heart
import { useState } from "react";

const Post = ({ id, time, content, likeCount }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };

  return (
    <div className="border-2 border-rose-800 max-w-full rounded-xs shadow-md">
      <div className="pr-2 pl-2 p-1 text-xl text-rose-800 w-full border-b-2 border-b-rose-800 flex justify-between">
        <div className="flex">
          <div>Anonymous User</div>
          <div className="text-xs p-2 text-red-700">{time}</div>
        </div>
        <div className="flex ">
          <button onClick={toggleLike}>
            {liked ? (
              <BsHeartFill className="text-pink-600 p-1" size={28} />
            ) : (
              <FiHeart className="text-rose-700 p-1" size={28} />
            )}
          </button>
          <div>{likes}</div>
        </div>
      </div>
      <div
        className="p-4 flex justify-betwee text-rose-900 text-2xl font-stretch-95%%
      "
      >
        {content}
      </div>
    </div>
  );
};

export default Post;
