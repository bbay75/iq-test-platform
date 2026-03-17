"use client";

import { useEffect, useState } from "react";
import {
  ensureSessionId,
  getFreeCredits,
  getTestsCompleted,
} from "@/lib/rewardSystem";

export default function ProfileCard() {
  const [name, setName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  const [iq, setIq] = useState<string | null>(null);
  const [mbti, setMbti] = useState<string | null>(null);
  const [love, setLove] = useState<string | null>(null);
  const [numerology, setNumerology] = useState<string | null>(null);
  const [palm, setPalm] = useState<string | null>(null);

  const [testsCompleted, setTestsCompleted] = useState(0);
  const [freeCredits, setFreeCredits] = useState(0);

  useEffect(() => {
    ensureSessionId();

    const savedName = localStorage.getItem("username");
    if (savedName) setName(savedName);

    setIq(localStorage.getItem("iqResult"));
    setMbti(localStorage.getItem("mbtiResult"));
    setLove(localStorage.getItem("loveResult"));
    setNumerology(localStorage.getItem("numerologyResult"));
    setPalm(localStorage.getItem("palmResult"));

    setTestsCompleted(getTestsCompleted());
    setFreeCredits(getFreeCredits());
  }, []);

  const saveName = () => {
    if (!input.trim()) return;

    localStorage.setItem("username", input.trim());
    setName(input.trim());
    setEditing(false);
    setInput("");
  };

  const progressPercent = (testsCompleted / 3) * 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        👤 My Profile
      </h2>

      {!name && !editing && (
        <div className="flex justify-center">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Set Name
          </button>
        </div>
      )}

      {editing && (
        <div className="flex flex-col items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your name"
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-center dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <button
            onClick={saveName}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      )}

      {name && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Welcome, <b>{name}</b>
        </p>
      )}

      <div className="mb-6 space-y-2 text-center text-sm text-gray-700 dark:text-gray-300">
        {iq && <p>🧠 IQ: {iq}</p>}
        {mbti && <p>🧩 MBTI: {mbti}</p>}
        {love && <p>❤️ Love: {love}</p>}
        {numerology && <p>🔢 Numerology: {numerology}</p>}
        {palm && <p>✋ Palm: saved</p>}
      </div>

      <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-900">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Free Test Credits: {freeCredits}
        </p>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Progress to next free test: {testsCompleted} / 3
        </p>

        <div className="mt-3 h-2 w-full rounded bg-gray-300 dark:bg-gray-700">
          <div
            className="h-2 rounded bg-green-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
