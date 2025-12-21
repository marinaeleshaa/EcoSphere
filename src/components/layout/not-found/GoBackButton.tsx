"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton({ text }: { text: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="myBtnPrimary min-w-[200px]"
    >
      {text}
    </button>
  );
}
