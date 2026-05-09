"use client";
import Image from "next/image";
import ColumnResizing from "./Components/table.tsx";
import Calendar from "./Components/Calendar.tsx";
import { useState, useEffect } from "react";
export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMsg(event.data);
      console.log(event.data);
    };

    return () => ws.close();
  }, []);
  return (
    <section className="w-full h-[300vh] flex justify-center items-center flex-col">
      <div className="w-full  m-4 rounded-xl bg-[#232325]">
        <ColumnResizing></ColumnResizing>
      </div>
      <Calendar />
    </section>
  );
}
