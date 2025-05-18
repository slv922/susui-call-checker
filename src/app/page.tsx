"use client";

import { useState, useEffect } from "react";
import { useCallChecker } from "@/utils/useCallChecker";
import axios from "axios";

export default function Home() {
  const [myNumber, setMyNumber] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("myNumber");
      return stored ? parseInt(stored) : null;
    }
    return null;
  });

  const { currentNumber, status, notified, setNotified } = useCallChecker(myNumber);

  useEffect(() => {
    if (status.includes("已叫到") && !notified) {
      const sendTelegramNotification = async () => {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        const message = `📢 已叫到你囉！目前叫號：${currentNumber}`;

        if (botToken && chatId) {
          try {
            await axios.post(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                chat_id: chatId,
                text: message,
              }
            );
            console.log("Telegram notification sent.");
          } catch (error) {
            console.error("Failed to send Telegram notification:", error);
          }
        } else {
          console.error("Telegram bot token or chat ID is missing.");
        }
      };

      if (Notification.permission === "granted") {
        new Notification("📢 已叫到你囉！", {
          body: `目前叫號：${currentNumber}`,
        });
        setNotified(true);
        sendTelegramNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("📢 已叫到你囉！", {
              body: `目前叫號：${currentNumber}`,
            });
            setNotified(true);
            sendTelegramNotification();
          }
        });
      }
    }
  }, [status, notified, currentNumber, setNotified]);

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