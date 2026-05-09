import { db } from "@/app/lib/db.ts";

// GET all students
export async function GET() {
  const students = db.prepare("SELECT * FROM students").all();
  return Response.json(students);
}

// CREATE student
export async function POST(req: Request) {
  const body = await req.json();

  const stmt = db.prepare(`
    INSERT INTO students (name, age, city, status)
    VALUES (?, ?, ?, ?)
    `);

  stmt.run(body.name, body.age, body.city, body.status || "active");

  return Response.json({ ok: true });
}
export async function PUT(req: Request) {
  const { id, field, value } = await req.json();

  console.log("PUT RECEIVED:", { id, field, value });

  const result = db
    .prepare(
      `
    UPDATE students
    SET ${field} = ?
    WHERE id = ?
  `,
    )
    .run(value, id);

  console.log("CHANGED ROWS:", result.changes);

  return Response.json({ ok: true });
}
