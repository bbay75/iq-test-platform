"use client";

import { useState } from "react";
import Link from "next/link";
import { saveTestResult } from "@/lib/saveResult";
import { generateNumerologyResult } from "@/lib/numerology";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LanguageProvider";

export default function NumerologyPage() {
  const { t } = useLang();
  const [datePicker, setDatePicker] = useState<"year" | "month" | "day" | null>(
    null,
  );

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!fullName.trim() || !birthDate || !phoneNumber.trim()) {
      alert(t("fill_all_fields"));
      return;
    }

    try {
      setLoading(true);

      const result = generateNumerologyResult({
        fullName,
        birthDate,
        phoneNumber,
      });

      const saved = await saveTestResult({
        test_type: "numerology",
        result_json: result,
        score: result.finalScore,
      });

      router.push(`/my-results/${saved.id}`);
    } catch (error) {
      console.error("Numerology save error:", error);
      alert(t("save_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mx-auto block w-fit text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← {t("back_home")}
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("numerology_title")}
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {t("numerology_subtitle")}
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                {t("full_name")}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("full_name_placeholder")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                {t("birth_date")}
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    key: "year",
                    label: t("date_year"),
                    value: birthDate.split("-")[0],
                  },
                  {
                    key: "month",
                    label: t("date_month"),
                    value: birthDate.split("-")[1],
                  },
                  {
                    key: "day",
                    label: t("date_day"),
                    value: birthDate.split("-")[2],
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setDatePicker(item.key as "year" | "month" | "day")
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition hover:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-lg font-bold">
                      {item.key === "year" && item.value
                        ? `${item.value} ${t("date_year_suffix")}`
                        : item.key === "month" && item.value
                          ? `${Number(item.value)} ${t("date_month_suffix")}`
                          : item.key === "day" && item.value
                            ? `${Number(item.value)} ${t("date_day_suffix")}`
                            : t("date_select")}
                    </span>
                  </button>
                ))}
              </div>

              {datePicker && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                  onClick={() => setDatePicker(null)}
                >
                  <div
                    className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {datePicker === "year"
                          ? t("pick_year")
                          : datePicker === "month"
                            ? t("pick_month")
                            : t("pick_day")}
                      </h3>

                      <button
                        type="button"
                        onClick={() => setDatePicker(null)}
                        className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t("close")}
                      </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto pr-1">
                      <div className="grid grid-cols-3 gap-4">
                        {datePicker === "year" &&
                          Array.from(
                            { length: new Date().getFullYear() - 1919 },
                            (_, i) => new Date().getFullYear() - i,
                          ).map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => {
                                const month = birthDate.split("-")[1] || "";
                                const day = birthDate.split("-")[2] || "";

                                setBirthDate(`${year}-${month}-${day}`);
                                setDatePicker(null);
                              }}
                              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-900 transition hover:scale-[1.03] hover:bg-blue-600 hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white"
                            >
                              {year}
                            </button>
                          ))}

                        {datePicker === "month" &&
                          Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (monthNum) => {
                              const month = String(monthNum).padStart(2, "0");

                              return (
                                <button
                                  key={month}
                                  type="button"
                                  onClick={() => {
                                    const year = birthDate.split("-")[0] || "";
                                    const day = birthDate.split("-")[2] || "";

                                    setBirthDate(`${year}-${month}-${day}`);
                                    setDatePicker(null);
                                  }}
                                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-900 transition hover:scale-[1.03] hover:bg-blue-600 hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white"
                                >
                                  {monthNum} сар
                                </button>
                              );
                            },
                          )}

                        {datePicker === "day" &&
                          Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (dayNum) => {
                              const day = String(dayNum).padStart(2, "0");

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    const year = birthDate.split("-")[0] || "";
                                    const month = birthDate.split("-")[1] || "";

                                    setBirthDate(`${year}-${month}-${day}`);
                                    setDatePicker(null);
                                  }}
                                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-900 transition hover:scale-[1.03] hover:bg-blue-600 hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white"
                                >
                                  {dayNum}
                                </button>
                              );
                            },
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t("date_example")}
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                {t("phone_number")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={phoneNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 8);
                  setPhoneNumber(onlyDigits);
                }}
                placeholder={t("phone_placeholder")}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("analyzing") : t("analyze_numerology")}
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t("numerology_what_you_get")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• {t("birth_number_reading")}</li>
              <li>• {t("name_energy_reading")}</li>
              <li>• {t("phone_compatibility")}</li>
              <li>• {t("money_energy")}</li>
              <li>• {t("final_insight")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
