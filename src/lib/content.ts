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
  slogan: "Impacting the world in our own small ways.",
  tagline: "Impacting the world in our own small ways.",
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
  pullQuote:
    "Today, Olive Charity is more than just about clothes. It's about dignity, sustainability, and compassion. It's about turning simple acts of giving into olive branches of hope.",
  paragraphs: [
    "My journey into charity work started in the most ordinary way — through clothes. Growing up, my parents always passed down my outgrown clothes and that of my siblings' to our younger cousins, nieces and nephews. Not because they were under-privileged, but because those clothes were lovely custom-made, which were either going to just lie around or be thrown away. My parents dislike wasting anything that can be of benefit to someone else. We had only outgrown these clothes — they were actually in very good condition. We all know it's common in Ghanaian society to pass down clothes you've grown bigger than to your younger siblings or other family members. It was a simple act, but it taught me the value of sharing and making sure nothing went to waste.",
    "As I got older, I continued the tradition, giving my clothes to my nieces, especially when I was in university. But eventually, they grew bigger than me in size, and my clothes no longer fit them. Everyone reading this knows I have been a size six (6) all my life and just recently an eight (8). So it wasn't surprising that with time my nieces and cousins outgrew me in size. I tried offering my clothes to a neighbour who was physically similar to me. At first, she was reluctant — hesitant to accept second-hand clothes — but she eventually did, and that moment stayed with me.",
    "I mentioned her reluctance to my mother, and she gave me advice that changed everything: she told me that not everyone is comfortable receiving or giving out used clothes. Some see it as charity, others as stigma. But there are many people who genuinely need clothing and would welcome it with dignity.",
    "That conversation planted the seed for Olive Charity. I realized there needed to be a structured and respectful way to give clothes to those who truly needed them. That was when the idea of donating my clothes to an orphanage first came to mind. So I built an organization that does exactly that — collecting, repurposing, and distributing gently used clothing, while ensuring recipients feel valued, rather than pitied.",
    "But for me, charity is not just about handing out clothes, food, or gifts. I believe true impact comes from empowerment. Instead of pitying people or encouraging dependency, I want to help them build skills and knowledge so that they can stand on their own feet, care for their families, and improve their socio-economic standing. I believe that the difference between those of us who can care for ourselves economically and those who cannot is simply the privilege of a certain knowledge, skill or education — and when this 'know how and expertise' is made available to the under-privileged, they will equally be able to fend for themselves.",
    "That's why, as a certified baker, I've made baking skills part of our donations' impact. Alongside distributing clothing, we run workshops where beneficiaries learn how to bake. This way, they don't just receive help — they gain a skill that can generate income, provide food security, and open doors to financial independence in the nearest future.",
    "The story of Olive Charity is still being written, and I humbly invite you to be part of the next chapter.",
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
    image: "/images/baking-workshop-kids-1.jpg",
  },
];

export const board: BoardMember[] = [
  { name: "Sylvia Atswei Deesah Adjetey", role: "Founder", initials: "SA" },
  { name: "Nana Baffoe Abbam", role: "Executive Director", initials: "NB" },
  { name: "Aaron Akusem Akutteh", role: "Executive Director", initials: "AA" },
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
    title: "The Olive Charity Project: A Day of Giving and Celebration",
    excerpt:
      "Distribution, baking, and a shared cake with the community at Kumasi Children's Home — a day that captured what Turning Olive Charity is all about.",
    date: "2025-02-22",
    category: "Community",
    image: "/images/anniversary-celebration.jpg",
  },
];
