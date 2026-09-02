"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { unlockResult } from "@/lib/unlockResult";
import html2canvas from "html2canvas";
import ResultPaywall from "@/components/ResultPaywall";
import { useLang } from "@/lib/LanguageProvider";
import MbtiSharePoster from "@/components/MbtiSharePoster";
import LoveShareCard from "@/components/LoveShareCard";
import { generateMbtiShareImage } from "@/lib/generateMbtiShareImage";

import IqShareCard from "@/components/IqShareCard";

import LovePairResult from "@/components/LovePairResult";
import LoveDimensionsResult from "@/components/LoveDimensionsResult";
import LoveDimensionsNav from "@/components/LoveDimensionsNav";
import { getLoveShareTemplate } from "@/data/loveShareTemplates";

import {
  getMbtiPercentDescription,
  getMbtiCombinedProfile,
  getMbtiTraitScores,
  getMbtiDominantTraits,
  getMbtiReportInsights,
} from "@/lib/mbtiPremium";
import {
  ChartNoAxesColumnIncreasing,
  Fingerprint,
  ShieldCheck,
  TriangleAlert,
  Heart,
  BriefcaseBusiness,
  CloudLightning,
  Sprout,
  ChevronRight,
  ArrowUp,
  MessageCircle,
  Zap,
  HeartHandshake,
  Compass,
  ArrowRight,
  HeartPulse,
  Shapes,
  Calculator,
  Brain,
  Languages,
} from "lucide-react";
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
const loveSoloSections = [
  {
    key: "emotion",
    labelKey: "love_dimension_emotion",
    icon: Heart,
    targetId: "love-emotion",
    iconClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    hoverClass:
      "hover:border-pink-300 hover:bg-pink-50 dark:hover:border-pink-800 dark:hover:bg-pink-950/20",
  },
  {
    key: "communication",
    labelKey: "love_dimension_communication",
    icon: MessageCircle,
    targetId: "love-communication",
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    hoverClass:
      "hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-950/20",
  },
  {
    key: "trust",
    labelKey: "love_dimension_trust",
    icon: ShieldCheck,
    targetId: "love-trust",
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    hoverClass:
      "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20",
  },
  {
    key: "conflict",
    labelKey: "love_dimension_conflict",
    icon: Zap,
    targetId: "love-conflict",
    iconClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    hoverClass:
      "hover:border-amber-300 hover:bg-amber-50 dark:hover:border-amber-800 dark:hover:bg-amber-950/20",
  },
  {
    key: "intimacy",
    labelKey: "love_dimension_intimacy",
    icon: HeartHandshake,
    targetId: "love-intimacy",
    iconClass:
      "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    hoverClass:
      "hover:border-rose-300 hover:bg-rose-50 dark:hover:border-rose-800 dark:hover:bg-rose-950/20",
  },
  {
    key: "future",
    labelKey: "love_dimension_future",
    icon: Compass,
    targetId: "love-future",
    iconClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    hoverClass:
      "hover:border-violet-300 hover:bg-violet-50 dark:hover:border-violet-800 dark:hover:bg-violet-950/20",
  },
];
function isMobileDevice() {
  if (typeof navigator === "undefined") return false;

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

async function saveOrShareImage(blob: Blob) {
  const filename = "mbti-result.jpg";

  // Desktop дээр заавал download хийнэ
  if (!isMobileDevice()) {
    downloadBlob(blob, filename);
    return;
  }

  // Mobile дээр share sheet ашиглана
  const file = new File([blob], filename, { type: "image/jpeg" });

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: "Миний MBTI үр дүн",
        text: "Миний MBTI үр дүн",
      });
      return;
    }
  } catch (error) {
    // хэрэглэгч share sheet хаавал download руу унагаана
    console.warn("Native share cancelled or failed:", error);
  }

  // Mobile share болохгүй бол fallback download
  downloadBlob(blob, filename);
}

