"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="myBtnPrimary min-w-[200px]"
    >
      Go Back
    </button>
  );
}
