import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  validateCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "");
    const password = String(body.password || "");

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
