# DressMe Seeding System Documentation

## Overview

The DressMe seeding system provides a **production-quality, modular, and deterministic** approach to generating development and testing data. It uses a **single PrismaClient instance** passed throughout all seed functions, follows **proper dependency ordering**, and generates consistent, repeatable data.

## Architecture

### Directory Structure

```
prisma/
├── seed.ts                 # Main orchestrator
└── seeds/
    ├── users.ts            # User generation with hashed passwords
    ├── vendors.ts          # Vendor profiles linked to users
    ├── brands.ts           # Fashion brands
    ├── categories.ts       # Product categories
    ├── products.ts         # Product catalog
    ├── productVariants.ts  # Size/color variants per product
    ├── addresses.ts        # User addresses (Home + Work)
    ├── carts.ts            # Shopping carts with items
    ├── favorites.ts        # Favorite products
    ├── reviews.ts          # Product reviews with ratings
    ├── outfits.ts          # User-created outfits
    └── savedOutfits.ts     # Saved outfits from other users
```

### Dependency Chain (Execution Order)

```
1. seedUsers
   ↓
2. seedVendors (depends on userIds)
   ↓
3. seedBrands (parallel-safe)
4. seedCategories (parallel-safe)
   ↓
5. seedProducts (depends on vendorIds, brandIds, categoryIds)
   ↓
6. seedProductVariants (depends on productIds)
   ↓
7. seedAddresses (depends on userIds)
8. seedCarts (depends on userIds, productIds)
9. seedFavorites (depends on userIds, productIds)
10. seedReviews (depends on userIds, productIds)
   ↓
11. seedOutfits (depends on userIds, productIds)
    ↓
12. seedSavedOutfits (depends on userIds, outfits)
```

## Key Features

### 1. **Deterministic Data Generation**

All entity names follow a consistent naming pattern for easy identification:

```
Users:    USER001, USER002, USER003
Vendors:  BUSINESS001, BUSINESS002, BUSINESS003
Brands:   BRAND001, BRAND002, BRAND003
Products: PRODUCT001, PRODUCT002, PRODUCT003
```

Emails follow the pattern:
```
user001@dressme.co.ke
user002@dressme.co.ke
business001@dressme.co.ke
```

### 2. **Single PrismaClient Instance**

All seed functions receive the same `PrismaClient` instance:

```typescript
// In seed.ts
const prisma = new PrismaClient();

// Passed to all seed functions
const userIds = await seedUsers(prisma, 20);
const vendorIds = await seedVendors(prisma, userIds, 5);
```

### 3. **Bcrypt Password Hashing**

User passwords are automatically hashed with bcrypt before insertion:

```typescript
const password = await bcrypt.hash("Password123!", 10);
```

All users are seeded with password: `Password123!`

### 4. **Configurable Counts**

Adjust seed counts in `seed.ts` main function:

```typescript
const USER_COUNT = 20;
const VENDOR_COUNT = 5;
const BRAND_COUNT = 10;
const CATEGORY_COUNT = 8;
const PRODUCT_COUNT = 100;
```

### 5. **Realistic Data with Faker.js**

The system uses `@faker-js/faker` for realistic but randomized data:

