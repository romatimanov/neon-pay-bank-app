import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, response, makeAccount } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const data = readData();
  const newAccount = makeAccount(true);
  data.accounts[newAccount.account] = newAccount;
  writeData(data);

  return NextResponse.json(response(newAccount));
}
