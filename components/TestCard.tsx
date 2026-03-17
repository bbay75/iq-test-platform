"use client";

import Link from "next/link";

interface TestCardProps {
  title: string;
  link: string;
  description?: string;
  emoji?: string;
}

export default function TestCard({
  title,
  link,
  description,
  emoji,
}: TestCardProps) {
  return (
    <Link href={link} className="block">
      <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 text-4xl">{emoji}</div>

        <h2 className="text-xl font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description || "Start this test"}
        </p>

        <div className="mt-5 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-300">
          Open test
          <span className="ml-2 transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
