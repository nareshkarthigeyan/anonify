"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

import { Chicle } from "next/font/google";
const chicle = Chicle({ subsets: ["latin"], weight: "400" });

const Navbar = ({ onPostSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShowForm(true);
  const handleClose = () => {
    setShowForm(false);
    setContent("");
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("posts").insert([
      {
        content: content,
        likes: 0, // default value
      },
    ]);

    if (error) {
      console.error("Error posting to Supabase:", error.message);
    } else {
      console.log("Post submitted:", content);
      handleClose();
    }

    setLoading(false);
    onPostSubmit();
    handleClose();
  };

  return (
    <div className="p-4 w-full justify-between items-center p-4 bg-white flex border-b-2 border-b-red-700">
      <Link
        className={`${chicle.className} text-5xl text-rose-600 mr-1`}
        href="/"
      >
        Anonify
      </Link>
      <br />
      <button
        className="bg-rose-500 pr-8 pl-8 pt-3 pb-3 text-amber-50"
        onClick={handleClick}
      >
        POST
      </button>

      {showForm && (
        <div className="fixed inset-0 p-2  border-rose-600 border-5 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xs border-2 border-rose-800 w-full max-w-md">
            <h2
              className={`${chicle.className} text-5xl font-bold text-rose-700 pb-2`}
            >
              Post
            </h2>

            <textarea
              rows="5"
              className="w-full border-2 border-rose-700 p-2 mb-4 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post Anonymously"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className={`bg-gray-500 pr-6 pl-6 pt-3 pb-3 ${chicle.className} text-2xl font-bold pb-2 text-white`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-rose-600 pr-6 pl-6 pt-3 pb-3 ${chicle.className} text-2xl font-bold text-rose-700 pb-2 text-white`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
