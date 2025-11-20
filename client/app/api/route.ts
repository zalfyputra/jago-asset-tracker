import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://postgres:12345@localhost:5432/jago'
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serial = searchParams.get('serial');

  if (!serial) return NextResponse.json({ error: 'No serial number provided' }, { status: 400 });

  const result = await pool.query('SELECT * FROM assets WHERE serialNumber = $1', [serial]);

  if (result.rows.length > 0) {
    return NextResponse.json({ asset: result.rows[0] });
  } else {
    return NextResponse.json({ asset: null });
  }
}