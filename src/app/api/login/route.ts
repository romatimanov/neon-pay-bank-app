import { NextRequest, NextResponse } from "next/server";
import { response } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { login, password } = body || {};

  if (login === AUTH_DATA.login) {
    if (password === AUTH_DATA.password) {
      return NextResponse.json(response({ token: AUTH_DATA.token }));
    } else {
      return NextResponse.json(response(null, "Invalid password"));
    }
  }

  return NextResponse.json(response(null, "No such user"));
}
