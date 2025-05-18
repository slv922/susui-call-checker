"use client";

import { useState } from "react";
import { useCallChecker } from "@/utils/useCallChecker";

export default function Home() {
  const [myNumber, setMyNumber] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("myNumber");
      return stored ? parseInt(stored) : null;
    }
    return null;
  });

  const { currentNumber, status } = useCallChecker(myNumber);

  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">叫號提醒系統</h1>
      <input
        type="number"
        value={myNumber ?? ""}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value)) {
            setMyNumber(value);
            localStorage.setItem("myNumber", value.toString());
          }
        }}
        placeholder="請輸入你的號碼"
        className="border px-3 py-2 rounded w-full max-w-xs"
      />
      <div className="mt-4">
        <p>目前叫號：{currentNumber ?? "讀取中..."}</p>
        <p className="text-lg mt-2 font-semibold">{status}</p>
      </div>
    </main>
  );
}