'use server';

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Fetch asset by serial number
export async function getAssetBySerial(serial: string) {
  const result = await sql`
    SELECT * FROM assets
    WHERE LOWER(serialNumber) = LOWER(${serial})
    LIMIT 1;
  `;
  return result[0] || null;
}

// Register new asset
export async function registerAsset(data: {
  name: string;
  serialNumber: string;
  category: string;
  brand: string;
  series: string;
  screen: string;
  processor: string;
  memory: string;
  storage: string;
}) {
  const {
    name, serialNumber, category, brand,
    series, screen, processor, memory, storage,
  } = data;

  const result = await sql`
    INSERT INTO assets (
      name, serialNumber, category, brand, series,
      screen, processor, memory, storage,
      lastUpdateTime, createdAt
    ) VALUES (
      ${name}, ${serialNumber}, ${category}, ${brand}, ${series},
      ${screen}, ${processor}, ${memory}, ${storage},
      NOW(), NOW()
    )
    RETURNING *;
  `;
  return result[0];
}