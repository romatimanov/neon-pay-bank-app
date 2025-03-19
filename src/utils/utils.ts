import fs from "fs";
import path from "path";

// Путь к хранилищу данных
const DATA_PATH = path.join(process.cwd(), "storage", "data.json");

// Форматированный ответ
export function response(data: any = null, error: string | null = null) {
  return { data, error };
}

// Чтение данных из файла
export function readData(): any {
  if (!fs.existsSync(DATA_PATH)) {
    return { accounts: {}, mine: { currencies: {} }, exchange: {} };
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// Запись данных в файл
export function writeData(data: any): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 4), "utf-8");
}

// Генерация ID аккаунта (26 цифр)
export function generateAccountId(): string {
  return Array(26)
    .fill(0)
    .map(() => Math.floor(Math.random() * 9))
    .join("");
}

// Форматирование числа до 2 знаков
export function formatAmount(number: number): number {
  return Number(number.toFixed(2));
}

// Создание аккаунта
export function makeAccount(mine: boolean = false, id?: string) {
  return {
    account: id || generateAccountId(),
    mine,
    balance: 0,
    transactions: [],
  };
}

// Предсоздание аккаунтов
export function premakeAccounts(
  data: any,
  accountList: string[],
  mine: boolean = false
): void {
  const accounts = data.accounts;
  accountList.forEach((id) => {
    if (!accounts[id]) {
      accounts[id] = makeAccount(mine, id);
    }
  });
  writeData(data);
}

// Предсоздание валют
export function pregenerateMineCurrencies(data: any, codes: string[]): void {
  data.mine = data.mine || {};
  data.mine.currencies = data.mine.currencies || {};

  codes.forEach((code) => {
    if (!data.mine.currencies[code]) {
      data.mine.currencies[code] = {
        amount: Math.random() * 100,
        code,
      };
    }
  });

  writeData(data);
}

// Предсоздание истории транзакций
export function pregenerateHistory(
  data: any,
  accounts: string[],
  mine: boolean = false
): void {
  premakeAccounts(data, accounts, mine);

  const months = 10;
  const transactionsPerMonth = 5;
  const dayMs = 24 * 60 * 60 * 1000;
  const monthMs = 30 * dayMs;
  const yearMs = 12 * monthMs;

  accounts.forEach((accountId) => {
    const account = data.accounts[accountId];
    if (
      !account ||
      account.transactions.length >= months * transactionsPerMonth
    )
      return;

    let date = Date.now() - yearMs;

    for (let month = 0; month <= months; month++) {
      for (let i = 0; i <= transactionsPerMonth; i++) {
        const sign = Math.random() < 0.5 ? 1 : -1;
        const amount = formatAmount(Math.random() * 10000);
        const otherAccountId = generateAccountId();
        const offset = (Math.random() - 0.5) * Math.random() * 5 * dayMs;

        account.transactions.push({
          date: new Date(date + offset).toISOString(),
          from: sign < 0 ? accountId : otherAccountId,
          to: sign > 0 ? accountId : otherAccountId,
          amount,
        });
      }
      date += monthMs;
    }
  });

  writeData(data);
}

// Установка курса обмена
export function setExchangeRate(
  data: any,
  currency1: string,
  currency2: string,
  rate: number
): void {
  const inverseKey = `${currency2}/${currency1}`;
  const directKey = `${currency1}/${currency2}`;

  if (data.exchange[inverseKey]) {
    data.exchange[inverseKey] = formatAmount(1 / rate);
  } else {
    data.exchange[directKey] = rate;
  }
}

// Получение курса обмена
export function getExchangeRate(
  data: any,
  currency1: string,
  currency2: string
): number {
  const straight = Number(data.exchange[`${currency1}/${currency2}`]);
  if (!isNaN(straight)) return straight;

  const inverse = Number(data.exchange[`${currency2}/${currency1}`]);
  return inverse ? 1 / inverse : 0;
}
