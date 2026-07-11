import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const brevoKey = process.env.BREVO_API_KEY;

  if (brevoKey) {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({ email: normalized }),
    });

    if (res.status === 201) {
      await kv.sadd("newsletter:subscribers", normalized).catch(() => {});
      return NextResponse.json({ alreadySubscribed: false });
    }

    if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      if (body.code === "duplicate_parameter") {
        return NextResponse.json({ alreadySubscribed: true });
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  try {
    const added = await kv.sadd("newsletter:subscribers", normalized);
    return NextResponse.json({ alreadySubscribed: added === 0 });
  } catch {
    return NextResponse.json(
      { error: "Signups aren't connected yet — please try again soon." },
      { status: 503 }
    );
  }
}
