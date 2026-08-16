"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageProvider";

export default function ProfileCard() {
  const { t } = useLang();

  const [name, setName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [credits, setCredits] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    setCredits(1);
    setProgress(0);
  }, []);

  const saveName = async () => {
    if (!input.trim()) return;

    try {
      setSaving(true);
      const clean = input.trim();

      localStorage.setItem("username", clean);
      setName(clean);
      setEditing(false);
      setInput("");
    } finally {
      setSaving(false);
    }
  };

  const progressPercent = useMemo(() => {
    return Math.min((progress / 3) * 100, 100);
  }, [progress]);

  const progressLeft = Math.max(3 - progress, 0);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:backdrop-blur-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("rewards_title")}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {t("rewards_subtitle")}
          </p>
        </div>

        {name && !editing && (
          <button
            onClick={() => {
              setEditing(true);
              setInput(name);
            }}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            {t("edit_name")}
          </button>
        )}
      </div>

      {/* Name */}
      {!name && !editing && (
        <div className="mt-5">
          <button
            onClick={() => setEditing(true)}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t("set_name")}
          </button>
        </div>
      )}

      {editing && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />

            <div className="flex gap-2">
              <button
                onClick={saveName}
                disabled={saving || !input.trim()}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? t("saving") : t("save")}
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  setInput("");
                }}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {name && !editing && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-black/10">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("welcome_back")},{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {name}
            </span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/10">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("free_credits")}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {credits}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/10">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("progress")}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {progress}
            <span className="text-lg text-gray-500 dark:text-gray-400">
              {" "}
              / 3
            </span>
          </p>
        </div>
      </div>

      {/* Reward Progress */}
      <div className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-indigo-500/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("reward_progress")}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {progressLeft > 0
                ? `${progressLeft} ${t("more_results")}`
                : t("free_credit_ready")}
            </p>
          </div>

          <div className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-blue-200">
            {Math.round(progressPercent)}%
          </div>
        </div>

        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
          <div
            className="h-3 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
