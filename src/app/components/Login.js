"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

import { Chicle } from "next/font/google";
const chicle = Chicle({ subsets: ["latin"], weight: "400" });

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  countries,
  names,
  languages,
  starWars,
  NumberDictionary,
} from "unique-names-generator";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup"); // 'signup', 'login', or 'magic'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const generateRandomUsername = () => {
    let includeNumber = Math.random() > 0.3; // 70% chance to include a number
    let number = Math.floor(Math.random() * 999);

    const allDictionaries = [
      adjectives,
      colors,
      animals,
      countries,
      names,
      languages,
      starWars,
    ];

    // Optional number dictionary (used rarely)
    const numberDictionary = NumberDictionary.generate({ min: 0, max: 999 });

    // 1. Randomly select 1 or 2 dictionaries (but not NumberDictionary)
    const shuffled = allDictionaries.sort(() => 0.5 - Math.random());
    const pickedDictionaries = shuffled.slice(0, Math.random() > 0.7 ? 1 : 2); // 70% chance of 2 words

    // 2. Random separator: "_" or ""
    const separator = Math.random() > 0.5 ? "_" : "";

    // 3. Random style: lowerCase or camelCase
    const style = Math.random() > 0.5 ? "lowerCase" : "camelCase";

    // 4. Randomly decide whether to append a number
    includeNumber = Math.random() > 0.4; // 60% chance

    // 5. Generate name
    const name = uniqueNamesGenerator({
      dictionaries: pickedDictionaries,
      separator,
      style,
    });

    number = Math.floor(Math.random() * 999);

    const cleanedName = name.replace(/\s+/g, ""); // remove all whitespace
    return includeNumber ? `${cleanedName}${separator}${number}` : cleanedName;
  };

  const validateUsername = async (username) => {
    if (/\s/.test(username)) {
      return { valid: false, error: "Username cannot contain spaces." };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      return { valid: false, error: error.message };
    }

    if (data) {
      return { valid: false, error: "Username already taken." };
    }

    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    ///
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

    const randomColor =
      colorPalette[Math.floor(Math.random() * colorPalette.length)];

    ///

    if (mode === "signup") {
      const check = await validateUsername(username);
      if (!check.valid) {
        setMessage(check.error);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        const userId = data?.user?.id || data?.session?.user?.id;
        if (userId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ id: userId, username, color: randomColor }]);

          if (profileError) {
            setMessage(profileError.message);
          } else {
            setMessage(
              "Sign up successful! Check your inbox for confirmation."
            );
          }
        }
      }
    } else if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setMessage(error ? error.message : "Logged in!");
      if (!error) {
        router.push("/");
      }
    } else if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({ email });
      setMessage(
        error ? error.message : "Check your email for the magic link!"
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-rose-100">
      <div className="w-full max-w-sm bg-white-200 border-2 border-rose-300  hover:cursor-pointer p-8 rounded shadow-rose-300 hover:shadow-2xl hover:shadow-rose-300">
        <h1
          className={`text-5xl text-rose-500 font-bold mb-6 text-center ${chicle.className}`}
        >
          Anonify
        </h1>
        <form onSubmit={handleSubmit} className="text-rose-500">
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {mode === "signup" && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter a username"
                    onFocus={() => {
                      if (!username) {
                        setUsername(generateRandomUsername());
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setUsername(generateRandomUsername())}
                    className="text-sm pr-1 pl-1 hover:cursor-pointer"
                    title="Suggest a username"
                  >
                    ?
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </>
          )}

          {mode === "login" && (
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700 hover:cursor-pointer"
          >
            {loading
              ? "Processing..."
              : mode === "signup"
              ? "Sign Up"
              : mode === "login"
              ? "Log In"
              : "Send Magic Link"}
          </button>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </form>

        <div className="mt-6 text-sm text-center space-y-1">
          {mode != "signup" && (
            <button
              onClick={() => setMode("signup")}
              className="text-red-600 hover:underline hover:cursor-pointer"
            >
              Create account
            </button>
          )}
          {/* <br /> */}
          {mode == "signup" && (
            <div>
              <button
                onClick={() => setMode("login")}
                className="text-red-600 hover:underline hover:cursor-pointer"
              >
                Log in with password
              </button>
            </div>
          )}
          {mode == "signup" && (
            <button
              onClick={() => setMode("magic")}
              className="text-red-600 hover:underline hover:cursor-pointer"
            >
              Use magic link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
