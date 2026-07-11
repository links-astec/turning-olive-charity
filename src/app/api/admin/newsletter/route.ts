import { NextResponse } from "next/server";
import { renderNewsletterHtml, type NewsletterBlock } from "@/lib/newsletterTemplate";

const LIST_ID = 2;
const SENDER = { name: "Turning Olive Charity", email: "info@turningolive.org" };

export async function POST(request: Request) {
  let subject: unknown;
  let blocks: unknown;
  try {
    ({ subject, blocks } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof subject !== "string" || !subject.trim()) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return NextResponse.json({ error: "Add some content before sending" }, { status: 400 });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    return NextResponse.json({ error: "Email sending isn't configured yet" }, { status: 503 });
  }

  const html = renderNewsletterHtml(subject, blocks as NewsletterBlock[]);

  const createRes = await fetch("https://api.brevo.com/v3/emailCampaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": brevoKey },
    body: JSON.stringify({
      name: `${subject} — ${new Date().toISOString()}`,
      subject,
      sender: SENDER,
      htmlContent: html,
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
