import { db } from "../src/lib/db";

async function seed() {
  const slides = [
    { image: "/images/hero/hero-1.png", title: "Timeless Kashmiri Elegance", subtitle: "Heirloom pherans, pashmina shawls and embroidered suits — each piece, a quiet act of devotion.", badge: null, order: 0 },
    { image: "/images/hero/hero-2.png", title: "Wear the Heritage of the Valley", subtitle: "From the looms of Srinagar to your wardrobe — fashion that carries 150 years of artisan lineage.", badge: "New Arrival", order: 1 },
    { image: "/images/hero/hero-3.png", title: "Every Thread, A Story", subtitle: "Hand-embroidered aari & sozni, woven one stitch at a time by master Kashmiri artisans.", badge: "Coming Soon", order: 2 },
  ];
  for (const s of slides) {
    await db.heroSlide.upsert({
      where: { id: `hero-${s.order}` },
      update: s,
      create: { id: `hero-${s.order}`, ...s, eyebrow: "Handcrafted in Kashmir · Estd. 2009", buttonText: "Shop Collection", buttonLink: "/store" },
    });
  }
  console.log("✅ 3 hero slides seeded");
}
seed().then(() => db.$disconnect());
