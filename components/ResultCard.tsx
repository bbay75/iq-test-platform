"use client";

interface ResultCardProps {
  title: string;
  result: string | number;
  description?: string;
  shareable?: boolean;
}

export default function ResultCard({
  title,
  result,
  description,
  shareable = true,
}: ResultCardProps) {
  const handleShare = async () => {
    const shareText = `My result: ${result} (${title}) 🔥 Try it yourself!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Personality Test Result",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Result copied to clipboard.");
      } catch {
        alert("Share хийх боломжгүй байна.");
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-4 text-3xl font-semibold text-blue-600 dark:text-blue-300">
        {result !== undefined && result !== null ? result.toString() : "0"}
      </p>

      {description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}

      {shareable && (
        <button
          onClick={handleShare}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Share Result
        </button>
      )}
    </div>
  );
}
