import { supabase } from "../../../../lib/supabaseClient";
import fs from "fs/promises";
import path from "path";

const botPostsFilePath = path.join(process.cwd(), "data", "bot_posts.txt");

export async function POST(req) {
  try {
    // Read all posts from the file
    let fileContent = "";
    try {
      fileContent = await fs.readFile(botPostsFilePath, "utf-8");
    } catch (readError) {
      if (readError.code === "ENOENT") {
        // File does not exist, create it with a message
        await fs.writeFile(
          botPostsFilePath,
          "No more posts available. Please add more to this file.",
          "utf-8"
        );
        return new Response(
          JSON.stringify({
            error:
              "No posts found in bot_posts.txt. File created with a placeholder message.",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw readError; // Re-throw other errors
    }

    let posts = fileContent.split("\n").filter((line) => line.trim() !== "");

    if (posts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No posts available in bot_posts.txt" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const randomIndex = Math.floor(Math.random() * posts.length);
    const selectedPost = posts[randomIndex];

    // Remove the selected post from the array
    posts.splice(randomIndex, 1);

    // Write the remaining posts back to the file
    await fs.writeFile(botPostsFilePath, posts.join("\n"), "utf-8");

    // You MUST replace 'YOUR_BOT_USER_ID' with an actual user ID from your 'profiles' table.
    const botUserId = "3da5a79b-2092-41f6-9357-df50233a0d0c";

    const { data, error } = await supabase.from("posts").insert([
      {
        content: selectedPost,
        user_id: botUserId,
      },
    ]);

    if (error) {
      console.error("Error inserting bot post:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Bot post inserted successfully:", data);
    return new Response(JSON.stringify({ message: "Bot post created", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in bot post API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
