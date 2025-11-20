import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://postgres:12345@localhost:5432/jago',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, serialnumber, category, brand, series,
      screen, processor, memory, storage
    } = body;

    const result = await pool.query(
      `INSERT INTO assets
        (name, serialNumber, category, brand, series, screen, processor, memory, storage, lastUpdateTime, createdAt)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())
       RETURNING *`,
      [name, serialnumber, category, brand, series, screen, processor, memory, storage]
    );

    return NextResponse.json({ success: true, asset: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Error creating asset' }, { status: 500 });
  }
}
