"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageProvider";

type ResultItem = {
  id: string;
  test_type: string;
  score: number | null;
  created_at: string;
  is_unlocked: boolean;
  result_json?: {
    mode?: "solo" | "both";
  } | null;
};

function formatTestName(testType: string, t: (key: any) => string) {
  switch (testType) {
    case "iq":
      return t("test_iq");
    case "mbti":
      return t("test_mbti");
    case "love":
      return t("test_love");
    case "numerology":
      return t("test_numerology");
    case "palm":
      return t("test_palm");
    case "personal-color":
      return t("test_personal_color");
    default:
      return testType;
  }
}

export default function MyResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log("MY RESULTS USER:", user?.id);

        if (!user) {
          setResults([]);
          return;
        }

        const { data, error } = await supabase
          .from("test_results")
          .select("id, test_type, score, created_at, is_unlocked, result_json")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Fetch results error:", error.message);
          setResults([]);
          return;
        }

        setResults((data as ResultItem[]) || []);
      } catch (error) {
        console.error("Unexpected fetch error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:underline dark:text-blue-300"
            >
              ← {t("back")}
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {t("my_results_title")}
            </h1>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t("my_results_desc")}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-300">{t("loading")}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-gray-800">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("no_results_yet")}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t("take_test_first")}
            </p>

            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("start_test")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <Link key={r.id} href={`/my-results/${r.id}`}>
                <div className="h-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatTestName(r.test_type, t)}
                    </h2>

                    <div className="flex flex-wrap justify-end gap-2">
                      {r.test_type === "love" && r.result_json?.mode && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            r.result_json.mode === "both"
                              ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {r.result_json.mode === "both"
                            ? "Хамтдаа"
                            : "Ганцаараа"}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          r.is_unlocked
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {r.is_unlocked ? t("unlocked") : t("locked")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {t("score")}:
                      </span>{" "}
                      {r.score ?? "-"}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {t("mr_date")}:
                      </span>{" "}
                      {new Date(r.created_at).toLocaleString("mn-MN", {
                        timeZone: "Asia/Ulaanbaatar",
                      })}
                    </p>
                  </div>

                  <div className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                    {t("view_result")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
