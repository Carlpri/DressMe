import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://dressme_baseline_admin@localhost:55432/dressme_canonical_baseline",
});

async function main() {
  await client.connect();
  console.log("Connected to dressme_canonical_baseline");

  // 1. Check tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log("\n=== Tables ===");
  console.log(tablesRes.rows.map(r => r.table_name).join(", "));

  // 2. Check enums
  const enumsRes = await client.query(`
    SELECT t.typname AS enum_name, string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS values
    FROM pg_type t 
    JOIN pg_enum e ON e.enumtypid = t.oid 
    JOIN pg_namespace n ON n.oid = t.typnamespace 
    WHERE n.nspname = 'public' 
    GROUP BY t.typname 
    ORDER BY t.typname;
  `);
  console.log("\n=== Enums ===");
  for (const row of enumsRes.rows) {
    console.log(`${row.enum_name}: [${row.values}]`);
  }

  // 3. Check obsolete columns
  const obsoleteColsRes = await client.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND (
      (table_name = 'Vendor' AND column_name IN ('shopName', 'phone', 'verified')) OR
      (table_name = 'Product' AND column_name = 'categoryId') OR
      (table_name = 'ProductVariant' AND column_name IN ('size', 'color'))
    );
  `);
  console.log("\n=== Obsolete Columns Found (Should be 0) ===");
  console.log(obsoleteColsRes.rows);

  // 4. Check ProductVariant columns and nullability / defaults
  const pvColsRes = await client.query(`
    SELECT column_name, is_nullable, column_default, data_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'ProductVariant'
    ORDER BY column_name;
  `);
  console.log("\n=== ProductVariant Columns ===");
  console.table(pvColsRes.rows);

  // 5. Check ProductCategory primary key and columns
  const pcColsRes = await client.query(`
    SELECT column_name, is_nullable, column_default, data_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'ProductCategory'
    ORDER BY column_name;
  `);
  console.log("\n=== ProductCategory Columns ===");
  console.table(pcColsRes.rows);

  // 6. Check Foreign Keys on ProductVariant & ProductCategory
  const fkRes = await client.query(`
    SELECT
      tc.table_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      rc.delete_rule,
      rc.update_rule
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON rc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('ProductVariant', 'ProductCategory')
    ORDER BY tc.table_name, kcu.column_name;
  `);
  console.log("\n=== Foreign Keys (ProductVariant & ProductCategory) ===");
  console.table(fkRes.rows);

  // 7. Check Indexes on ProductVariant & ProductCategory
  const idxRes = await client.query(`
    SELECT
      tablename,
      indexname,
      indexdef
    FROM pg_indexes
    WHERE schemaname = 'public' AND tablename IN ('ProductVariant', 'ProductCategory')
    ORDER BY tablename, indexname;
  `);
  console.log("\n=== Indexes (ProductVariant & ProductCategory) ===");
  console.table(idxRes.rows);

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
