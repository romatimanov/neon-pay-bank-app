import { NextRequest, NextResponse } from "next/server";
import { readData, response } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const data = readData();
  const myCurrencies = data.mine.currencies || {};

  return NextResponse.json(response(myCurrencies));
}
