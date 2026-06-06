import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT id, parent_id, title, phase, status, week, sort_order, created_at FROM v1 ORDER BY phase, parent_id NULLS FIRST, sort_order`
    );
    return NextResponse.json(rows);
  } finally {
    client.release();
  }
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const client = await pool.connect();
  try {
    await client.query(`UPDATE v1 SET status = $1 WHERE id = $2`, [status, id]);
    return NextResponse.json({ ok: true });
  } finally {
    client.release();
  }
}
