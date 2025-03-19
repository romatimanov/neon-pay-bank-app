import { NextResponse } from "next/server";
import { response } from "@/utils/utils";
import { BANK_POINTS } from "@/contstants/server";

export function GET() {
  return NextResponse.json(response(BANK_POINTS));
}
