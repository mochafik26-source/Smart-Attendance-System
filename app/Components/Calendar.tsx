"use client";

import React, { useEffect, useState, useRef } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import UpdateState from "../lib/Update.ts";

export default function Calendar() {
  const participants = [
    { name: "1", id: 1 },
    { name: "2", id: 2 },
    { name: "3", id: 3 },
    { name: "4", id: 4 },
  ];

  const passedRef = useRef<string[]>([]);
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

  const [fakeTime, setFakeTime] = useState<Date>(() => {
    const saved = localStorage.getItem("fakeTime");
    return saved ? new Date(saved) : new Date();
  });

  const [events, setEvents] = useState<any[]>([]);

  const [sessionAttendance, setSessionAttendance] = useState<
    Record<number, boolean>
  >({});

  const [students, setStudents] = useState<any[]>([]);

  // ----------------------------
  // FIX: missing persistence helpers
  // ----------------------------
  const PROCESSED_KEY = "processed_events";

  function getProcessed(): Set<number> {
    const raw = localStorage.getItem(PROCESSED_KEY);
    if (!raw) return new Set<number>();
    return new Set(JSON.parse(raw));
  }

  function saveProcessed(set: Set<number>) {
    localStorage.setItem(PROCESSED_KEY, JSON.stringify([...set]));
  }

  async function loadStudents() {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  }

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("fakeTime");
    if (saved) {
      setFakeTime(new Date(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fakeTime", fakeTime.toISOString());
  }, [fakeTime]);

  useEffect(() => {
    if (!calendar || calendar.disposed()) return;

    const saved = localStorage.getItem("events");

    let eventsList;

    if (saved) {
      eventsList = JSON.parse(saved);
    } else {
      eventsList = [
        {
          id: 1,
          text: "PIE",
          start: "2026-04-30T10:00:00",
          end: "2026-04-30T12:00:00",
          tags: {},
        },
        {
          id: 2,
          text: "M110",
          start: "2026-04-30T13:00:00",
          end: "2026-04-30T18:00:00",
          tags: {},
        },
        {
          id: 3,
          text: "M111",
          start: "2026-05-01T08:00:00",
          end: "2026-05-01T12:00:00",
          tags: {},
        },
      ];
    }

    setEvents(eventsList);

    calendar.update({
      startDate: "2026-04-30",
      events: eventsList,
    });
  }, [calendar]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!calendar) return;

      const now = fakeTime;

      for (const event of events) {
        const end = new Date(event.end);
        const isEnded = now > end;

        if (isEnded) {
          const alreadyDone = passedRef.current.includes(event.text);

          if (alreadyDone) continue;

          const res = await fetch("/api/students");
          const dbStudents = await res.json();

          for (const student of dbStudents) {
            if (student.status === "present") {
              await UpdateState(student.id, "status", "waiting");
            } else if (student.status === "waiting" && student.age === 0) {
              await UpdateState(student.id, "status", "Absent");
            }
          }

          passedRef.current.push(event.text);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calendar, events, fakeTime]);

  const onTimeRangeSelected = async (args: any) => {
    const modal = await DayPilot.Modal.prompt("New class:", "Class");

    calendar?.clearSelection();

    if (modal.canceled) return;

    const newEvent = {
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
      tags: {},
    };

    const updated = [...events, newEvent];
    setEvents(updated);

    calendar?.events.add(newEvent);

    setSessionAttendance({});
  };

  const onBeforeEventRender = (args: any) => {
    const now = new DayPilot.Date(fakeTime);
    const start = new DayPilot.Date(args.data.start);
    const end = new DayPilot.Date(args.data.end);

    const active = now >= start && now <= end;

    if (active) {
      args.data.backColor = "#888";
      args.data.fontColor = "#fff";

      if (!args.data.text.startsWith("●")) {
        args.data.text = `● ${args.data.text}`;
      }
    } else {
      args.data.backColor = "#fff";
      args.data.fontColor = "#000";
    }
  };

  const [config] = useState({
    viewType: "Week",
    durationBarVisible: false,
  });

  return (
    <div className="p-2">
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() =>
            setFakeTime((p) => new Date(p.getTime() + 60 * 60 * 1000))
          }
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          +1 Hour
        </button>

        <button
          onClick={() => setFakeTime(new Date())}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          Reset
        </button>

        <button
          onClick={() => setFakeTime(new Date("2026-10-02T11:30:00"))}
          className="px-3 py-1 bg-black text-white rounded"
        >
          Test Overlap
        </button>

        <button
          onClick={() => setFakeTime(new Date("2030-01-01T10:00:00"))}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          No Class Mode
        </button>

        <span className="text-sm text-gray-500 ml-2">
          Fake Time: {fakeTime.toLocaleString()}
        </span>
      </div>

      <DayPilotCalendar
        {...config}
        controlRef={setCalendar}
        onTimeRangeSelected={onTimeRangeSelected}
        onBeforeEventRender={onBeforeEventRender}
      />
    </div>
  );
}
