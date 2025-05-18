"use client";
import { useEffect, useState } from "react";

export function useCallChecker(myNumber: number | null) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await fetch("/api/current-number");
        const data = await res.json();
        const number = data.number;
        setCurrentNumber(number);

        if (myNumber !== null) {
          if (number >= myNumber) {
            setStatus("🎉 已叫到你了！");
            setNotified(true);
          } else if (number >= myNumber - 3) {
            setStatus("⚠️ 快輪到你囉！");
          } else {
            setStatus("");
            setNotified(false);
          }
        }
      } catch (err) {
        setStatus("❌ 無法取得叫號資訊");
      }
    };

    fetchNumber();
    const interval = setInterval(fetchNumber, 15000);
    return () => clearInterval(interval);
  }, [myNumber]);

  return { currentNumber, status, notified, setNotified };
}
