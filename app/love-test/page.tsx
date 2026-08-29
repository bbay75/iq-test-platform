"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loveQuestions } from "@/data/loveQuestions";
import { buildSoloLoveResult } from "@/data/loveCalculator";
import { saveTestResult } from "@/lib/saveResult";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { UserRound, UsersRound } from "lucide-react";
import LoveQuestionnaire from "@/components/LoveQuestionnaire";
type LoveMode = "solo" | "both" | null;

export default function LoveTestPage() {
  const { t } = useLang();

  const [mode, setMode] = useState<LoveMode>("solo");

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  const [answers1, setAnswers1] = useState<number[]>([]);
  const [selected1, setSelected1] = useState<number | null>(null);

  const [inviteUrl, setInviteUrl] = useState("");
  const [copyDone, setCopyDone] = useState(false);
  const [pairResultId, setPairResultId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("loveResult");
    if (saved) setSavedResult(saved);
  }, []);

  const currentQuestion = loveQuestions[index];

  const resultData = useMemo(() => {
    if (!finished || mode !== "solo" || !name1 || !name2) return null;
    return buildSoloLoveResult(name1, name2, answers1);
  }, [finished, mode, name1, name2, answers1]);

  useEffect(() => {
    if (mode !== "both" || !inviteUrl) return;

    const sessionId = inviteUrl.split("/").pop();

    if (!sessionId) return;

    const channel = supabase
      .channel(`love-couple-p1-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "love_couple_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as {
            person2_completed?: boolean;
            result_id?: string | null;
          };

          console.log("LOVE REALTIME P1:", updated);

          if (updated.person2_completed && updated.result_id) {
            window.location.href = `/my-results/${updated.result_id}`;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mode, inviteUrl]);

  const handleNext = async (directValue?: number) => {
    const answerValue = directValue ?? selected1;

    if (!mode || answerValue === null) return;

    const nextAnswers = [...answers1];
    nextAnswers[index] = answerValue;

    setAnswers1(nextAnswers);

    if (index + 1 < loveQuestions.length) {
      const nextIndex = index + 1;

      setIndex(nextIndex);
      setSelected1(nextAnswers[nextIndex] ?? null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    if (mode === "solo") {
      const result = buildSoloLoveResult(
        name1.trim(),
        name2.trim(),
        nextAnswers,
      );

      const finalText = `${result.finalScore}%`;
      localStorage.setItem("loveResult", finalText);
      setSavedResult(finalText);

      try {
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const { data, error } = await supabase.auth.signInAnonymously();

          if (error || !data.session) {
            throw new Error(
              error?.message ?? "Anonymous session үүсгэж чадсангүй",
            );
          }

          session = data.session;
        }

        const saved = await saveTestResult({
          test_type: "love",
          result_json: {
            ...result,
            mode: "solo",
          },
          score: result.finalScore,
        });

        router.push(`/my-results/${saved.id}`);
        return;
      } catch (error) {
        console.error("Love save error:", error);
        setFinished(true);
      } finally {
        setSubmitting(false);
      }

      return;
    }

    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error || !data.session) {
          throw new Error(
            error?.message ?? "Anonymous session үүсгэж чадсангүй",
          );
        }

        session = data.session;
      }

      const accessToken = session.access_token;

      const response = await fetch("/api/love-couple/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          person1Name: name1.trim(),
          person2Name: name2.trim(),
          person1Answers: nextAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create couple session");
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      setInviteUrl(`${origin}${data.invitePath}`);
      setFinished(true);
    } catch (error) {
      console.error("Love couple create error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Invite үүсгэж чадсангүй.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyInviteLink = async () => {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 1800);
    } catch (error) {
      console.error("Copy invite link error:", error);
    }
  };

  const progress = started ? ((index + 1) / loveQuestions.length) * 100 : 0;

  const resetTest = () => {
    setMode(null);
    setStarted(false);
    setIndex(0);
    setAnswers1([]);
    setSelected1(null);
    setFinished(false);
    setInviteUrl("");
    setCopyDone(false);
    setSubmitting(false);
    setSubmitError(null);
  };

  if (mode === "both" && finished && inviteUrl) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-3 dark:bg-gray-900 sm:gap-6 sm:p-6">
        <Link
          href="/"
          className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
        >
          ← {t("back_home")}
        </Link>

        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
              {t("love_result_title")}
            </p>

            <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {t("love_pair_part_complete")}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t("love_both_process_desc")}
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900 dark:bg-pink-950/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-300">
              {t("love_invite_link")}
            </p>

            <p className="mt-2 break-all text-sm leading-6 text-gray-700 dark:text-gray-200">
              {inviteUrl}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyInviteLink}
              className="rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
            >
              {copyDone ? t("love_copied") : t("love_copy_link")}
            </button>

            {pairResultId ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/my-results/${pairResultId}`;
                }}
                className="rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
              >
                {t("love_open_result")}
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (!inviteUrl) return;

                  const sessionId = inviteUrl.split("/").pop();
                  if (!sessionId) return;

                  const res = await fetch(`/api/love-couple/${sessionId}`, {
                    cache: "no-store",
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.error ?? "Үр дүн шалгаж чадсангүй");
                    return;
                  }

                  if (!data.session.person2_completed) {
                    alert("Хамтрагч тань тестээ хараахан дуусаагүй байна.");
                    return;
                  }

                  if (data.session.result_id) {
                    setPairResultId(data.session.result_id);
                  }
                }}
                className="rounded-xl border border-gray-600 px-6 py-3 font-semibold text-white"
              >
                {t("love_check_result")}
              </button>
            )}
          </div>

          <p className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            {name1} {t("love_both_result_note")}
          </p>
          <button
            type="button"
            onClick={resetTest}
            className="mt-6 w-full rounded-xl bg-gray-700 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            {t("love_restart")}
          </button>
        </div>
      </div>
    );
  }

  if (finished && resultData && savedResult) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-3 dark:bg-gray-900 sm:gap-6 sm:p-6">
        <Link
          href="/"
          className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
        >
          ← {t("back_home")}
        </Link>

        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 p-8 text-center text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-100">
              {t("love_result_title")}
            </p>

            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              {name1} ❤️ {name2}
            </h1>

            <p className="mt-3 text-pink-100">
              {mode === "solo"
                ? t("love_solo_mode_hint")
                : t("love_both_mode_hint")}
            </p>

            <div className="mt-6 inline-flex rounded-full bg-white/15 px-6 py-3 backdrop-blur">
              <span className="text-4xl font-bold">{savedResult}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 text-center dark:border-pink-800 dark:bg-pink-950/30">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("love_name_match")}
                </p>
                <p className="mt-3 text-3xl font-bold text-pink-600 dark:text-pink-300">
                  {resultData.nameScore}%
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t("love_name_energy_based")}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-800 dark:bg-rose-950/30">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {mode === "solo"
                    ? t("love_estimated_match")
                    : t("love_psychology_match")}
                </p>
                <p className="mt-3 text-3xl font-bold text-rose-600 dark:text-rose-300">
                  {resultData.psychologyScore}%
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {mode === "solo"
                    ? t("love_answer_based")
                    : t("love_pair_answer_based")}
                </p>
              </div>

              <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-5 text-center dark:border-fuchsia-800 dark:bg-fuchsia-950/30">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("love_name_energy")}
                </p>
                <p className="mt-3 text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-300">
                  {resultData.reduced1} + {resultData.reduced2}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t("love_reduced_name_number")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-5 dark:border-pink-900 dark:from-gray-900 dark:to-gray-900">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("love_summary")}
              </h2>
              <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                {resultData.summary}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("love_strengths")}
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {resultData.strengths.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("love_challenges")}
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {resultData.challenges.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        !
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("love_advice")}
              </h3>
              <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                {resultData.advice}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              {mode === "solo"
                ? t("love_solo_result_note")
                : t("love_both_result_note")}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={resetTest}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {t("love_restart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-3 dark:bg-gray-900 sm:gap-6 sm:p-6">
        <Link
          href="/"
          className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
        >
          ← {t("back_home")}
        </Link>

        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t("love_test_title")}
          </h1>

          <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
            {t("love_test_desc")}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMode("solo")}
              className={`rounded-2xl border p-5 text-center transition ${
                mode === "solo"
                  ? "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
              }`}
            >
              <p className="flex items-center justify-center gap-2 text-lg font-bold">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <UserRound className="h-5 w-5 scale-[1]" strokeWidth={2.2} />
                </span>
                {t("love_solo_title")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode("both")}
              className={`rounded-2xl border p-5 text-center transition ${
                mode === "both"
                  ? "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
              }`}
            >
              <p className="flex items-center justify-center gap-2 text-lg font-bold">
                <UsersRound className="h-5 w-5" />
                {t("love_both_title")}
              </p>
            </button>
          </div>

          {mode && (
            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-1.5 px-1">
                <div className="mt-[4px] shrink-0 text-pink-500">
                  {mode === "solo" ? (
                    <UserRound className="h-3 w-3" />
                  ) : (
                    <UsersRound className="h-3 w-3" />
                  )}
                </div>

                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                  {mode === "solo"
                    ? t("love_mode_solo_desc")
                    : t("love_mode_both_desc")}
                </p>
              </div>

              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder={t("love_name1_placeholder")}
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />

                {mode === "solo" && (
                  <input
                    type="text"
                    placeholder={t("love_name2_placeholder")}
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!mode || !name1.trim()) return;

                  if (mode === "solo" && !name2.trim()) {
                    return;
                  }

                  setStarted(true);
                }}
                disabled={
                  !mode || !name1.trim() || (mode === "solo" && !name2.trim())
                }
                className="w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("love_start_button")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 p-6 dark:bg-gray-900">
      <Link
        href="/"
        className="text-sm font-medium text-pink-600 hover:underline dark:text-pink-300"
      >
        ← {t("back_home")}
      </Link>

      <LoveQuestionnaire
        title={
          mode === "solo"
            ? t("love_solo_page_title")
            : t("love_both_page_title")
        }
        questionLabel={t("love_question")}
        questionText={t(currentQuestion.question)}
        index={index}
        total={loveQuestions.length}
        selected={selected1}
        stronglyDisagreeLabel={t("love_scale_strongly_disagree")}
        stronglyAgreeLabel={t("love_scale_strongly_agree")}
        previousLabel={t("love_previous")}
        nextLabel={
          submitting
            ? mode === "both"
              ? t("love_creating_invite")
              : t("love_calculating_result")
            : index + 1 === loveQuestions.length
              ? mode === "both"
                ? t("love_get_invite_link")
                : t("love_view_result")
              : t("love_next")
        }
        submitting={submitting}
        onSelect={(value) => {
          setSelected1(value);

          setTimeout(() => {
            handleNext(value);
          }, 120);
        }}
        onPrevious={() => {
          if (index === 0) return;

          const previousIndex = index - 1;

          setIndex(previousIndex);
          setSelected1(answers1[previousIndex] ?? null);
        }}
        onNext={() => handleNext()}
      />

      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        {mode === "both"
          ? t("love_both_result_note")
          : t("love_solo_result_note")}
      </p>
    </div>
  );
}
