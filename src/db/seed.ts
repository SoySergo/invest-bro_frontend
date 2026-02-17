import { db } from "./index";
import { users, categories, listings, metrics, metricTypeEnum, listingStatusEnum } from "./schema";
import { faker } from '@faker-js/faker';

async function seed() {
  console.log("Seeding database...");

  // 1. Create Users
  const userIds = [];
  for (let i = 0; i < 5; i++) {
    const [user] = await db.insert(users).values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
    }).returning();
    userIds.push(user.id);
  }
  console.log(`Created ${userIds.length} users.`);

  // 2. Create Categories
  const categoryData = [
    { slug: "restaurant", nameEn: "Restaurant / Cafe", nameRu: "Ресторан / Кафе" },
    { slug: "retail", nameEn: "Retail Store", nameRu: "Розничный магазин" },
    { slug: "service", nameEn: "Service Business", nameRu: "Сфера услуг" },
    { slug: "hotel", nameEn: "Hotel / Hospitality", nameRu: "Отель / Гостиница" },
    { slug: "saas", nameEn: "SaaS", nameRu: "SaaS" },
    { slug: "ecommerce", nameEn: "E-commerce", nameRu: "Электронная коммерция" },
    { slug: "content", nameEn: "Content / Blog", nameRu: "Контент / Блог" },
    { slug: "app", nameEn: "Mobile App", nameRu: "Мобильное приложение" },
  ];

  const categoryIds = [];
  for (const cat of categoryData) {
      // Check if exists
      // Assuming clean db for seed or upsert
      const [inserted] = await db.insert(categories).values(cat).onConflictDoNothing().returning();
      if (inserted) categoryIds.push(inserted.id);
      else {
          // fetch existing
           const existing = await db.query.categories.findFirst({ where: (categories, { eq }) => eq(categories.slug, cat.slug) });
           if(existing) categoryIds.push(existing.id);
      }
  }
  console.log(`Created/Found ${categoryIds.length} categories.`);

  // 3. Create Listings
  for (let i = 0; i < 20; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const isOnline = i % 2 === 0; // split roughly 50/50
    
    // Generate Metrics Data
    const revenueData = Array.from({ length: 12 }).map((_, idx) => ({
        name: `Month ${idx + 1}`,
        value: faker.number.int({ min: 10000, max: 50000 })
    }));
    
    const usersData = Array.from({ length: 12 }).map((_, idx) => ({
        name: `Month ${idx + 1}`,
        value: faker.number.int({ min: 100, max: 5000 })
    }));

    const [listing] = await db.insert(listings).values({
        userId,
        categoryId,
        title: faker.company.catchPhrase(),
        description: `
# Business Overview
${faker.lorem.paragraph()}

## Key Highlights
- **${faker.company.buzzPhrase()}**: ${faker.lorem.sentence()}
- **${faker.company.buzzPhrase()}**: ${faker.lorem.sentence()}
- **Established Brand**: Operating since ${faker.date.past({ years: 5 }).getFullYear()}

### Growth Opportunities
1. ${faker.company.catchPhrase()}
2. ${faker.company.catchPhrase()}
3. Expansion into new markets

> "${faker.lorem.sentence()}"

## Reason for Selling
${faker.lorem.paragraph()}
        `.trim(),
        price: faker.finance.amount({ min: 10000, max: 1000000, dec: 2 }),
        currency: "USD",
        location: isOnline ? "Global" : `${faker.location.city()}, ${faker.location.country()}`,
        locationType: isOnline ? "online" : "offline",
        status: "active",
        yearlyRevenue: faker.finance.amount({ min: 100000, max: 500000, dec: 2 }),
        yearlyProfit: faker.finance.amount({ min: 20000, max: 100000, dec: 2 }),
    }).returning();

    // Metrics
    await db.insert(metrics).values({
        listingId: listing.id,
        type: "revenue",
        name: "Monthly Revenue",
        data: revenueData,
        unit: "$"
    });

    if (isOnline) {
        await db.insert(metrics).values({
            listingId: listing.id,
            type: "users",
            name: "Active Users",
            data: usersData,
            unit: "users"
        });
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
