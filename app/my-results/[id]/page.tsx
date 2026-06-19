"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { unlockResult } from "@/lib/unlockResult";
import html2canvas from "html2canvas";
import { useRef } from "react";
import ResultPaywall from "@/components/ResultPaywall";
import { useLang } from "@/lib/LanguageProvider";
import MbtiSharePoster from "@/components/MbtiSharePoster";
import { generateMbtiShareImage } from "@/lib/generateMbtiShareImage";
type TestResult = {
  id: string;
  test_type: string;
  score: number | null;
  is_unlocked: boolean;
  created_at: string;
  image_url?: string | null;
  result_json: {
    iq?: number;
    label?: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendation?: string;

    season?: string;
    undertone?: string;
    confidence?: number;
    bestColors?: string[];
    avoidColors?: string[];
    outfits?: string[];
    jewelry?: string;
    makeup?: string;
    hair?: string;
    advice?: string;

    [key: string]: any;
  } | null;
};

function formatTestTitle(testType: string) {
  switch (testType) {
    case "personal-color":
      return "Personal Color";
    case "iq":
      return "IQ Test";
    case "mbti":
      return "MBTI Test";
    case "love":
      return "Love Test";
    case "numerology":
      return "Numerology Test";
    case "palm":
      return "Palm Reading";
    default:
      return testType;
  }
}

function getShareTitle(
  result: TestResult,
  isUnlocked: boolean,
  t: (key: any) => string,
) {
  if (result.test_type === "personal-color") {
    return result.result_json?.season
      ? `${t("share_personal_color_prefix")}: ${result.result_json.season}`
      : t("share_personal_color_result");
  }

  if (result.test_type === "iq") {
    return isUnlocked
      ? `${t("share_iq_score_prefix")}: ${result.score ?? "-"}`
      : t("share_iq_result");
  }

  if (result.test_type === "mbti") {
    return result.result_json?.label
      ? `${t("share_mbti_prefix")}: ${result.result_json.label}`
      : t("share_mbti_result");
  }

  return `${formatTestTitle(result.test_type)} ${t("result")}`;
}

