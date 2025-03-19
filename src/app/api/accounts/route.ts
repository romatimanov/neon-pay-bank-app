import { NextRequest, NextResponse } from "next/server";
import { readData, response } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const data = readData();
  const myAccounts = Object.values(data.accounts)
    .filter((account: any) => account.mine)
    .map((account: any) => ({
      ...account,
      transactions: [
        account.transactions[account.transactions.length - 1],
      ].filter(Boolean),
    }));

  return NextResponse.json(response(myAccounts));
}
