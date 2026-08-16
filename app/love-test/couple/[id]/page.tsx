"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loveQuestions } from "@/data/loveQuestions";
import { useLang } from "@/lib/LanguageProvider";
import LovePairResult from "@/components/LovePairResult";
import { supabase } from "@/lib/supabase";
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

  const [selected, setSelected] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<any>(null);

  const scaleOptions = [
    {
      value: 1,
      label: t("love_scale_strongly_disagree"),
    },
    {
      value: 2,
      label: t("love_scale_disagree"),
    },
    {
      value: 3,
      label: t("love_scale_neutral"),
    },
    {
      value: 4,
      label: t("love_scale_agree"),
    },
    {
      value: 5,
      label: t("love_scale_strongly_agree"),
    },
  ];

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

  const progress = ((index + 1) / loveQuestions.length) * 100;

  async function handleNext() {
    if (selected === null) return;

    const updatedAnswers = [...answers, selected];

    if (index + 1 < loveQuestions.length) {
      setAnswers(updatedAnswers);
      setIndex(index + 1);
      setSelected(null);
      return;
    }

    if (!person2Name.trim()) return;

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
          person2Answers: updatedAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit answers");
      }

      setAnswers(updatedAnswers);
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  }

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

  if (result && !session.result_unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
            Couple Compatibility
          </p>

          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            Таны хэсэг дууслаа
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Та хоёрын хамтарсан үр дүн бэлэн боллоо.
          </p>

          <div className="mt-6 rounded-2xl bg-pink-50 p-5 dark:bg-pink-950/20">
            <p className="font-semibold text-gray-900 dark:text-white">
              Үр дүнг тест эхлүүлсэн хүн нээнэ
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Хамтрагч тань үр дүнгээ нээсний дараа та энэ урилгын линкээр дахин
              орж хамтарсан үр дүнгээ харах боломжтой.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (result && session.result_unlocked) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-5xl">
          <LovePairResult
            result={result}
            person1Name={session.person1_name}
            person2Name={session.person2_name || "Хүн 2"}
          />
        </div>
      </div>
    );
  }
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-center text-sm font-medium text-pink-600 dark:text-pink-300">
            Couple Compatibility Test
          </p>

          <h1 className="mt-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {session.person1_name} таныг хамтдаа тест бөглөхөөр урьжээ
          </h1>

          <p className="mt-4 text-center text-sm leading-6 text-gray-600 dark:text-gray-300">
            Та 30 богино асуултад тусдаа хариулна. Дараа нь та хоёрын 6
            хэмжээсийн хамтарсан үр дүн гарна.
          </p>

          <input
            type="text"
            value={person2Name}
            onChange={(e) => setPerson2Name(e.target.value)}
            placeholder="Таны нэр"
            className="mt-6 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />

          <button
            type="button"
            disabled={!person2Name.trim()}
            onClick={() => setStarted(true)}
            className="mt-4 w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Тест эхлэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-7">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Couple Compatibility</span>

            <span>
              {index + 1} / {loveQuestions.length}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-pink-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="min-h-[120px]">
          <h1 className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-white md:text-2xl">
            {t(currentQuestion.question)}
          </h1>
        </div>

        <div className="mt-7 space-y-3">
          {scaleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className={`w-full rounded-xl border px-4 py-3 text-center font-medium transition ${
                selected === option.value
                  ? "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                  : "border-gray-300 bg-white text-gray-800 hover:border-pink-300 hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={selected === null || submitting}
          className="mt-7 w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Үр дүн гаргаж байна..."
            : index + 1 === loveQuestions.length
              ? "Үр дүн харах"
              : "Дараах"}
        </button>
      </div>
    </div>
  );
}