function getDisplayData(
  result: TestResult,
  isUnlocked: boolean,
  t: (key: any) => string,
) {
  if (!isUnlocked) {
    return {
      title: t("premium_result"),
      subtitle: t("unlock_to_view"),
      tags: [],
      statLabel: t("status"),
      statValue: "🔒",
      sideLabel: t("access"),
      sideValue: t("locked"),
    };
  }

  if (result.test_type === "iq") {
    return {
      title: `IQ ${result.score ?? "-"}`,
      subtitle: result.result_json?.label || t("intelligence_result"),
      tags: [t("tag_logical"), t("tag_fast_thinking"), t("tag_problem_solver")],
      statLabel: t("iq_score_label"),
      statValue: String(result.score ?? "-"),
      sideLabel: t("level"),
      sideValue: result.result_json?.label || "-",
    };
  }

  if (result.test_type === "mbti") {
    return {
      title: result.result_json?.label || "MBTI",
      subtitle: t("personality_type"),
      tags: [t("tag_personality"), t("tag_traits"), t("tag_behavior")],
      statLabel: t("type"),
      statValue: result.result_json?.label || "-",
      sideLabel: t("status"),
      sideValue: t("ready"),
    };
  }

  if (result.test_type === "love") {
    return {
      title: `${result.score ?? "-"}%`,
      subtitle: t("compatibility_result"),
      tags: [t("tag_connection"), t("tag_trust"), t("tag_potential")],
      statLabel: t("match_label"),
      statValue: `${result.score ?? "-"}%`,
      sideLabel: t("status"),
      sideValue: t("ready"),
    };
  }

  if (result.test_type === "numerology") {
    const num = String(result.score ?? "-");

    const numerologyMap: Record<string, { subtitle: string; tags: string[] }> =
      {
        "1": {
          subtitle: "Independent Leader",
          tags: ["Leadership", "Drive", "Ambition"],
        },
        "2": {
          subtitle: "Peaceful Supporter",
          tags: ["Harmony", "Patience", "Care"],
        },
        "3": {
          subtitle: "Creative Communicator",
          tags: ["Creativity", "Joy", "Expression"],
        },
        "4": {
          subtitle: "Stable Builder",
          tags: ["Discipline", "Order", "Hard Work"],
        },
        "5": {
          subtitle: "Free Spirit",
          tags: ["Freedom", "Change", "Adventure"],
        },
        "6": {
          subtitle: "Responsible Nurturer",
          tags: ["Love", "Family", "Responsibility"],
        },
        "7": {
          subtitle: "Deep Thinker",
          tags: ["Wisdom", "Analysis", "Insight"],
        },
        "8": {
          subtitle: "Power & Success Energy",
          tags: ["Power", "Wealth", "Leadership"],
        },
        "9": {
          subtitle: "Compassionate Humanitarian",
          tags: ["Compassion", "Purpose", "Generosity"],
        },
      };

    const mapped = numerologyMap[num] || {
      subtitle: t("numerology_result"),
      tags: [t("tag_energy"), t("tag_direction"), t("tag_insight")],
    };

    return {
      title: `Life Path ${num}`,
      subtitle: mapped.subtitle,
      tags: mapped.tags,
      statValue: num,
      statLabel: t("number_label"),
      sideLabel: t("status"),
      sideValue: t("ready"),
    };
  }

  if (result.test_type === "palm") {
    return {
      title: t("palm_reading_result"),
      subtitle: t("hand_analysis"),
      tags: [t("tag_destiny"), t("tag_character"), t("tag_direction")],
      statLabel: t("reading"),
      statValue: t("ready"),
      sideLabel: t("status"),
      sideValue: t("unlocked"),
    };
  }

  if (result.test_type === "personal-color") {
    return {
      title: result.result_json?.season || t("test_personal_color"),
      subtitle: result.result_json?.undertone || t("color_analysis"),
      tags: [t("tag_style"), t("tag_tone"), t("tag_best_colors")],
      statLabel: t("season"),
      statValue: result.result_json?.season || "-",
      sideLabel: t("confidence"),
      sideValue:
        typeof result.result_json?.confidence === "number"
          ? `${
              result.result_json.confidence > 1
                ? Math.round(result.result_json.confidence)
                : Math.round(result.result_json.confidence * 100)
            }%`
          : "-",
    };
  }

  return {
    title: t("my_result"),
    subtitle: t("result"),
    tags: [t("tag_insight"), t("tag_analysis"), t("tag_result")],
    statLabel: t("score"),
    statValue: String(result.score ?? "-"),
    sideLabel: t("status"),
    sideValue: t("ready"),
  };
}
function getCssBackgroundUrls(node: HTMLElement) {
  const urls = new Set<string>();
  const elements = [
    node,
    ...Array.from(node.querySelectorAll("*")),
  ] as HTMLElement[];

  elements.forEach((el) => {
    const bg = window.getComputedStyle(el).backgroundImage;
    const matches = bg.match(/url\(["']?(.*?)["']?\)/g);

    matches?.forEach((match) => {
      const url = match.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
      if (url && url !== "none") urls.add(url);
    });
  });

  return Array.from(urls);
}

function preloadImage(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = async () => {
      try {
        await img.decode();
      } catch {}
      resolve();
    };
    img.onerror = () => resolve();
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

async function waitForShareAssets(node: HTMLElement) {
  await document.fonts.ready;

  const bgUrls = getCssBackgroundUrls(node);
  await Promise.all(bgUrls.map(preloadImage));

  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 300));
}
async function urlToDataUrl(url: string) {
  const absoluteUrl = new URL(url, window.location.origin).toString();
  const res = await fetch(absoluteUrl, { cache: "force-cache" });
  const blob = await res.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function inlineCssBackgroundImages(root: HTMLElement) {
  const elements = [
    root,
    ...Array.from(root.querySelectorAll("*")),
  ] as HTMLElement[];
  const restores: Array<() => void> = [];

  for (const el of elements) {
    const bg = window.getComputedStyle(el).backgroundImage;

    if (!bg || bg === "none" || !bg.includes("url(")) continue;

    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    const rawUrl = match?.[1];

    if (!rawUrl || rawUrl.startsWith("data:")) continue;

    const oldBg = el.style.backgroundImage;
    const dataUrl = await urlToDataUrl(rawUrl);

    el.style.backgroundImage = `url("${dataUrl}")`;

    restores.push(() => {
      el.style.backgroundImage = oldBg;
    });
  }

  return () => restores.forEach((restore) => restore());
}
export default function ResultDetailPage() {
  const { t, lang } = useLang();
  const params = useParams();
  const id = params.id as string;

  const [result, setResult] = useState<TestResult | null>(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [profileCredits, setProfileCredits] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);

  useEffect(() => {
    if (!isUnlocked) return;

    setStep(1);

    const t1 = setTimeout(() => setStep(2), 1500);
    const t2 = setTimeout(() => setStep(3), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (!isUnlocked) return;
    if (!result?.id) return;
    if (result?.test_type !== "personal-color") return;

    // result аль хэдийн бэлэн бол polling хэрэггүй
    if (result?.result_json) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/get-result?id=${result.id}`);
        const data = await res.json();

        if (data?.result_json) {
          setResult(data);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isUnlocked, result?.id, result?.result_json, result?.test_type]);

  const [analysisStarted, setAnalysisStarted] = useState(false);

  useEffect(() => {
    const runAnalysis = async () => {
      if (!result) return;
      if (result.test_type !== "personal-color") return;
      if (!isUnlocked) return;
      if (result.result_json) return;
      if (!result.image_url) return;
      if (analysisStarted) return;

      try {
        setAnalysisStarted(true);

        const res = await fetch("/api/personal-color/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: result.image_url,
            resultId: result.id,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || data?.detail || "AI analyze failed");
        }

        setResult((prev) =>
          prev
            ? {
                ...prev,
                result_json: data,
                score:
                  typeof data?.confidence === "number"
                    ? Math.round(
                        data.confidence > 1
                          ? data.confidence
                          : data.confidence * 100,
                      )
                    : prev.score,
              }
            : prev,
        );
      } catch (err) {
        console.error("AI analyze error:", err);
        setAnalysisStarted(false);
      }
    };

    runAnalysis();
  }, [isUnlocked, result, analysisStarted]);

  useEffect(() => {
    const fetchResult = async () => {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch result error:", error.message);
      } else if (data) {
        setResult(data as TestResult);
        setIsUnlocked(data.is_unlocked);
      }

      setLoading(false);
    };

    if (id) {
      fetchResult();
    }
  }, [id]);
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("free_credits, reward_progress")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile load error:", error.message);
        return;
      }

      if (data) {
        setProfileCredits(data.free_credits || 0);
        setProfileProgress(data.reward_progress || 0);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <p className="p-6">{t("loading")}</p>;
  }

  if (!result) {
    return <p className="p-6">{t("result_not_found")}</p>;
  }

  const isProTest = result.test_type === "personal-color";
  const isPersonalColor = result.test_type === "personal-color";
  const confidencePercent =
    typeof result.result_json?.confidence === "number"
      ? result.result_json.confidence > 1
        ? Math.round(result.result_json.confidence)
        : Math.round(result.result_json.confidence * 100)
      : 0;
  const displayData = getDisplayData(result, isUnlocked, t);

  const rawResultData = result.result_json;

  const resultData =
    result.test_type === "love" || result.test_type === "mbti"
      ? (rawResultData?.localized?.[lang] ??
        rawResultData?.localized?.mn ??
        rawResultData)
      : rawResultData;
  const weaknesses = resultData?.weaknesses ?? resultData?.challenges ?? [];

  const recommendation = resultData?.recommendation ?? resultData?.advice ?? "";
  const summary = resultData?.summary ?? "";

  const strengths = resultData?.strengths ?? [];
  const careerAdvice = resultData?.careerAdvice ?? "";
  const relationshipAdvice = resultData?.relationshipAdvice ?? "";
  const growthAdvice = resultData?.growthAdvice ?? "";
  const finalAdvice = resultData?.finalAdvice ?? recommendation;
  const personality = resultData?.personality ?? summary;
  const careers = resultData?.careers ?? [];
  const mbtiShareType =
    result.test_type === "mbti"
      ? (resultData?.type ??
        resultData?.label ??
        result.result_json?.type ??
        result.result_json?.label ??
        "MBTI")
      : "MBTI";

  const mbtiGender: "female" | "male" =
    result.result_json?.gender === "male" ? "male" : "female";
  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      {showToast && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-6">
          <div className="animate-[toastIn_0.25s_ease-out] rounded-xl bg-black/90 px-5 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-white dark:text-black">
            {toast}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/my-results"
          className="text-blue-500 hover:underline dark:text-blue-300"
        >
          ← {t("back")}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {result.test_type === "personal-color"
            ? t("test_personal_color")
            : result.test_type === "iq"
              ? t("test_iq")
              : result.test_type === "mbti"
                ? t("test_mbti")
                : result.test_type === "love"
                  ? t("test_love")
                  : result.test_type === "numerology"
                    ? t("test_numerology")
                    : result.test_type === "palm"
                      ? t("test_palm")
                      : result.test_type}{" "}
          {t("result")}
        </h1>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-3">
            {/* Copy */}
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setToast(t("copied_link"));

                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {t("copy_link")}
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  "_blank",
                );
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("share_facebook")}
            </button>

            {/* Instagram hint */}
            <button
              type="button"
              onClick={() => {
                setToast(t("instagram_hint"));

                setShowToast(true);
                setTimeout(() => setShowToast(false), 2500);
              }}
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
            >
              {t("instagram")}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  setToast("Зураг бэлдэж байна...");
                  setShowToast(true);

                  const blob = await generateMbtiShareImage({
                    type: mbtiShareType,
                    gender: mbtiGender,
                  });

                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");

                  link.href = url;
                  link.download = "test.jpg";
                  document.body.appendChild(link);
                  link.click();
                  link.remove();

                  setTimeout(() => URL.revokeObjectURL(url), 3000);

                  setToast(t("image_downloaded"));
                  setTimeout(() => setShowToast(false), 2000);
                } catch (error) {
                  console.error("Canvas generate failed:", error);
                  alert(error instanceof Error ? error.message : String(error));
                  setToast(t("download_failed"));
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }
              }}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              {t("download_image")}
            </button>
            {result.test_type === "mbti" ? (
              <div className="mt-4 w-full">
                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {lang === "en" ? "Your share poster" : "Таны шэйр зураг"}
                </p>

                <div className="mx-auto w-[345px] max-w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl sm:w-[480px]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
                    <div className="pointer-events-none absolute left-0 top-0 h-[1350px] w-[1080px] origin-top-left scale-[0.319444] sm:scale-[0.444444]">
                      <MbtiSharePoster
                        type={mbtiShareType}
                        gender={mbtiGender}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {lang === "en"
                    ? "Download this image and share it on Facebook or Instagram Story."
                    : "Энэ зургийг татаж аваад Facebook эсвэл Instagram story дээр хуваалцаарай."}
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm dark:border-blue-900/40 dark:from-gray-900 dark:to-blue-950/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                      {t("test_platform")}
                    </p>

                    <h1 className="mt-6 text-7xl font-bold leading-tight">
                      {displayData.title}
                    </h1>

                    <p className="mt-4 text-3xl text-gray-300">
                      {displayData.subtitle}
                    </p>
                  </div>

                  <div className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {t("my_result_badge")}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-white/5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {displayData.statLabel}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                      {displayData.statValue}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-white/5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {displayData.sideLabel}
                    </p>
                    <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">
                      {displayData.sideValue}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("share_story")}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    testplatform
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-800">
          <div className="mt-6">
            {!isUnlocked ? (
              <>
                {result.test_type === "iq" && (
                  <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t("iq_ready_notice")}
                    </p>
                  </div>
                )}

                {isProTest && (
                  <div className="mb-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-900">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("preview")}
                    </h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {t("personal_color_preview")}
                    </p>
                  </div>
                )}

                <ResultPaywall
                  isUnlocked={isUnlocked}
                  title={
                    result.test_type === "iq"
                      ? t("iq_unlock_ready")
                      : isProTest
                        ? t("unlock_pro_result")
                        : t("unlock_full_result_title")
                  }
                  description={
                    result.test_type === "iq"
                      ? t("iq_unlock_desc")
                      : isProTest
                        ? t("pro_unlock_desc")
                        : t("full_unlock_desc")
                  }
                  priceLabel={
                    result.test_type === "iq"
                      ? t("view_iq_result_price")
                      : isProTest
                        ? t("unlock_pro_demo")
                        : t("paid_unlock_demo")
                  }
                  onUnlock={async () => {
                    const ok = confirm(
                      isProTest
                        ? t("confirm_pro_unlock")
                        : t("confirm_demo_unlock"),
                    );
                    if (!ok) return;

                    try {
                      setUnlocking(true);

                      if (isProTest) {
                        const { data, error } = await supabase
                          .from("test_results")
                          .update({
                            is_unlocked: true,
                          })
                          .eq("id", result.id)
                          .select()
                          .single();

                        if (error) {
                          throw new Error(error.message);
                        }

                        setIsUnlocked(true);
                        setResult(data as TestResult);
                      } else {
                        const data = await unlockResult(result.id);
                        setIsUnlocked(true);
                        setResult(data.result);
                      }
                    } finally {
                      setUnlocking(false);
                    }
                  }}
                />
                {!isProTest && profileCredits > 0 && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {t("free_credit_you_have")} <b>{profileCredits}</b>{" "}
                      {profileCredits > 1
                        ? t("free_result_credits")
                        : t("free_result_credit")}
                      .
                    </p>

                    <button
                      type="button"
                      disabled={unlocking}
                      onClick={async () => {
                        const ok = confirm(t("confirm_credit_unlock"));
                        if (!ok) return;

                        try {
                          setUnlocking(true);

                          const data = await unlockResult(result.id);
                          setIsUnlocked(true);
                          setResult(data.result);

                          setToast(t("free_credit_used"));
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 2000);
                        } catch (error) {
                          console.error("Free credit unlock failed:", error);
                          alert(t("free_credit_error"));
                        } finally {
                          setUnlocking(false);
                        }
                      }}
                      className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {unlocking
                        ? t("processing")
                        : `${t("use_free_credit")} (${profileCredits})`}
                    </button>
                  </div>
                )}
              </>
            ) : isPersonalColor ? (
              <>
                {!result.result_json && (
                  <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-center text-white shadow-xl">
                    <p className="text-xl font-bold animate-pulse">
                      {t("ai_analyzing")}
                    </p>

                    <p className="mt-3 text-sm opacity-80">
                      {step === 1 && t("analyzing_step_1")}
                      {step === 2 && t("analyzing_step_2")}
                      {step === 3 && t("analyzing_step_3")}
                    </p>

                    <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white animate-pulse w-2/3"></div>
                    </div>
                  </div>
                )}

                {result.result_json && (
                  <div className="space-y-5 text-gray-900 dark:text-white">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t("your_personal_color")}
                      </h2>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-gray-600 dark:text-gray-300">
                          {t("season_label")}
                        </span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                          {result.result_json?.season ?? "-"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-gray-600 dark:text-gray-300">
                          {t("undertone_label")}
                        </span>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                          {result.result_json?.undertone ?? "-"}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${confidencePercent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {t("confidence_label")} {confidencePercent}%
                        </p>
                      </div>

                      <p className="mt-5 leading-relaxed text-gray-700 dark:text-gray-300">
                        {result.result_json?.summary ?? t("no_summary")}
                      </p>

                      <div className="mt-6">
                        <h3 className="mb-2 font-semibold text-green-700 dark:text-green-400">
                          ✔ {t("best_colors")}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.result_json?.bestColors?.length ? (
                            result.result_json.bestColors.map(
                              (c: string, i: number) => (
                                <span
                                  key={i}
                                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-500/20 dark:text-green-300"
                                >
                                  {c}
                                </span>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("no_best_colors")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="mb-2 font-semibold text-red-700 dark:text-red-400">
                          ✖ {t("avoid_colors")}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.result_json?.avoidColors?.length ? (
                            result.result_json.avoidColors.map(
                              (c: string, i: number) => (
                                <span
                                  key={i}
                                  className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                >
                                  {c}
                                </span>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("no_avoid_colors")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t("jewelry_label")}
                          </h3>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {result.result_json?.jewelry ??
                              t("no_jewelry_advice")}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t("makeup_label")}
                          </h3>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {result.result_json?.makeup ??
                              t("no_makeup_advice")}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t("hair_label")}
                          </h3>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {result.result_json?.hair ?? t("no_hair_advice")}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t("outfit_ideas")}
                          </h3>
                          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                            {result.result_json?.outfits?.length ? (
                              result.result_json.outfits.map(
                                (o: string, i: number) => <li key={i}>{o}</li>,
                              )
                            ) : (
                              <li>{t("no_outfit_ideas")}</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-500/30 dark:bg-yellow-500/10">
                        <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                          {t("style_advice")}
                        </h3>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {result.result_json?.advice ?? t("no_advice")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : result.test_type === "mbti" ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-indigo-300 bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6 shadow-xl dark:border-indigo-500/30 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-gray-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                    MBTI PREMIUM RESULT
                  </p>

                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                        {resultData?.label ?? resultData?.type ?? "MBTI"}
                      </h2>

                      <p className="mt-2 text-xl font-bold text-indigo-700 dark:text-indigo-300">
                        {resultData?.name ?? "-"}
                      </p>

                      <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                        {summary}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-2xl bg-gray-900 px-5 py-4 text-center text-white shadow-lg dark:bg-white dark:text-gray-900">
                      <p className="text-sm opacity-70">{t("type")}</p>
                      <p className="mt-1 text-4xl font-black">
                        {resultData?.type ?? resultData?.label ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {lang === "en"
                      ? "Personality overview"
                      : "Зан төлөвийн дэлгэрэнгүй"}
                  </h2>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {personality}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      ✔ {lang === "en" ? "Strengths" : "Давуу тал"}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {strengths.length ? (
                        strengths.map((item: string) => (
                          <li key={item}>• {item}</li>
                        ))
                      ) : (
                        <li>
                          {lang === "en"
                            ? "No strengths data."
                            : "Давуу талын мэдээлэл алга."}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      ⚠ {lang === "en" ? "Watch out" : "Анхаарах зүйл"}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {weaknesses.length ? (
                        weaknesses.map((item: string) => (
                          <li key={item}>• {item}</li>
                        ))
                      ) : (
                        <li>
                          {lang === "en"
                            ? "No weakness data."
                            : "Анхаарах мэдээлэл алга."}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {lang === "en"
                      ? "Career direction"
                      : "Ажил мэргэжлийн чиглэл"}
                  </h3>

                  {careers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {careers.map((career: string) => (
                        <span
                          key={career}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                    {careerAdvice}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {lang === "en"
                      ? "Relationship style"
                      : "Харилцааны хэв маяг"}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {relationshipAdvice || resultData?.relationships}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {lang === "en" ? "Growth advice" : "Өсөлтийн зөвлөмж"}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {growthAdvice}
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5 dark:border-yellow-500/30 dark:bg-yellow-500/10">
                  <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
                    ✨{" "}
                    {lang === "en" ? "A note for you" : "Өөртөө сануулах зүйл"}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                    {finalAdvice}
                  </p>
                </div>
              </div>
            ) : result.test_type === "numerology" ? (
              (() => {
                const data = result.result_json;

                const activeNumerology =
                  data?.localized?.[lang] ?? data?.localized?.mn ?? data;

                const scoreBandText =
                  activeNumerology?.scoreBandText ?? data?.scoreBandText;

                const categoryScores = data?.categoryScores ?? {};

                const detailedSections = Array.isArray(
                  activeNumerology?.detailedSections,
                )
                  ? activeNumerology.detailedSections
                  : Array.isArray(data?.detailedSections)
                    ? data.detailedSections
                    : [];

                const birthData = activeNumerology?.birth ?? data?.birth;
                const nameData = activeNumerology?.name ?? data?.name;
                const phoneData = activeNumerology?.phone ?? data?.phone;
                const combinedData =
                  activeNumerology?.combined ?? data?.combined;

                const categoryLabels: Record<string, string> = {
                  identity: t("category_identity"),
                  expression: t("category_expression"),
                  money: t("category_money"),
                  relationship: t("category_relationship"),
                  direction: t("category_direction"),
                };

                return (
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-white p-6 shadow-xl dark:border-yellow-500/30 dark:from-yellow-500/10 dark:via-orange-500/10 dark:to-gray-900">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-300">
                            {t("numerology_premium_result")}
                          </p>

                          <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                            {scoreBandText?.title ??
                              t("numerology_energy_blueprint")}
                          </h2>

                          <p className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300">
                            {scoreBandText?.summary ?? combinedData?.summary}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-2xl bg-gray-900 px-5 py-4 text-center text-white shadow-lg dark:bg-white dark:text-gray-900">
                          <p className="text-sm opacity-70">
                            {t("numerology_final_score")}
                          </p>
                          <p className="mt-1 text-4xl font-black">
                            {data?.finalScore ?? result.score ?? "-"}%
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase">
                            {data?.scoreBand ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl bg-white/80 p-4 dark:bg-gray-950/60">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("numerology_birth_energy")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {birthData?.number ?? "-"} ·{" "}
                            {birthData?.title ?? "-"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/80 p-4 dark:bg-gray-950/60">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("numerology_name_energy")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {nameData?.number ?? "-"} · {nameData?.title ?? "-"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/80 p-4 dark:bg-gray-950/60">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("numerology_phone_energy")}
                          </p>
                          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {phoneData?.number ?? "-"} ·{" "}
                            {phoneData?.moneyEnergy ?? "-"}
                          </p>
                        </div>
                      </div>

                      {scoreBandText && (
                        <div className="mt-6 space-y-3">
                          <div className="rounded-2xl bg-green-500/10 p-4">
                            <p className="text-sm font-bold text-green-700 dark:text-green-300">
                              ✔ {t("numerology_your_strength")}
                            </p>
                            <p className="mt-2 leading-7 text-gray-800 dark:text-gray-200">
                              {scoreBandText.strengthMessage}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-red-500/10 p-4">
                            <p className="text-sm font-bold text-red-700 dark:text-red-300">
                              ⚠ {t("numerology_watch_out")}
                            </p>
                            <p className="mt-2 leading-7 text-gray-800 dark:text-gray-200">
                              {scoreBandText.watchOut}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-blue-500/10 p-4">
                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              💡 {t("numerology_soft_advice")}
                            </p>
                            <p className="mt-2 leading-7 text-gray-800 dark:text-gray-200">
                              {scoreBandText.advice}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-yellow-300/60 bg-yellow-100/60 p-4 dark:border-yellow-500/30 dark:bg-yellow-500/10">
                            <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
                              ✨ {t("numerology_grandma_note")}
                            </p>
                            <p className="mt-2 leading-7 text-gray-800 dark:text-gray-200">
                              {scoreBandText.grandmaNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t("numerology_key_scores")}
                      </h2>

                      <div className="mt-5 space-y-4">
                        {Object.entries(categoryScores).map(([key, value]) => {
                          const score = typeof value === "number" ? value : 0;

                          return (
                            <div key={key}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {categoryLabels[key] ?? key}
                                </p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {score}%
                                </p>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                <div
                                  className="h-full rounded-full bg-yellow-500"
                                  style={{
                                    width: `${Math.max(0, Math.min(100, score))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {detailedSections.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {t("numerology_detailed_reading")}
                        </h2>

                        <div className="space-y-3">
                          {detailedSections.map(
                            (section: any, index: number) => (
                              <details
                                key={section.key}
                                open={index === 0}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                              >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                                      {index === 0
                                        ? t("numerology_section_core")
                                        : index === 1
                                          ? t("numerology_section_name")
                                          : index === 2
                                            ? t("numerology_section_phone")
                                            : t("numerology_section_combined")}
                                    </p>
                                    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                      {section.title}
                                    </h3>
                                  </div>

                                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 group-open:hidden dark:bg-gray-800 dark:text-gray-300">
                                    {t("open")}
                                  </span>

                                  <span className="hidden rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 group-open:inline dark:bg-yellow-500/20 dark:text-yellow-300">
                                    {t("close")}
                                  </span>
                                </summary>

                                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                  <p className="leading-7 text-gray-700 dark:text-gray-300">
                                    {section.summary}
                                  </p>

                                  {Array.isArray(section.points) &&
                                    section.points.length > 0 && (
                                      <div className="mt-4 space-y-3">
                                        {section.points.map(
                                          (
                                            point: string,
                                            pointIndex: number,
                                          ) => (
                                            <p
                                              key={`${section.key}-${pointIndex}`}
                                              className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            >
                                              {point}
                                            </p>
                                          ),
                                        )}
                                      </div>
                                    )}
                                </div>
                              </details>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("summary")}
                  </h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {summary || t("no_summary")}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t("strengths")}
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {strengths.length ? (
                        strengths.map((item: string) => (
                          <li key={item}>• {item}</li>
                        ))
                      ) : (
                        <li>{t("no_strengths_data")}</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t("weaknesses")}
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {weaknesses.length ? (
                        weaknesses.map((item: string) => (
                          <li key={item}>• {item}</li>
                        ))
                      ) : (
                        <li>{t("no_weaknesses_data")}</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t("recommendation")}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {recommendation || t("no_recommendation")}
                  </p>
                </div>

                {result.test_type === "love" &&
                  resultData?.nameCompatibilityTitle && (
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {resultData.nameCompatibilityTitle}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {resultData.nameCompatibilitySummary}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {resultData.nameCompatibilityAdvice}
                      </p>
                    </div>
                  )}

                {result.test_type === "love" &&
                  Array.isArray(resultData?.detailedSections) &&
                  resultData.detailedSections.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t("detailed_compatibility")}
                      </h2>

                      {resultData.detailedSections.map((section: any) => (
                        <div
                          key={section.key}
                          className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {section.title}
                            </h3>

                            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                              {section.score}%
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                            {section.description}
                          </p>

                          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                            {section.advice}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none fixed left-[-9999px] top-0 opacity-100"
        style={{
          width: "1080px",
          height: "1350px",
          overflow: "hidden",
        }}
      >
        <div
          ref={shareRef}
          style={{
            width: "1080px",
            height: "1350px",
          }}
        >
          {result.test_type === "mbti" ? (
            <MbtiSharePoster type={mbtiShareType} gender={mbtiGender} />
          ) : (
            <div className="w-[1080px] min-h-[1350px] rounded-[40px] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-16 text-white">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xl font-semibold uppercase tracking-[0.3em] text-blue-300">
                    {t("test_platform")}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {displayData.subtitle}
                  </p>
                </div>

                <div className="rounded-full bg-blue-500 px-6 py-3 text-2xl font-semibold">
                  {t("my_result_badge")}
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="rounded-[28px] bg-white/10 p-8">
                  <p className="text-2xl text-gray-300">
                    {displayData.statLabel}
                  </p>
                  <p className="mt-3 text-7xl font-bold">
                    {displayData.statValue}
                  </p>
                </div>

                <div className="rounded-[28px] bg-white/10 p-8">
                  <p className="text-2xl text-gray-300">
                    {displayData.sideLabel}
                  </p>
                  <p className="mt-3 text-7xl font-bold">
                    {displayData.sideValue}
                  </p>
                </div>
              </div>

              <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-8">
                <p className="text-2xl text-gray-300">{t("share_story")}</p>
                <p className="text-3xl font-bold">testplatform</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
