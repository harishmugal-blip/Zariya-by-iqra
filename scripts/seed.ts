import { db } from "../src/lib/db";
import { PRODUCTS, CATEGORIES, COLLECTIONS, COUPONS } from "../src/data/catalog";
import { createHash } from "crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Create admin user
  const adminEmail = "admin@zariya.com";
  const adminPassword = "zariya123"; // default password
  const hashed = createHash("sha256").update(adminPassword).digest("hex");

  const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: adminEmail,
        name: "ZARIYA Admin",
        password: hashed,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✅ Admin user created: admin@zariya.com / zariya123");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // 2. Seed categories
  for (const cat of CATEGORIES) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
      },
    });
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`);

  // 3. Seed collections
  for (const col of COLLECTIONS) {
    await db.collection.upsert({
      where: { slug: col.slug },
      update: {
        name: col.name,
        tagline: col.tagline,
        description: col.description,
        image: col.image,
      },
      create: {
        slug: col.slug,
        name: col.name,
        tagline: col.tagline,
        description: col.description,
        image: col.image,
      },
    });
  }
  console.log(`✅ ${COLLECTIONS.length} collections seeded`);

  // 4. Seed products
  for (const p of PRODUCTS) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        story: p.story,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        category: p.category,
        collection: p.collection,
        fabric: p.fabric,
        fabricDetails: JSON.stringify(p.fabricDetails),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
        images: JSON.stringify(p.images),
        rating: p.rating,
        reviewCount: p.reviewCount,
        badges: JSON.stringify(p.badges),
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        limitedEdition: p.limitedEdition,
        stock: p.stock,
        sku: p.sku,
        care: p.careInstructions,
        shipping: p.shippingInfo,
        tags: JSON.stringify(p.tags),
        videoUrl: p.videoUrl || null,
        active: true,
      },
      create: {
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        story: p.story,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        category: p.category,
        collection: p.collection,
        fabric: p.fabric,
        fabricDetails: JSON.stringify(p.fabricDetails),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
        images: JSON.stringify(p.images),
        rating: p.rating,
        reviewCount: p.reviewCount,
        badges: JSON.stringify(p.badges),
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        limitedEdition: p.limitedEdition,
        stock: p.stock,
        sku: p.sku,
        care: p.careInstructions,
        shipping: p.shippingInfo,
        tags: JSON.stringify(p.tags),
        videoUrl: p.videoUrl || null,
        active: true,
      },
    });
  }
  console.log(`✅ ${PRODUCTS.length} products seeded`);

  // 5. Seed coupons
  for (const c of COUPONS) {
    await db.coupon.upsert({
      where: { code: c.code },
      update: {
        type: c.type,
        value: c.value,
        minOrder: c.minOrder,
        description: c.description,
        active: true,
      },
      create: {
        code: c.code,
        type: c.type,
        value: c.value,
        minOrder: c.minOrder,
        description: c.description,
        active: true,
      },
    });
  }
  console.log(`✅ ${COUPONS.length} coupons seeded`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin Login:");
  console.log("  Email:    admin@zariya.com");
  console.log("  Password: zariya123");
  console.log("  URL:      /admin/login");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
