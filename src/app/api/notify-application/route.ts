import { NextResponse } from "next/server";
 
export async function POST(request: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
 
    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "Missing Telegram environment variables." },
        { status: 500 }
      );
    }
 
    const body = await request.json();
    const {
      fullName,
      age,
      city,
      intent,
      activityLevel,
      createdAt,
    } = body ?? {};
 
    const message = [
      "New Linkora Application",
      "",
      `Name: ${fullName ?? "-"}`,
      `Age: ${age ?? "-"}`,
      `City: ${city ?? "-"}`,
      `Intent: ${intent ?? "-"}`,
      `Activity: ${activityLevel ?? "-"}`,
      `Submitted: ${createdAt ?? new Date().toLocaleString()}`,
    ].join("\n");
 
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );
 
    const telegramData = await telegramRes.json();
 
    if (!telegramRes.ok) {
      console.error("Telegram API error:", telegramData);
      return NextResponse.json(
        { error: "Failed to send Telegram notification." },
        { status: 500 }
      );
    }
 
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notification route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}