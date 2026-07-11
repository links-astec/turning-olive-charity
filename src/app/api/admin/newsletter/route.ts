import { NextResponse } from "next/server";

const LIST_ID = 2;
const SENDER = { name: "Turning Olive Charity", email: "info@turningolive.org" };

function buildHtml(subject: string, message: string) {
  const paragraphs = message
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6;color:#3f4629;">${p}</p>`)
    .join("");

  return `
  <div style="background:#faf7f0;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #e8ebd8;">
      <div style="background:#363b25;padding:24px 32px;">
        <span style="color:#faf7f0;font-size:18px;font-weight:bold;">Turning Olive Charity</span>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 20px;font-size:22px;color:#1c1f13;">${subject}</h1>
        ${paragraphs}
      </div>
      <div style="padding:24px 32px;border-top:1px solid #e8ebd8;">
        <p style="margin:0;font-size:12px;color:#7c8a48;">
          Turning Olive Charity &middot; La, Accra, Ghana<br/>
          <a href="{{ unsubscribe }}" style="color:#7c8a48;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>`;
}

export async function POST(request: Request) {
  let subject: unknown;
  let message: unknown;
  try {
    ({ subject, message } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof subject !== "string" || !subject.trim() || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return NextResponse.json({ error: "Email sending isn't configured yet" }, { status: 503 });
  }

  const createRes = await fetch("https://api.brevo.com/v3/emailCampaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      name: `${subject} — ${new Date().toISOString()}`,
      subject,
      sender: SENDER,
      htmlContent: buildHtml(subject, message),
      recipients: { listIds: [LIST_ID] },
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errBody.message || "Could not create the newsletter" },
      { status: 502 }
    );
  }

  const { id } = await createRes.json();

  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${id}/sendNow`, {
    method: "POST",
    headers: { "api-key": brevoKey },
  });

  if (!sendRes.ok) {
    const errBody = await sendRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errBody.message || "Could not send the newsletter" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
