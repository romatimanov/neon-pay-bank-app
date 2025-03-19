import { NextRequest, NextResponse } from "next/server";
import { readData, response } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const { id } = params;
  const data = readData();
  const account = data.accounts[id];

  if (account) {
    return NextResponse.json(response(account));
  }

  return NextResponse.json(response(null, "No such account"));
}
