"use client";

import { useState } from "react";
import { useLang } from "@/lib/LanguageProvider";

type ResultPaywallProps = {
  isUnlocked: boolean;
  title?: string;
  description?: string;
  priceLabel?: string;
  onUnlock: () => Promise<void> | void;
  disabled?: boolean;
};

export default function ResultPaywall({
  isUnlocked,
  title,
  description,
  priceLabel,
  onUnlock,
  disabled = false,
}: ResultPaywallProps) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);

  if (isUnlocked) return null;

  const handleUnlock = async () => {
    try {
      setLoading(true);
      await onUnlock();
    } catch (error) {
      console.error("Unlock failed:", error);
      alert(t("free_credit_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-yellow-300 bg-gradient-to-b from-white to-yellow-50 p-6 text-center shadow-lg dark:border-yellow-700 dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
        {title ?? t("unlock_full_result_title")}
      </h2>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {description ?? t("full_unlock_desc")}
      </p>

      <div className="mt-5 rounded-xl bg-gray-100 p-5 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("premium_content")}
        </p>

        <div className="mt-3 space-y-3">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <button
        type="button"
        onClick={handleUnlock}
        disabled={loading || disabled}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t("processing") : (priceLabel ?? t("paid_unlock_demo"))}
      </button>

      <p className="mt-4 text-sm font-medium text-yellow-700 dark:text-yellow-400">
        {t("unlock_to_view_full_premium_result")}
      </p>
    </div>
  );
}
