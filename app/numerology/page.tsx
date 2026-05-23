"use client";

import { useState } from "react";
import Link from "next/link";
import { saveTestResult } from "@/lib/saveResult";
import { generateNumerologyResult } from "@/lib/numerology";
import { useRouter } from "next/navigation";

export default function NumerologyPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!fullName.trim() || !birthDate || !phoneNumber.trim()) {
      alert("Нэр, төрсөн огноо, утасны дугаараа бүрэн оруулна уу.");
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
        score: result.birth.number,
      });

      router.push(`/my-results/${saved.id}`);
    } catch (error) {
      console.error("Numerology save error:", error);
      alert("Үр дүн хадгалахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          ← Back to Home
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Numerology Reading
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Нэр, төрсөн огноо, утасны дугаараа оруулаад өөрийн энерги, утасны
            дугаарын зохицол, санхүүгийн хандлагыг үзээрэй.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Жишээ: Bat-Erdene Bold"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Жишээ: 99112233"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze My Numerology"}
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              What you will get
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Birth number reading</li>
              <li>• Name energy reading</li>
              <li>• Phone number compatibility</li>
              <li>• Money energy and suitability</li>
              <li>• Final combined insight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
