import dayjs from 'dayjs';

export interface Transaction {
  [key: string]: string | number;
  id: string;
  date: string;
  monthIndex: number;
  amount: number;
  description: string;
}

// https://api.monobank.ua/docs/
export interface MonoTransactionRequest {
  type: string;
  data: {
    account: string;
    statementItem: MonoTransaction;
  };
}

export interface MonoTransaction {
  id: string;
  time: number;
  description: string;
  mcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: number;
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  processed: boolean | null;
}

const toTransactionDate = (date: Date): string => {
  return dayjs(date).format('DD.MM.YYYY');
};

const toTransactionMonthIndex = (date: Date): number => {
  const monthIndex = date.getMonth();
  const leftPadIndex = 2;

  return leftPadIndex + monthIndex;
};

const toPrice = (amount: number): number => {
  return Math.abs(amount / 100);
};

const toDescription = (description: string): string => {
  return `🤖mono: ${description}`;
};

const toDateFromSeconds = (seconds: number): Date => {
  return new Date(seconds * 1000);
};

const parseTransaction = (transaction: MonoTransaction): Transaction => {
  const date = toDateFromSeconds(transaction.time);

  return {
    id: transaction.id,
    monthIndex: toTransactionMonthIndex(date),
    date: toTransactionDate(date),
    amount: toPrice(transaction.amount),
    description: toDescription(transaction.description),
  };
};

const isIncomingTransaction = (transaction: MonoTransaction): boolean => transaction.amount > 0;

export const monoParserService = {
  parseTransaction,
  isIncomingTransaction,
};
