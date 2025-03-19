import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, response, makeAccount } from "@/utils/utils";
import { AUTH_DATA } from "@/contstants/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const body = await req.json();
  const { from, to, amount: rawAmount } = body || {};
  const amount = Number(rawAmount);
  const data = readData();

  const fromAccount = data.accounts[from];
  let toAccount = data.accounts[to];

  if (!fromAccount || !fromAccount.mine) {
    return NextResponse.json(response(null, "Invalid account from"));
  }

  if (!toAccount) {
    if (Math.random() < 0.25) {
      toAccount = makeAccount(false, to);
      data.accounts[to] = toAccount;
    } else {
      return NextResponse.json(response(null, "Invalid account to"));
    }
  }

  if (isNaN(amount) || amount < 0) {
    return NextResponse.json(response(null, "Invalid amount"));
  }

  if (fromAccount.balance - amount < 0) {
    return NextResponse.json(response(null, "Overdraft prevented"));
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const transactionTime = new Date().toISOString();
  fromAccount.transactions.push({
    date: transactionTime,
    from: fromAccount.account,
    to: toAccount.account,
    amount,
  });
  toAccount.transactions.push({
    date: transactionTime,
    from: fromAccount.account,
    to: toAccount.account,
    amount,
  });

  writeData(data);

  return NextResponse.json(response(fromAccount));
}
