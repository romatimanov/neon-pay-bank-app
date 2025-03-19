import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, response } from "@/utils/utils";
import { AUTH_DATA, KNOWN_CURRENCY_CODES } from "@/contstants/server";

function getExchangeRate(data: any, from: string, to: string): number {
  const straightRate = Number(data.exchange[`${from}/${to}`]);
  if (!isNaN(straightRate)) return straightRate;

  const inverseRate = Number(data.exchange[`${to}/${from}`]);
  return inverseRate ? 1 / inverseRate : 1;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Basic ${AUTH_DATA.token}`) {
    return NextResponse.json(response(null, "Unauthorized"), { status: 401 });
  }

  const body = await req.json();
  const { from, to, amount: rawAmount } = body || {};
  const amount = Number(rawAmount);
  const data = readData();
  const myCurrencies = data.mine.currencies || {};

  if (
    !KNOWN_CURRENCY_CODES.includes(from) ||
    !KNOWN_CURRENCY_CODES.includes(to)
  ) {
    return NextResponse.json(response(null, "Unknown currency code"));
  }

  if (isNaN(amount) || amount < 0) {
    return NextResponse.json(response(null, "Invalid amount"));
  }

  const fromCurrency = myCurrencies[from];
  const toCurrency = (myCurrencies[to] = myCurrencies[to] || {
    amount: 0,
    code: to,
  });

  if (
    !fromCurrency ||
    !fromCurrency.amount ||
    fromCurrency.amount - amount < 0
  ) {
    return NextResponse.json(response(null, "Not enough currency"));
  }

  const rate = getExchangeRate(data, from, to);
  fromCurrency.amount -= amount;
  toCurrency.amount += amount * rate;

  writeData(data);

  return NextResponse.json(response(myCurrencies));
}