async function saveOrShareLoveImage(blob: Blob, score: number) {
  const filename = `love-result-${score}.jpg`;

  // Desktop
  if (!isMobileDevice()) {
    downloadBlob(blob, filename);
    return;
  }

  // Mobile
  const file = new File([blob], filename, {
    type: "image/jpeg",
  });

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: "Миний хайрын тестийн үр дүн",
        text: `Миний нийцэл ${score}%`,
      });

      return;
    }
  } catch (error) {
    console.warn("Love native share cancelled or failed:", error);
  }

  // fallback
  downloadBlob(blob, filename);
}
async function saveOrShareIqImage(blob: Blob, isUnlocked: boolean) {
  const filename = isUnlocked ? "iq-result.jpg" : "iq-result-teaser.jpg";

  if (!isMobileDevice()) {
    downloadBlob(blob, filename);
    return;
  }

  const file = new File([blob], filename, {
    type: "image/jpeg",
  });

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: isUnlocked ? "Миний IQ үр дүн" : "Миний IQ тестийн үр дүн",
        text: isUnlocked
          ? "Миний IQ тестийн үр дүн"
          : "Миний IQ тестийн үр дүн ямар гарсан бол?",
      });

      return;
    }
  } catch (error) {
    console.warn("IQ native share cancelled or failed:", error);
  }

  downloadBlob(blob, filename);
}
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
function getMbtiReportSections(lang: "mn" | "en") {
  return [
    {
      id: "mbti-dimensions",
      title:
        lang === "en"
          ? "Your personality percentages"
          : "Таны зан төлөвийн хувь",
      subtitle:
        lang === "en"
          ? "How strong are your 4 preferences?"
          : "4 чиглэл хэдэн хувьтай гарсан бэ?",
      icon: ChartNoAxesColumnIncreasing,
      iconClass:
        "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-400/15 dark:bg-violet-400/10 dark:text-violet-300",
    },
    {
      id: "mbti-profile",
      title: lang === "en" ? "Your personality profile" : "Таны хэв шинж",
      subtitle:
        lang === "en"
          ? "A combined interpretation of your 4 preferences"
          : "4 чиглэлийн хувийг нэгтгэсэн тайлал",
      icon: Fingerprint,
      iconClass:
        "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-400/15 dark:bg-indigo-400/10 dark:text-indigo-300",
    },
    {
      id: "mbti-strengths",
      title: lang === "en" ? "Strengths" : "Давуу тал",
      subtitle:
        lang === "en"
          ? "Traits that stand out more strongly"
          : "Танд илүү хүчтэй шинжүүд",
      icon: ShieldCheck,
      iconClass:
        "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300",
    },
    {
      id: "mbti-risks",
      title: lang === "en" ? "Watch-outs" : "Анхаарах тал",
      subtitle:
        lang === "en"
          ? "Patterns worth paying attention to"
          : "Анхаарах хэв маягууд",
      icon: TriangleAlert,
      iconClass:
        "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300",
    },
    {
      id: "mbti-relationships",
      title: lang === "en" ? "Love & relationships" : "Хайр ба харилцаа",
      subtitle: lang === "en" ? "How you tend to connect" : "Харилцах хэв маяг",
      icon: Heart,
      iconClass:
        "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/15 dark:bg-rose-400/10 dark:text-rose-300",
    },
    {
      id: "mbti-career",
      title: lang === "en" ? "Work & career" : "Ажил ба карьер",
      subtitle:
        lang === "en"
          ? "The work environment that suits you"
          : "Танд тохирох ажлын орчин",
      icon: BriefcaseBusiness,
      iconClass:
        "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-400/15 dark:bg-blue-400/10 dark:text-blue-300",
    },
    {
      id: "mbti-stress",
      title: lang === "en" ? "Under stress" : "Стрессийн үе",
      subtitle:
        lang === "en"
          ? "How your behavior may change"
          : "Дарамтын үед яаж өөрчлөгдөх вэ",
      icon: CloudLightning,
      iconClass:
        "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-400/15 dark:bg-purple-400/10 dark:text-purple-300",
    },
    {
      id: "mbti-growth",
      title: lang === "en" ? "Growth areas" : "Хөгжүүлэх тал",
      subtitle:
        lang === "en"
          ? "Your next balancing steps"
          : "Танд хэрэгтэй дараагийн алхам",
      icon: Sprout,
      iconClass:
        "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-400/15 dark:bg-lime-400/10 dark:text-lime-300",
    },
  ] as const;
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
  const loveShareRef = useRef<HTMLDivElement>(null);
  const iqShareRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [profileCredits, setProfileCredits] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);
  const [showBackToReport, setShowBackToReport] = useState(false);
  const [showLoveBackToNav, setShowLoveBackToNav] = useState(false);
  const loveNavRef = useRef<HTMLDivElement | null>(null);
  const [activeLoveSection, setActiveLoveSection] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (result?.test_type !== "love") return;

    const handleScroll = () => {
      const nav = loveNavRef.current;
      if (!nav) return;

      const rect = nav.getBoundingClientRect();

      setShowLoveBackToNav(rect.bottom < 120);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [result?.test_type]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToReport(window.scrollY > 700);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
      try {
        const res = await fetch(`/api/get-result?id=${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Fetch result error:", data.error);
          setResult(null);
          setLoading(false);
          return;
        }

        setResult(data as TestResult);
        setIsUnlocked(data.is_unlocked);
      } catch (error) {
        console.error(
          "Fetch result error:",
          error instanceof Error ? error.message : String(error),
        );
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);
  useEffect(() => {
    setProfileCredits(1);
    setProfileProgress(0);
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
  const mbtiReportSections = getMbtiReportSections(lang);
  const rawResultData = result.result_json;

  const resultData =
    result.test_type === "love" || result.test_type === "mbti"
      ? (rawResultData?.localized?.[lang] ??
        rawResultData?.localized?.mn ??
        rawResultData)
      : rawResultData;
  const isPairLoveResult =
    result.test_type === "love" && rawResultData?.mode === "both";
  const loveShareMode = isPairLoveResult ? "pair" : "solo";
  const weaknesses = resultData?.weaknesses ?? resultData?.challenges ?? [];

  const recommendation = resultData?.recommendation ?? resultData?.advice ?? "";
  const summary = resultData?.summary ?? "";
  const loveTemplate =
    result.test_type === "love" && typeof result.score === "number"
      ? getLoveShareTemplate(result.score)
      : null;
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

  const mbtiAxes = rawResultData?.axes ?? null;
  const mbtiPersonalProfile =
    result.test_type === "mbti"
      ? getMbtiCombinedProfile(
          String(rawResultData?.type ?? rawResultData?.label ?? "MBTI"),
          mbtiAxes,
          lang,
        )
      : null;

  const mbtiAxisCards = mbtiAxes
    ? [
        {
          key: "EI",
          category: lang === "en" ? "Energy direction" : "Энергийн чиглэл",
          firstLetter: "E",
          firstLabel: lang === "en" ? "Extraverted" : "Гадагшаа чиглэсэн",
          secondLetter: "I",
          secondLabel: lang === "en" ? "Introverted" : "Дотогшоо чиглэсэн",
          firstPercent: mbtiAxes.EI?.firstPercent ?? 50,
          secondPercent: mbtiAxes.EI?.secondPercent ?? 50,
        },
        {
          key: "SN",
          category:
            lang === "en" ? "Information style" : "Мэдээлэл хүлээн авах",
          firstLetter: "S",
          firstLabel: lang === "en" ? "Facts & reality" : "Бодит баримт",
          secondLetter: "N",
          secondLabel:
            lang === "en" ? "Intuition & possibilities" : "Зөн совин, боломж",
          firstPercent: mbtiAxes.SN?.firstPercent ?? 50,
          secondPercent: mbtiAxes.SN?.secondPercent ?? 50,
        },
        {
          key: "TF",
          category: lang === "en" ? "Decision style" : "Шийдвэр гаргалт",
          firstLetter: "T",
          firstLabel: lang === "en" ? "Logic" : "Логик",
          secondLetter: "F",
          secondLabel: lang === "en" ? "Values & feelings" : "Мэдрэмж",
          firstPercent: mbtiAxes.TF?.firstPercent ?? 50,
          secondPercent: mbtiAxes.TF?.secondPercent ?? 50,
        },
        {
          key: "JP",
          category: lang === "en" ? "Lifestyle" : "Амьдралын хэв маяг",
          firstLetter: "J",
          firstLabel: lang === "en" ? "Structured" : "Төлөвлөгөөтэй",
          secondLetter: "P",
          secondLabel: lang === "en" ? "Flexible" : "Уян хатан",
          firstPercent: mbtiAxes.JP?.firstPercent ?? 50,
          secondPercent: mbtiAxes.JP?.secondPercent ?? 50,
        },
      ]
    : [];

  const mbtiAnswers = Array.isArray(rawResultData?.answers)
    ? rawResultData.answers
    : [];

  const mbtiTraitScores = getMbtiTraitScores(mbtiAnswers);

  const mbtiDominantTraits = getMbtiDominantTraits(
    String(rawResultData?.type ?? rawResultData?.label ?? ""),
    mbtiAxes,
    mbtiTraitScores,
    lang,
  );
  const {
    strengths: mbtiPersonalStrengths,
    risks: mbtiPersonalRisks,
    relationships: mbtiRelationshipInsights,
    career: mbtiCareerInsights,
    stress: mbtiStressInsights,
    growth: mbtiGrowthInsights,
  } = getMbtiReportInsights(mbtiDominantTraits, lang);
  const mbtiGender: "female" | "male" =
    result.result_json?.gender === "male" ? "male" : "female";
  const iqScore = Number(result.result_json?.iq ?? result.score ?? 0);

  const iqScalePosition = Math.max(
    0,
    Math.min(100, ((iqScore - 55) / (145 - 55)) * 100),
  );

  const iqLevel =
    iqScore <= 69
      ? { label: "Маш доогуур", range: "69 хүртэл" }
      : iqScore <= 79
        ? { label: "Доогуур", range: "70–79" }
        : iqScore <= 89
          ? { label: "Дундажаас доогуур", range: "80–89" }
          : iqScore <= 109
            ? { label: "Дундаж", range: "90–109" }
            : iqScore <= 119
              ? { label: "Дундажаас дээгүүр", range: "110–119" }
              : iqScore <= 129
                ? { label: "Өндөр", range: "120–129" }
                : { label: "Маш өндөр", range: "130+" };
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
          {result.test_type === "love"
            ? t("love_result_title")
            : `${
                result.test_type === "personal-color"
                  ? t("test_personal_color")
                  : result.test_type === "iq"
                    ? t("test_iq")
                    : result.test_type === "mbti"
                      ? t("test_mbti")
                      : result.test_type === "numerology"
                        ? t("test_numerology")
                        : result.test_type === "palm"
                          ? t("test_palm")
                          : result.test_type
              } ${t("result")}`}
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
                if (result.test_type === "love") {
                  const score = Math.max(
                    0,
                    Math.min(100, Math.round(result.score ?? 0)),
                  );

                  const shareUrl = `${window.location.origin}/share/love/${score}`;

                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`,
                    "_blank",
                    "noopener,noreferrer",
                  );

                  return;
                }
                if (result.test_type === "iq") {
                  const score = Math.max(0, Math.min(145, Math.round(iqScore)));

                  const shareUrl = isUnlocked
                    ? `https://iq-test-platform-rouge.vercel.app/share/iq/${score}`
                    : `https://iq-test-platform-rouge.vercel.app/share/iq/teaser`;

                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`,
                    "_blank",
                    "noopener,noreferrer",
                  );

                  return;
                }
                const type = String(mbtiShareType || "INTJ").toLowerCase();
                const gender = mbtiGender;

                const shareUrl = `${window.location.origin}/share/mbti/${gender}/${type}`;

                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl,
                  )}`,
                  "_blank",
                  "noopener,noreferrer",
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

                  // LOVE
                  if (result.test_type === "love") {
                    const score = Math.max(
                      0,
                      Math.min(100, Math.round(result.score ?? 0)),
                    );

                    const response = await fetch(
                      `/share/love-final/${loveShareMode}/${score}.jpg`,
                    );

                    if (!response.ok) {
                      throw new Error("Love share image not found");
                    }

                    const blob = await response.blob();

                    await saveOrShareLoveImage(blob, score);

                    setToast(t("image_downloaded"));
                    setTimeout(() => setShowToast(false), 2000);
                    return;
                  }

                  // IQ
                  if (result.test_type === "iq") {
                    const score = Math.max(
                      0,
                      Math.min(145, Math.round(iqScore)),
                    );

                    const imagePath = isUnlocked
                      ? `/share/iq-final/${score}.jpg`
                      : `/share/iq-final/teaser.jpg`;

                    const response = await fetch(imagePath);

                    if (!response.ok) {
                      throw new Error("IQ share image not found");
                    }

                    const blob = await response.blob();

                    await saveOrShareIqImage(blob, isUnlocked);

                    setToast(t("image_downloaded"));
                    setTimeout(() => setShowToast(false), 2000);
                    return;
                  }

                  // MBTI
                  if (result.test_type === "mbti") {
                    const blob = await generateMbtiShareImage({
                      type: mbtiShareType,
                      gender: mbtiGender,
                    });

                    await saveOrShareImage(blob);

                    setToast(t("image_downloaded"));
                    setTimeout(() => setShowToast(false), 2000);
                    return;
                  }

                  setToast(t("download_failed"));
                  setTimeout(() => setShowToast(false), 2000);
                } catch (error) {
                  console.error("Share image generate failed:", error);

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
              </div>
            ) : result.test_type === "iq" ? (
              <div className="mt-4 w-full">
                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {lang === "en" ? "Your share image" : "Таны шэйр зураг"}
                </p>

                <div className="mx-auto w-[345px] max-w-full overflow-hidden rounded-2xl bg-black shadow-2xl sm:w-[600px]">
                  <div className="relative aspect-[1200/630] w-full overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 h-[630px] w-[1200px] origin-top-left scale-[0.2875] sm:scale-50">
                      <IqShareCard
                        isUnlocked={isUnlocked}
                        score={iqScore}
                        level={iqLevel.label}
                        levelRange={iqLevel.range}
                        percentile={Number(result.result_json?.percentile ?? 0)}
                        domains={result.result_json?.domains ?? {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : result.test_type === "love" &&
              typeof result.score === "number" ? (
              <div className="mt-4 w-full">
                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {lang === "en" ? "Your share image" : "Таны шэйр зураг"}
                </p>

                <div className="mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl bg-black shadow-2xl">
                  <img
                    src={`/share/love-final/${
                      isPairLoveResult ? "pair" : "solo"
                    }/${Math.max(
                      0,
                      Math.min(100, Math.round(result.score)),
                    )}.jpg`}
                    alt="Love share result"
                    className="block h-auto w-full"
                  />
                </div>
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
                        if (
                          result.test_type === "love" &&
                          result.result_json?.mode === "both" &&
                          result.result_json?.coupleSessionId
                        ) {
                          const { error: coupleUnlockError } = await supabase
                            .from("love_couple_sessions")
                            .update({
                              result_unlocked: true,
                            })
                            .eq("id", result.result_json.coupleSessionId);

                          if (coupleUnlockError) {
                            console.error(
                              "Love couple unlock sync error:",
                              coupleUnlockError.message,
                            );
                          }
                        }
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
            ) : result.test_type === "iq" ? (
              <div className="space-y-5">
                <div className="space-y-5">
                  {/* MAIN SCORE */}
                  <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-6">
                    <p className="text-center text-[14px] font-bold  tracking-[0.22em] text-blue-300">
                      {lang === "en" ? "ESTIMATED IQ RESULT" : "Таны IQ үр дүн"}
                    </p>

                    <div className="mt-3 text-center">
                      <div className="text-6xl font-black tracking-tight text-white sm:text-7xl">
                        {iqScore || "-"}
                      </div>

                      <div className="mt-2 flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          {iqLevel.label} ({iqLevel.range})
                        </span>
                      </div>
                    </div>

                    {/* IQ SCALE */}
                    <div className="mx-auto mt-6 max-w-xl px-1">
                      <div className="relative pt-3">
                        <div className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-violet-500" />

                        <div
                          className="absolute top-[6px] -translate-x-1/2"
                          style={{ left: `${iqScalePosition}%` }}
                        >
                          <div className="h-5 w-5 rounded-full border-[3px] border-white bg-slate-950 shadow-md" />
                        </div>
                      </div>

                      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-500">
                        <span>55</span>
                        <span>80</span>
                        <span>100</span>
                        <span>120</span>
                        <span>145+</span>
                      </div>
                    </div>

                    {/* STATS */}
                    <div className="mt-5 grid grid-cols-1 divide-y divide-white/[0.08] border-t border-white/[0.08] pt-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-white/[0.08]">
                      <div className="pb-5 text-center sm:px-4 sm:pb-0">
                        <p className="text-[11px] font-medium text-slate-500">
                          {lang === "en" ? "Percentile" : "Харьцуулсан түвшин"}
                        </p>

                        <p className="mt-1 text-2xl font-black text-blue-300">
                          {result.result_json?.percentile ?? "-"}%
                        </p>
                        <p className="text-xs font-medium leading-5 text-slate-500">
                          100 хүнээс ойролцоогоор{" "}
                          {result.result_json?.percentile ?? "-"} хүнийхээс
                          өндөр оноо
                        </p>
                      </div>

                      <div className="pt-5 text-center sm:px-4 sm:pt-0">
                        <p className="text-[11px] font-medium text-slate-500">
                          {lang === "en"
                            ? "Estimated range"
                            : "IQ онооны хүрээ"}
                        </p>

                        <p className="mt-1 text-2xl font-black text-white">
                          {result.result_json?.estimatedRange?.min ?? "-"}–
                          {result.result_json?.estimatedRange?.max ?? "-"}
                        </p>
                        <p className="text-xs font-medium leading-5 text-slate-500">
                          Таны оноо энэ орчимд хэлбэлзэж болно
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 4 DOMAINS */}
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {lang === "en"
                        ? "Cognitive profile"
                        : "Таны чадварын зураглал"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {lang === "en"
                        ? "Performance across the four areas measured in this test."
                        : "Тестийн 4 чиглэлээр таны авсан оноог харьцуулан харууллаа.."}
                    </p>

                    <div className="mt-6 space-y-5">
                      {[
                        {
                          key: "visual",
                          icon: Shapes,
                          iconClass:
                            "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
                          label:
                            lang === "en"
                              ? "Visual reasoning"
                              : "Дүрслэлийн логик",
                        },
                        {
                          key: "number",
                          icon: Calculator,
                          iconClass:
                            "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300",
                          label:
                            lang === "en"
                              ? "Numerical reasoning"
                              : "Тоон сэтгэлгээ",
                        },
                        {
                          key: "logic",
                          icon: Brain,
                          iconClass:
                            "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
                          label:
                            lang === "en"
                              ? "Logical reasoning"
                              : "Логик сэтгэлгээ",
                        },
                        {
                          key: "verbal",
                          icon: Languages,
                          iconClass:
                            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
                          label:
                            lang === "en" ? "Verbal reasoning" : "Үгийн холбоо",
                        },
                      ].map((item) => {
                        const value = Number(
                          result.result_json?.domains?.[item.key] ?? 0,
                        );

                        return (
                          <div key={item.key}>
                            <div className="mb-2 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
                                >
                                  <item.icon
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                  />
                                </div>

                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                  {item.label}
                                </span>
                              </div>

                              <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                                {value}%
                              </span>
                            </div>

                            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{
                                  width: `${Math.max(0, Math.min(100, value))}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* INTERPRETATION */}

                  {/* INTERPRETATION */}
                  <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-500/20 dark:bg-blue-500/5">
                    <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      {lang === "en"
                        ? "What does this mean?"
                        : "Энэ үр дүн юу гэсэн үг вэ?"}
                    </h2>

                    <p className="mt-3 leading-7 text-gray-700 dark:text-gray-300">
                      {result.result_json?.summary ?? ""}
                    </p>
                  </div>
                  {/* DISCLAIMER */}
                  {result.result_json?.disclaimer && (
                    <p className="px-2 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {result.result_json.disclaimer}
                    </p>
                  )}
                </div>
              </div>
            ) : result.test_type === "mbti" ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-indigo-300 bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6 shadow-xl dark:border-indigo-500/30 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-gray-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                    {lang === "en"
                      ? "MBTI PREMIUM RESULT"
                      : "ДЭЛГЭРЭНГҮЙ ҮР ДҮН"}
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
                <section
                  id="mbti-report-start"
                  className="scroll-mt-24 rounded-[28px] border border-violet-200/70 bg-gradient-to-br from-white via-violet-50/40 to-indigo-50/70 p-5 shadow-xl dark:border-violet-400/10 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/70 sm:p-6"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                        {lang === "en"
                          ? "SEER PERSONAL REPORT"
                          : "SEER ХУВИЙН ТАЙЛАН"}
                      </p>
                    </div>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                      {lang === "en"
                        ? "Your detailed MBTI report"
                        : "Таны MBTI дэлгэрэнгүй тайлан"}
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-slate-400">
                      {lang === "en"
                        ? "A personalized report based on your 60 answers, including personality preferences, strengths, and growth areas."
                        : "Таны 60 хариултад үндэслэсэн зан төлөвийн хувь, онцлог, давуу тал болон хөгжүүлэх чиглэлүүд"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {mbtiReportSections.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            document.getElementById(item.id)?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                          className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3.5 py-3 text-left shadow-sm transition hover:border-violet-300 hover:bg-violet-50/40 dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-violet-400/30 dark:hover:bg-white/[0.06]"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.iconClass}`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={1.8} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>

                            <p className="mt-0.5 hidden text-xs text-gray-500 dark:text-slate-500 sm:block">
                              {item.subtitle}
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-violet-500 dark:text-slate-600" />
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section
                  id="mbti-dimensions"
                  className="scroll-mt-24 rounded-[28px] border border-gray-200 bg-white p-5 shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                      <ChartNoAxesColumnIncreasing
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                        {lang === "en"
                          ? "YOUR PERSONAL RESULT"
                          : "ТАНЫ ХУВИЙН ҮР ДҮН"}
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                        {lang === "en"
                          ? "Your 4 personality preference percentages"
                          : "Таны зан төлөвийн 4 чиглэлийн хувь"}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-400">
                        {lang === "en"
                          ? "These percentages are calculated from your 60 answers and show which side of each preference is stronger."
                          : "Аль чиглэл танд илүү давамгай байгааг таны 60 хариултаас тооцоолсон харьцаагаар харуулж байна."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {mbtiAxisCards.map((axis) => {
                      const insight = getMbtiPercentDescription(
                        axis.firstLetter,
                        axis.secondLetter,
                        axis.firstLabel,
                        axis.secondLabel,
                        axis.firstPercent,
                        axis.secondPercent,
                        lang,
                      );

                      return (
                        <div
                          key={axis.key}
                          className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5 dark:border-white/[0.07] dark:bg-white/[0.035]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {axis.category}
                            </p>

                            <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                              {insight.dominantLetter}{" "}
                              {Math.round(insight.dominantPercent)}%
                            </span>
                          </div>

                          <div className="mt-4 flex items-end justify-between gap-4">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                  {axis.firstLetter}
                                </span>

                                <span className="text-2xl font-black text-violet-600 dark:text-violet-300">
                                  {Math.round(axis.firstPercent)}%
                                </span>
                              </div>

                              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                                {axis.firstLabel}
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-300">
                                  {Math.round(axis.secondPercent)}%
                                </span>

                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                  {axis.secondLetter}
                                </span>
                              </div>

                              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                                {axis.secondLabel}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                            <div
                              className="h-full bg-violet-500 transition-all"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, axis.firstPercent),
                                )}%`,
                              }}
                            />

                            <div
                              className="h-full bg-indigo-400 transition-all dark:bg-indigo-500"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, axis.secondPercent),
                                )}%`,
                              }}
                            />
                          </div>

                          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-slate-300">
                            {insight.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section
                  id="mbti-profile"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-violet-50 to-indigo-50/60 p-5 dark:border-white/[0.08] dark:from-violet-500/10 dark:to-indigo-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-600 shadow-sm dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                        <Fingerprint className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                          {lang === "en"
                            ? "YOUR PERSONAL PATTERN"
                            : "ТАНЫ ХУВИЙН ХЭВ ШИНЖ"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? `Your ${mbtiShareType} pattern`
                            : `Таны ${mbtiShareType} хэв шинж`}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {mbtiPersonalProfile && (
                    <div className="p-5 sm:p-6">
                      <p className="text-base leading-7 text-gray-700 dark:text-slate-300">
                        {mbtiPersonalProfile.intro}
                      </p>

                      <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-400/10 dark:bg-violet-400/[0.06] sm:p-5">
                        <p className="text-sm font-bold text-violet-700 dark:text-violet-300">
                          {lang === "en"
                            ? "Your combined pattern"
                            : "Таны нийлмэл хэв шинж"}
                        </p>

                        <p className="mt-2 leading-7 text-gray-700 dark:text-slate-300">
                          {mbtiPersonalProfile.combined}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-500">
                            {lang === "en"
                              ? "CLEAREST PREFERENCE"
                              : "ХАМГИЙН ТОД ЧИГЛЭЛ"}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-slate-300">
                            {mbtiPersonalProfile.strongest}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-500">
                            {lang === "en"
                              ? "MOST FLEXIBLE AREA"
                              : "ИЛҮҮ УЯН ХАТАН ЧИГЛЭЛ"}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-slate-300">
                            {mbtiPersonalProfile.balanced}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
                <section
                  id="mbti-strengths"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50/60 p-5 dark:border-white/[0.08] dark:from-emerald-500/10 dark:to-teal-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                          {lang === "en" ? "YOUR STRENGTHS" : "ТАНЫ ДАВУУ ТАЛ"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "Your strongest behavioral patterns"
                            : "Танд илүү тод илэрсэн давуу талууд"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiPersonalStrengths.map((item, index) => (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {item.title}
                              </h3>

                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                                {item.level}
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section
                  id="mbti-risks"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50/60 p-5 dark:border-white/[0.08] dark:from-amber-500/10 dark:to-orange-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-600 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                        <TriangleAlert className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                          {lang === "en" ? "WATCH OUT FOR" : "АНХААРАХ ТАЛ"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "When your strengths become too strong"
                            : "Хүчтэй тал хэтрэх үед"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiPersonalRisks.length > 0 ? (
                      mbtiPersonalRisks.map((item) => (
                        <div
                          key={item.key}
                          className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-400/10 dark:bg-amber-400/[0.04]"
                        >
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-gray-600 dark:text-slate-300">
                        {lang === "en"
                          ? "Your answers do not show any strongly exaggerated behavioral tendency in this section."
                          : "Таны хариултаас энэ хэсэгт хэт тод давамгайлсан хэв маяг илрээгүй байна."}
                      </p>
                    )}
                  </div>
                </section>
                <section
                  id="mbti-relationships"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50/60 p-5 dark:border-white/[0.08] dark:from-rose-950/35 dark:to-rose-950/20 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-white text-rose-600 shadow-sm dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
                        <Heart className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
                          {lang === "en"
                            ? "LOVE & RELATIONSHIPS"
                            : "ХАЙР БА ХАРИЛЦАА"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "How you tend to connect with a partner"
                            : "Та дотно харилцаанд хэрхэн ханддаг вэ?"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiRelationshipInsights.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-sm font-bold text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
                            {item.letter}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {item.level}
                              </p>

                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {item.percent}%
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="mbti-career"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-5 dark:border-white/[0.08] dark:from-blue-500/10 dark:to-indigo-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-600 shadow-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
                        <BriefcaseBusiness
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                          {lang === "en" ? "WORK & CAREER" : "АЖИЛ БА КАРЬЕР"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "How you tend to work best"
                            : "Та ямар орчинд илүү сайн ажилладаг вэ?"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiCareerInsights.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                            {item.letter}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {item.level}
                              </p>

                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {item.percent}%
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="mbti-stress"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50/60 p-5 dark:border-white/[0.08] dark:from-violet-500/10 dark:to-purple-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-white text-violet-600 shadow-sm dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300">
                        <CloudLightning className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                          {lang === "en" ? "UNDER STRESS" : "СТРЕССИЙН ҮЕ"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "How your behavior may change under pressure"
                            : "Дарамтын үед таны хэв маяг хэрхэн өөрчлөгддөг вэ?"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiStressInsights.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                            {item.letter}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {item.level}
                              </p>

                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {item.percent}%
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="mbti-growth"
                  className="scroll-mt-24 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-slate-950/70"
                >
                  <div className="border-b border-gray-200 bg-gradient-to-r from-lime-50 to-emerald-50/60 p-5 dark:border-white/[0.08] dark:from-lime-500/10 dark:to-emerald-500/5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-200 bg-white text-lime-600 shadow-sm dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-300">
                        <Sprout className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700 dark:text-lime-300">
                          {lang === "en" ? "GROWTH" : "ХӨГЖҮҮЛЭХ ТАЛ"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {lang === "en"
                            ? "What can help you become more balanced?"
                            : "Танд илүү тэнцвэртэй болоход юу туслах вэ?"}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 sm:p-6">
                    {mbtiGrowthInsights.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-sm font-bold text-lime-700 dark:bg-lime-400/10 dark:text-lime-300">
                            {item.letter}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {item.level}
                              </p>

                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {item.percent}%
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                {showBackToReport && (
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("mbti-report-start")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/90 dark:text-white"
                    aria-label={
                      lang === "en"
                        ? "Back to report navigation"
                        : "Тайлангийн эхлэл рүү буцах"
                    }
                  >
                    <ArrowUp className="h-5 w-5" strokeWidth={2} />
                  </button>
                )}
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

                        <div className="space-y-6">
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
                                      <div className="mt-4 space-y-6">
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
              <div className={isUnlocked ? "space-y-5" : "hidden"}>
                {isPairLoveResult && (
                  <LovePairResult
                    result={rawResultData}
                    person1Name={rawResultData.person1Name || "Хүн 1"}
                    person2Name={rawResultData.person2Name || "Хүн 2"}
                    navRef={loveNavRef}
                    activeSection={activeLoveSection}
                    onSectionSelect={(key) => {
                      setActiveLoveSection(key);

                      setTimeout(() => {
                        setActiveLoveSection(null);
                      }, 1400);
                    }}
                  />
                )}

                {!isPairLoveResult && (
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 shadow-sm dark:border-rose-500/20 dark:from-rose-500/10 dark:via-gray-900 dark:to-pink-500/10">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                        {lang === "en"
                          ? "RELATIONSHIP OVERVIEW"
                          : "ХАРИЛЦААНЫ ЕРӨНХИЙ ДҮГНЭЛТ"}
                      </p>

                      <h2 className="mt-3 text-2xl font-black text-gray-900 dark:text-white">
                        {loveTemplate?.title}
                      </h2>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-5xl font-black text-gray-900 dark:text-white">
                          {result.score ?? "-"}%
                        </span>
                      </div>

                      <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                        {summary}
                      </p>
                    </div>

                    <div
                      id="love-dimensions-nav"
                      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <LoveDimensionsNav
                        navRef={loveNavRef}
                        activeSection={activeLoveSection}
                        onSelect={(key) => {
                          setActiveLoveSection(key);

                          setTimeout(() => {
                            setActiveLoveSection(null);
                          }, 1400);
                        }}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Давуу тал */}
                      <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-400">
                            <ShieldCheck
                              className="h-5 w-5"
                              strokeWidth={1.8}
                            />
                          </div>

                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                              {lang === "en" ? "STRENGTHS" : "ДАВУУ ТАЛ"}
                            </p>

                            <h3 className="mt-1 font-bold text-gray-900 dark:text-white">
                              {lang === "en"
                                ? "What is working well"
                                : "Таны харилцааны хүчтэй талууд"}
                            </h3>
                          </div>
                        </div>

                        <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                          {strengths.length ? (
                            strengths.map((item: string) => (
                              <li key={item}>• {item}</li>
                            ))
                          ) : (
                            <li>{t("no_strengths_data")}</li>
                          )}
                        </ul>
                      </div>

                      {/* Анхаарах зүйл */}
                      <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/10 text-amber-400">
                            <TriangleAlert
                              className="h-5 w-5"
                              strokeWidth={1.8}
                            />
                          </div>

                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
                              {lang === "en" ? "WATCH-OUTS" : "АНХААРАХ ТАЛ"}
                            </p>

                            <h3 className="mt-1 font-bold text-gray-900 dark:text-white">
                              {lang === "en"
                                ? "Areas worth paying attention to"
                                : "Анхаарах хэрэгтэй зүйлс"}
                            </h3>
                          </div>
                        </div>

                        <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
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

                    <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.04] p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-400">
                          <Compass className="h-5 w-5" strokeWidth={1.8} />
                        </div>

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                            {lang === "en" ? "GUIDANCE" : "ЗӨВЛӨМЖ"}
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            {lang === "en"
                              ? "What to focus on next"
                              : "Дараагийн алхам"}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {recommendation || t("no_recommendation")}
                      </p>
                    </div>

                    {result.test_type === "love" &&
                      resultData?.nameCompatibilityTitle && (
                        <div className="rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/[0.04] p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/10 text-fuchsia-400">
                              <HeartPulse
                                className="h-5 w-5"
                                strokeWidth={1.8}
                              />
                            </div>

                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-fuchsia-400">
                                {lang === "en"
                                  ? "NAME COMPATIBILITY"
                                  : "НЭРНИЙ ЗОХИЦОЛ"}
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                {resultData.nameCompatibilityTitle}
                              </h3>
                            </div>
                          </div>

                          {resultData.nameCompatibilitySummary && (
                            <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
                              {resultData.nameCompatibilitySummary}
                            </p>
                          )}

                          {resultData.nameCompatibilityAdvice && (
                            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                              {resultData.nameCompatibilityAdvice}
                            </p>
                          )}

                          <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            {lang === "en"
                              ? "This section is for entertainment and does not affect your relationship score."
                              : "Энэ хэсэг нь сонирхлын зориулалттай бөгөөд харилцааны үндсэн үнэлгээнд нөлөөлөхгүй."}
                          </p>
                        </div>
                      )}

                    {result.test_type === "love" &&
                      !isPairLoveResult &&
                      Array.isArray(resultData?.detailedSections) &&
                      resultData.detailedSections.length > 0 && (
                        <LoveDimensionsResult
                          sections={resultData.detailedSections}
                          mode="solo"
                          activeSection={activeLoveSection}
                        />
                      )}
                  </div>
                )}
              </div>
            )}

            {result.test_type === "love" && showLoveBackToNav && (
              <button
                type="button"
                onClick={() => {
                  const nav = loveNavRef.current;

                  if (nav) {
                    const y =
                      nav.getBoundingClientRect().top + window.scrollY - 90;

                    window.scrollTo({
                      top: y,
                      behavior: "smooth",
                    });
                  }
                }}
                className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/90 dark:text-white"
                aria-label={
                  lang === "en"
                    ? "Back to relationship sections"
                    : "Харилцааны хэсэг рүү буцах"
                }
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2} />
              </button>
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
      {result.test_type === "love" && typeof result.score === "number" && (
        <div
          className="pointer-events-none fixed left-[-9999px] top-0"
          style={{
            width: "1200px",
            height: "630px",
          }}
        >
          <div
            ref={loveShareRef}
            style={{
              width: "1200px",
              height: "630px",
            }}
          >
            <LoveShareCard score={result.score} />
          </div>
        </div>
      )}
    </div>
  );
}
