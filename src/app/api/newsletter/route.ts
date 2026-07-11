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
