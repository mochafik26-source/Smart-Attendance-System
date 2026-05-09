export default async function UpdateState(
  id: number,
  field: string,
  value: any,
) {
  try {
    const res = await fetch("/api/students", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        field,
        value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ DB update failed:", data);
      return;
    }

    console.log("✅ updated:", id, field, value);
    return data;
  } catch (err) {
    console.error("❌ network error:", err);
  }
}
