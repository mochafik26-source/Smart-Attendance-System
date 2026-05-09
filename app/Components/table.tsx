"use client";

import { useEffect, useState } from "react";
import Badge from "./badge.tsx";
import UpdateState from "../lib/Update.ts";

export default function ColumnResizing() {
  const [students, setStudents] = useState<any[]>([]);
  const [uid, setUid] = useState(null);
  const [lastUid, setLastUid] = useState(null);

  async function loadStudents() {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  }

  async function setLED(value: boolean) {
    await fetch("/api/controle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ led: value }),
    });
  }

  // Load students once
  useEffect(() => {
    loadStudents();
  }, []);

  // Poll RFID
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/sensor");
      const data = await res.json();

      if (data.uid) {
        setUid(data.uid);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Check UID ONLY when it changes
  useEffect(() => {
    if (!uid || students.length === 0) return;

    const scanned = String(uid).trim().toUpperCase();

    // prevent duplicate scans
    if (scanned === lastUid) return;

    setLastUid(scanned);

    const student = students.find(
      (s) => String(s.name).trim().toUpperCase() === scanned,
    );

    if (
      (student && student.status === "waiting") ||
      (student && student.status === "present")
    ) {
      console.log("✅ FOUND:", student.name);
      setLED(true);

      // turn ON LED only when valid
      UpdateState(student.id, "status", "present");
      UpdateState(student.id, "age", 1);
    } else {
      setLED(false);
      console.log("❌ NOT FOUND:", scanned);
      UpdateState(student.id, "age", 0);

      // turn OFF LED if invalid
    }
  }, [uid, students]);

  return (
    <div className="p-4 rounded-xl">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-[#1f1f21]">
            <th className="px-4 py-2">Cef</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Class</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="px-4 py-2">{row.id}</td>
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2">{row.city}</td>
              <td className="px-4 py-2">
                <Badge
                  val={row.status}
                  onChange={(value) => {
                    UpdateState(row.id, "status", value);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
