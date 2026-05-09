import Database from "better-sqlite3";

export const db = new Database("students.db");

db.exec(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    city TEXT,
    status TEXT
)
`);

// 🔍 check if table already has data
const count = db.prepare(`SELECT COUNT(*) as c FROM students`).get();

if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO students (name, age, city, status)
    VALUES (?, ?, ?, ?)
  `);

  const students = [
    ["83923DAD", 1, "Ousamma slimani", "waiting"],
    ["03AE7B35", 1, "Mohamed Bensghir", "waiting"],
    ["043F8CA28F1890", 1, "Mohamed Chafik", "waiting"],
  ];

  for (const s of students) {
    insert.run(...s);
  }

  console.log("Database seeded!");
} else {
  console.log("⚠️ Database already seeded, skipping...");
}
