import type { Metadata } from "next";
import Link from "next/link";

const imageUrl = "/share/iq-final/teaser.jpg";

export const metadata: Metadata = {
  title: "Миний IQ тестийн үр дүн",
  description: "Миний IQ хэд гарсан бол?",

  openGraph: {
    title: "Миний IQ тестийн үр дүн",
    description: "Миний IQ хэд гарсан бол?",
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "IQ Test result teaser",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Миний IQ тестийн үр дүн",
    description: "Миний IQ хэд гарсан бол?",
    images: [imageUrl],
  },
};

export default function IqTeaserSharePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-5 py-8 sm:px-8">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
          <img
            src={imageUrl}
            alt="IQ Test result teaser"
            className="block h-auto w-full"
          />
        </div>

        <section className="mx-auto mt-10 w-full max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
            IQ TEST
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Таны IQ хэд гарах бол?
          </h1>

          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-slate-300">
            Дүрслэл, тоо, логик болон үгийн холбооны 29 даалгавраар сэтгэх
            чадвараа сорь.
          </p>

          <div className="mt-9 grid gap-4">
            <Link
              href="/iq-test"
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01]"
            >
              IQ тест өгөх
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Бусад тест үзэх
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
