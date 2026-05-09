let ledState = null;

export async function POST(req) {
  const data = await req.json();
  ledState = data.led;

  return Response.json({ success: true });
}

export async function GET() {
  const response = { led: ledState };

  // reset after sending once
  ledState = null;

  return Response.json(response);
}
