let lastUID = null;
let lastTime = 0;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.uid) {
      return Response.json({ error: "No UID" }, { status: 400 });
    }

    const now = Date.now();

    // allow same card again after short delay
    if (data.uid === lastUID && now - lastTime < 800) {
      return Response.json({ ignored: true });
    }

    lastUID = data.uid;
    lastTime = now;

    console.log("📥 RFID:", lastUID);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET() {
  const uid = lastUID;
  lastUID = null; // consume once

  return Response.json({ uid });
}
