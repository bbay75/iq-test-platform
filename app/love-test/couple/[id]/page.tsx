"use client";

import { useEffect, useState } from "react";

import { loveQuestions } from "@/data/loveQuestions";
import { useLang } from "@/lib/LanguageProvider";
import LovePairResult from "@/components/LovePairResult";
import { supabase } from "@/lib/supabase";
import LoveQuestionnaire from "@/components/LoveQuestionnaire";
import { useParams, useRouter } from "next/navigation";
type CoupleSession = {
  id: string;
  person1_name: string;
  person2_name: string | null;
  person1_completed: boolean;
  person2_completed: boolean;
  result_json: any;
  created_at: string;
  result_unlocked: boolean;
  result_id: string | null;
};

export default function LoveCoupleInvitePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");

  const { t } = useLang();

  const [session, setSession] = useState<CoupleSession | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [started, setStarted] = useState(false);

  const [person2Name, setPerson2Name] = useState("");

  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<number[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<any>(null);
  useEffect(() => {
    if (session?.result_unlocked && session?.result_id) {
      router.replace(`/my-results/${session.result_id}`);
    }
  }, [session?.result_unlocked, session?.result_id, router]);

  useEffect(() => {
    if (!id) return;

    async function loadSession() {
      try {
        const res = await fetch(`/api/love-couple/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load session");
        }

        setSession(data.session);

        if (data.session.person2_completed && data.session.result_json) {
          setResult(data.session.result_json);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`love-couple-invite-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "love_couple_sessions",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updated = payload.new as CoupleSession;

          setSession(updated);

          if (updated.result_unlocked && updated.result_json) {
            setResult(updated.result_json);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const currentQuestion = loveQuestions[index];
  const submitFinalAnswers = async (finalAnswers: number[]) => {
    if (!person2Name.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/love-couple/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person2Name: person2Name.trim(),
          person2Answers: finalAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit answers");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Уншиж байна...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="rounded-2xl bg-white p-6 text-center shadow dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Invite олдсонгүй
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  if (submitting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-pink-500" />
          <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">
            Үр дүнг тооцоолж байна...
          </p>
        </div>
      </div>
    );
  }
  if (result && !session.result_unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
            Couple Compatibility
          </p>

          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {t("love_pair_part_complete")}
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("love_pair_result_ready")}
          </p>

          <div className="mt-6 rounded-2xl bg-pink-50 p-5 dark:bg-pink-950/20">
            <p className="font-semibold text-gray-900 dark:text-white">
              {t("love_pair_result_owner_unlock")}
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t("love_pair_waiting_desc")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-center text-sm font-medium text-pink-600 dark:text-pink-300">
            {t("love_both_title")}
          </p>

          <h1 className="mt-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {session.person1_name} {t("love_pair_invite_title")}
          </h1>

          <p className="mt-4 text-center text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("love_pair_invite_desc")}
          </p>

          <input
            type="text"
            value={person2Name}
            onChange={(e) => setPerson2Name(e.target.value)}
            placeholder={t("love_name1_placeholder")}
            className="mt-6 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <button
            type="button"
            disabled={!person2Name.trim()}
            onClick={() => setStarted(true)}
            className="mt-4 w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("love_start_button")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
      <LoveQuestionnaire
        title={t("love_both_title")}
        questionLabel={t("love_question")}
        questionText={t(currentQuestion.question)}
        index={index}
        total={loveQuestions.length}
        selected={answers[index] ?? null}
        stronglyDisagreeLabel={t("love_scale_strongly_disagree")}
        stronglyAgreeLabel={t("love_scale_strongly_agree")}
        previousLabel={t("love_previous")}
        nextLabel={t("love_next")}
        hideNext={index + 1 === loveQuestions.length}
        submitting={submitting}
        onSelect={(value) => {
          const nextAnswers = [...answers];
          nextAnswers[index] = value;

          setAnswers(nextAnswers);
          if (index + 1 === loveQuestions.length) {
            submitFinalAnswers(nextAnswers);
          } else {
            setTimeout(() => {
              setIndex(index + 1);
            }, 180);
          }
        }}
        onPrevious={() => {
          if (index === 0) return;
          setIndex((prev) => prev - 1);
        }}
        onNext={() => {
          if (index < loveQuestions.length - 1) {
            setIndex(index + 1);
          }
        }}
      />
    </div>
  );
}
