// Content for Turning Olive Charity.
// Shaped so a future CMS (e.g. Sanity) swap only touches these exports,
// not the components that consume them.

export type Program = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: "shirt" | "chefHat";
  image: string;
};

export type BoardMember = {
  name: string;
  role: string;
  initials: string;
  image?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
};

export const siteInfo = {
  name: "Turning Olive Charity",
  shortName: "Olive Charity",
  registration: "GL-003-7942",
  slogan: "Impacting lives positively in our own small ways.",
  tagline: "Impacting lives positively in our own small ways.",
  mission:
    "To help in humanitarian, social and environmental issues, capacity building and advocating for economic change through donation, grants and sponsorship.",
  vision:
    "To create a sustainable, inclusive and empowered society where humanitarian, social and environmental challenges are transformed into opportunities for growth through capacity building, strategic support systems and economic empowerment for individuals and communities.",
  phone: "+233 57 606 0057",
  email: "info@turningolive.org",
  location: "La, Accra, Ghana",
};

export const donationInfo = {
  momoAccounts: [
    { network: "MTN Mobile Money", number: "+233 57 606 0057" },
    { network: "Telecel Cash", number: "0201128372" },
  ],
  bankAccount: null as string | null,
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export const galleryImages: GalleryImage[] = Array.from({ length: 268 }, (_, i) => ({
  src: `/images/gallery/gallery-${String(i + 1).padStart(3, "0")}.jpg`,
  alt: "Turning Olive Charity project — community event",
}));

export type Sponsor = {
  name: string;
  logo: string;
};

export const sponsors: Sponsor[] = [];

export const founderMessage = {
  name: "Engr. Sylvia Atswei Deesah Adjetey",
  role: "Founder, Turning Olive Charity",
  initials: "SA",
  image: "/images/founder-sylvia.png",
  pullQuote:
    "Today, Turning Olive Charity is more than just about clothes. It's about dignity, sustainability, and compassion. It's about turning simple acts of giving into olive branches of hope.",
  paragraphs: [
    "My journey into charity work started in the most ordinary way — through clothes. Growing up, my parents always passed down my outgrown clothes and that of my siblings to our younger cousins, nieces and nephews. Not because they were under-privileged, but because those clothes were lovely custom-made, which were either going just lie around or be thrown away. My parents dislike wasting anything that can be of benefit to someone else. We had only outgrown these clothes; they were in very good conditions. It is a common practice in Ghanaian society to pass down your clothes you have grown bigger than to your younger siblings or other family members. It was a simple act, but it taught me the value of sharing and making sure nothing went to waste.",
    "As I got older, I continued the tradition, giving my clothes to my nieces especially when I was in the University. But eventually, they grew bigger than me in size, and my clothes no longer fit them. I have been a size six (6) all my life and just recently a fluctuating eight (8). So, it wasn't surprising that with time my nieces and cousins outgrew me in size. I tried offering my clothes to a neighbour who was physically similar to me. At first, she was reluctant — hesitant to accept second-hand clothes — she eventually did, but that moment stayed with me.",
    "I mentioned her reluctance to my mother, and she gave me an advice that changed everything: She told me that not everyone is comfortable receiving or giving out used clothes. Some see it as charity, others as stigma. But there are many people who genuinely need clothing and would welcome it with dignity.",
    "That conversation planted the seed for Olive Charity, now Turning Olive Charity, an organisation inspired by my parents' generosity. I realized there needed to be a structured and respectful way to give clothes to those who truly needed them. That was when the idea donating my clothes to an orphanage first came to mind. So, I built an organization that does exactly that — collecting, repurposing, and distributing gently used clothing, while ensuring recipients feel valued, rather than pitied.",
    "Today, Turning Olive Charity is more than just about clothes. It's about dignity, sustainability, and compassion. It's about turning simple acts of giving into olive branches of hope.",
    "But for me, charity is not just about handing out clothes, food, or gifts. I believe true impact comes from empowerment. Instead of pitying people or encouraging dependency, I want to help them build skills and knowledge so that they can stand on their own feet, care for their families, and improve their socio-economic standing. I believe that the difference between those of us who can care for ourselves economically and those who cannot is simply the privilege of a certain knowledge, skill or education and when these 'know how' and expertise are made available to the under-privilege, they will equally be able to fend for themselves.",
    "That's why, as a certified baker, I've made baking a part of our donations' impact. Alongside distributing clothing, we run workshops where beneficiaries learn how to bake. This way, they don't just receive help — they gain a skill that can generate income, provide food security, and open doors to financial independence in the near future.",
    "The story of Turning Olive Charity is still being written, and I humbly invite you to part of the next chapter.",
  ],
};

export const programs: Program[] = [
  {
    slug: "clothing-essentials-distribution",
    title: "Clothing & Essentials Distribution",
    summary:
      "Distributing clothing, food, and everyday essentials to underprivileged children and communities.",
    description:
      "We organize distribution days that bring clothing, food staples, and household essentials directly to underprivileged children and communities — meeting immediate needs with dignity.",
    icon: "shirt",
    image: "/images/distribution-day.jpg",
  },
  {
    slug: "baking-skills-workshops",
    title: "Baking & Culinary Skills Workshops",
    summary:
      "Hands-on baking workshops that turn beneficiaries into skilled bakers who can generate their own income.",
    description:
      "Led by our founder, a certified baker, these workshops teach real, marketable baking skills — so that beneficiaries gain more than a handout. They gain a trade that can provide food security and a path to financial independence.",
    icon: "chefHat",
    image: "/images/baking-workshop-kneading.png",
  },
];

export const board: BoardMember[] = [
  {
    name: "Engr. Sylvia Atswei Deesah Adjetey",
    role: "Founder",
    initials: "SA",
    image: "/images/founder-sylvia.png",
  },
  { name: "Engr. Nana Baffoe Abbam", role: "Executive Director", initials: "NB" },
  { name: "Ing. Aaron Akusem Akutteh", role: "Executive Director", initials: "AA" },
  { name: "Jennifer Pendeland Bruce", role: "Board Secretary", initials: "JB" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "baking-workshop-recap",
    title: "Inside Our Baking Skills Workshop at Kumasi Children's Home",
    excerpt:
      "Beneficiaries young and old put on their aprons and hairnets to learn how to bake bread from scratch — a skill they can carry home and build on.",
    date: "2025-02-22",
    category: "Programs",
    image: "/images/baking-workshop-kids-2.jpg",
  },
  {
    slug: "distribution-day-recap",
    title: "A Distribution Day at Kumasi Children's Home",
    excerpt:
      "Clothing, food staples, and household essentials reached the children and staff at Kumasi Children's Home — delivered with dignity, not pity.",
    date: "2025-02-22",
    category: "Programs",
    image: "/images/distribution-day.jpg",
  },
  {
    slug: "the-olive-charity-project",
    title: "The Turning Olive Charity Project: A Day of Giving and Celebration",
    excerpt:
      "Distribution, baking, and a shared cake with the community at Kumasi Children's Home — a day that captured what Turning Olive Charity is all about.",
    date: "2025-02-22",
    category: "Community",
    image: "/images/anniversary-celebration.jpg",
  },
];

export type UpdateType = "donation" | "flyer" | "announcement";
export type UpdateStatus = "current" | "past";

export type CommunityUpdate = {
  slug: string;
  type: UpdateType;
  status: UpdateStatus;
  title: string;
  description: string;
  date: string;
  image: string;
};

export const communityUpdates: CommunityUpdate[] = [
  {
    slug: "donation-drive-2026-main",
    type: "flyer",
    status: "current",
    title: "Giving Hope & Care — 2026 Donation Drive",
    description:
      "A call for donations ahead of our outreach at the Ashanti School for the Deaf/Blind — teaching materials, sports equipment, renovation supplies, and food items.",
    date: "2026-11-27",
    image: "/images/flyers/donation-drive-2026-main.jpg",
  },
  {
    slug: "call-for-volunteers-2026",
    type: "announcement",
    status: "current",
    title: "Call for Volunteers",
    description:
      "Turning Olive Charity is looking for volunteers across community outreach, youth programs, media, and event support.",
    date: "2026-08-06",
    image: "/images/flyers/call-for-volunteers-2026.jpg",
  },
  {
    slug: "kumasi-donation-2025-02-22",
    type: "donation",
    status: "past",
    title: "Kumasi Children's Home Donation Drive",
    description:
      "Clothing, food, and household essentials delivered to Kumasi Children's Home, alongside a hands-on baking skills workshop.",
    date: "2025-02-22",
    image: "/images/flyers/kumasi-donation-2025-02-22.jpg",
  },
  {
    slug: "support-2026-donation-drive-letter",
    type: "announcement",
    status: "current",
    title: "Support Our 2026 Donation Drive — Official Letter",
    description:
      "Our formal appeal for the Nov 27 outreach at the Ashanti School for the Deaf/Blind, with the school's most urgent needs.",
    date: "2026-08-03",
    image: "/images/flyers/support-2026-donation-drive-letter.jpg",
  },
  {
    slug: "ngo-registration-announcement",
    type: "announcement",
    status: "current",
    title: "Big Announcement: Now Registered as Turning Olive Charity",
    description: "Olive Charity is officially registered as an NGO under the name Turning Olive Charity.",
    date: "2026-08-03",
    image: "/images/flyers/ngo-registration-announcement.jpg",
  },
  {
    slug: "donation-drive-2026-teaching-learning",
    type: "flyer",
    status: "current",
    title: "Donation Drive — Teaching & Learning Materials",
    description:
      "Computers, books, stationery, and other teaching essentials needed for the Nov 27 outreach at the Ashanti School for the Deaf/Blind.",
    date: "2026-11-27",
    image: "/images/flyers/donation-drive-2026-teaching-learning.jpg",
  },
  {
    slug: "donation-drive-2026-sports",
    type: "flyer",
    status: "current",
    title: "Donation Drive — Sports Equipment",
    description:
      "Footballs, jerseys, medals, and training gear needed for the Nov 27 outreach at the Ashanti School for the Deaf/Blind.",
    date: "2026-11-27",
    image: "/images/flyers/donation-drive-2026-sports.jpg",
  },
  {
    slug: "donation-drive-2026-food",
    type: "flyer",
    status: "current",
    title: "Donation Drive — Food & Provisions",
    description:
      "Rice, oil, canned foods, and other provisions needed for the Nov 27 outreach at the Ashanti School for the Deaf/Blind.",
    date: "2026-11-27",
    image: "/images/flyers/donation-drive-2026-food.jpg",
  },
  {
    slug: "donation-drive-2026-renovation",
    type: "flyer",
    status: "current",
    title: "Donation Drive — Renovation Materials",
    description:
      "Cement, paint, water tanks, and other renovation supplies needed for the Nov 27 outreach at the Ashanti School for the Deaf/Blind.",
    date: "2026-11-27",
    image: "/images/flyers/donation-drive-2026-renovation.jpg",
  },
  {
    slug: "founders-story-letter",
    type: "announcement",
    status: "current",
    title: "Founder's Story — How Turning Olive Charity Began",
    description: "The full letter from our founder on the journey from a simple act of giving to Turning Olive Charity.",
    date: "2026-08-01",
    image: "/images/flyers/founders-story-letter.jpg",
  },
];