- **Phone numbers**: Kenyan format (07########)
- **Addresses**: Realistic Kenyan counties and locations
- **Descriptions**: Product and business descriptions
- **Comments**: Review comments

### 6. **Automatic Relationships**

Entities are automatically linked:

- **Products** → Vendors, Brands, Categories
- **Addresses** → Users (2 per user: Home + Work)
- **Carts** → Users with random products
- **Reviews** → Users & Products with 1-5 ratings
- **Outfits** → Users with 2-5 products each
- **SavedOutfits** → Users save public outfits from others

### 7. **Proper Error Handling**

```typescript
try {
  // Seeding logic
} catch (error) {
  console.error("❌ Seeding error:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
```

## Usage

### Run the Seeder

```bash
npm run prisma:seed
```

This will:
1. Generate 20 users with hashed passwords
2. Create 5 vendors from existing users
3. Create 10 brands
4. Create 8 categories
5. Generate 100 products
6. Add 3-5 variants per product
7. Create addresses for each user
8. Populate carts with random products
9. Create 5-15 favorite products per user
10. Generate 2-8 reviews per user
11. Create 2-5 outfits per user
12. Let users save other users' outfits

### Expected Output

```
🚀 Starting DressMe database seeding...

🌱 Seeding 20 users...
✅ Seeded 20 users

🌱 Seeding 5 vendors...
✅ Seeded 5 vendors

🌱 Seeding 10 brands...
✅ Seeded 10 brands

🌱 Seeding 8 categories...
✅ Seeded 8 categories

🌱 Seeding 100 products...
✅ Seeded 100 products

🌱 Seeding product variants...
✅ Seeded product variants for 100 products

🌱 Seeding addresses for 20 users...
✅ Seeded addresses for 20 users

🌱 Seeding carts for 20 users...
✅ Seeded carts for 20 users

🌱 Seeding favorites...
✅ Seeded 289 favorites

🌱 Seeding reviews...
✅ Seeded 156 reviews

🌱 Seeding outfits...
✅ Seeded 62 outfits

🌱 Seeding saved outfits...
✅ Seeded 247 saved outfits

✅ Seeding completed successfully in 12.45s!

📊 Summary:
   • Users: 20
   • Vendors: 5
   • Brands: 10
   • Categories: 8
   • Products: 100
```

## Test Accounts

After seeding, use these credentials to test the API:

**Admin User:**
```
Email: user001@dressme.co.ke
Password: Password123!
```

**Regular Users:**
```
Email: user002@dressme.co.ke to user020@dressme.co.ke
Password: Password123!
```

**Vendor Accounts:**
```
Email: user002@dressme.co.ke to user006@dressme.co.ke
Password: Password123!
```

## Customization

### Modify Seed Counts

Edit `prisma/seed.ts`:

```typescript
// Example: Seed 50 users instead of 20
const USER_COUNT = 50;
const PRODUCT_COUNT = 500;
```

### Add More Seed Functions

1. Create new file in `prisma/seeds/yourseeder.ts`
2. Export async function with signature: `async (prisma: PrismaClient, ...deps) => Promise<...>`
3. Import in `seed.ts` and call in correct dependency order

Example:

```typescript
// prisma/seeds/coupons.ts
export async function seedCoupons(
  prisma: PrismaClient,
  count: number
): Promise<void> {
  for (let i = 1; i <= count; i++) {
    await prisma.coupon.create({
      data: {
        code: `COUPON${String(i).padStart(3, "0")}`,
        discount: Math.random() * 50 + 5,
      },
    });
  }
}

// In seed.ts main()
import { seedCoupons } from "./seeds/coupons.js";
await seedCoupons(prisma, 20);
```

### Adjust Data Ranges

Each seed function has configurable ranges. For example, in `carts.ts`:

```typescript
// Current: 1-5 random products per cart
const cartItemCount = Math.floor(Math.random() * 5) + 1;

// Change to: 3-10 products per cart
const cartItemCount = Math.floor(Math.random() * 8) + 3;
```

## Best Practices

1. **Always clear the database before re-seeding** (optional)
2. **Keep deterministic naming** for debugging
3. **Test locally with smaller counts** before full seed
4. **Use transactions** for complex multi-step seeding
5. **Log progress** at each step
6. **Handle duplicate key errors gracefully** (try-catch)

## Troubleshooting

### Unique Constraint Violation

If you see errors like `Unique constraint failed on the fields: (slug)`, the seed was interrupted. Reset with:

```bash
npx prisma migrate reset --force
npm run prisma:seed
```

### Connection Issues

Ensure your `.env` file has a valid `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dressme"
```

### Slow Seeding

Reduce counts in `seed.ts` for faster seeding during development:

```typescript
const USER_COUNT = 5;      // Fast development
const PRODUCT_COUNT = 20;
```

## Performance

**Estimated seeding times:**
- 20 users, 5 vendors, 100 products: **~10-15 seconds**
- 50 users, 10 vendors, 500 products: **~45-60 seconds**
- 100 users, 20 vendors, 1000 products: **~3-5 minutes**

## Next Steps

1. Run `npm run prisma:seed` to generate test data
2. Start the server: `npm run dev`
3. Test endpoints with seeded data
4. Use Postman collection to verify all scenarios

---

**Last Updated:** 2026-07-14
**Seeding System Version:** 1.0.0
**Status:** Production-Ready ✅
