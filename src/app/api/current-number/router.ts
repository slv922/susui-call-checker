import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://e-pai-ke.com/shop/90858");
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const fsLabel = [...doc.querySelectorAll("div.fs-s")].find(
      (el) => (el.textContent ?? "").trim() === "現在叫號"
    );

    const numStr = fsLabel?.nextElementSibling?.textContent?.trim();
    const number = numStr && /^\d+$/.test(numStr) ? parseInt(numStr) : null;

    if (number !== null) {
      return NextResponse.json({ number });
    } else {
      return NextResponse.json({ error: "無法取得號碼" }, { status: 500 });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "未知錯誤";
    return NextResponse.json({ error: "擷取失敗", detail: errorMessage }, { status: 500 });
  }
}