import NewsletterComposer from "@/components/NewsletterComposer";
import LogoutButton from "@/components/LogoutButton";

async function getSubscriberCount(): Promise<number> {
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts/lists/2", {
      headers: { "api-key": process.env.BREVO_API_KEY ?? "" },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalSubscribers ?? 0;
  } catch {
    return 0;
  }
}

export default async function NewsletterAdminPage() {
  const subscriberCount = await getSubscriberCount();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-olive-950">Send a Newsletter</h1>
          <p className="mt-2 text-olive-700">
            Write your update below. It&rsquo;ll be sent to everyone who&rsquo;s signed up on the
            website.
          </p>
        </div>
        <LogoutButton />
      </div>
      <NewsletterComposer subscriberCount={subscriberCount} />
    </div>
  );
}
