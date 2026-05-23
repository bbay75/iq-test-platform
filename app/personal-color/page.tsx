"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveTestResult } from "@/lib/saveResult";

export default function PersonalColorPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Зөвхөн зураг сонгоно уу.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToSupabase = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("personal-color")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("personal-color")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Public URL авч чадсангүй.");
    }

    return data.publicUrl;
  };
  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const MAX = 512;

        canvas.width = MAX;
        canvas.height = (img.height / img.width) * MAX;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);

            const newFile = new File([blob], file.name, {
              type: "image/jpeg",
            });

            resolve(newFile);
          },
          "image/jpeg",
          0.7,
        );
      };
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Эхлээд зураг upload хийнэ үү.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const resizedFile = await resizeImage(selectedFile);
      const imageUrl = await uploadImageToSupabase(resizedFile);

      const saved = await saveTestResult({
        test_type: "personal-color",
        result_json: null,
        score: null,
        is_unlocked: false,
        image_url: imageUrl,
      });

      if (saved?.id) {
        router.push(`/my-results/${saved.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-300 bg-white p-6 shadow">
        <h1 className="mb-2 text-3xl font-bold">Personal Color</h1>
        <p className="mb-6 text-slate-600">
          Зургаа upload хийгээд unlock хийж AI analysis аваарай.
        </p>

        <label className="mb-4 inline-block cursor-pointer rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">
          Take or Upload Photo
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
          />
        </label>

        {fileName && (
          <p className="mb-4 text-sm text-slate-600">
            Сонгосон файл: {fileName}
          </p>
        )}

        {previewUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-300 bg-slate-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="block h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-800">
            📸 For best results
          </p>

          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Natural гэрэлд зураг ав</li>
            <li>• Камер руу эгц хар</li>
            <li>• Filter, makeup бага байх</li>
            <li>• Бүдэг, харанхуй зураг бүү ашигла</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className={`w-full rounded-xl px-5 py-3 text-lg font-bold text-white 
  ${
    !selectedFile || loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-emerald-600 hover:bg-emerald-500"
  }`}
        >
          {loading ? "Saving..." : "Continue to Unlock"}
        </button>

        {error && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
