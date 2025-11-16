export interface GetterResponseInterface<T> {
  errors: string[];
  messages: string[];
  status: boolean;
  data: T;
}

type ExchangeNumber = number | string;

export interface OpenOrder {
  symbol: string;
  price: number | string;
  side: Side;
  amount: number | string;
  leverage: number | string;
  orderId: string;
}

export enum Side {
  Long = 'long',
  Short = 'short',
}

export interface Position {
  symbol: string;
  side: Side;
  size: ExchangeNumber;
  marginSize: ExchangeNumber;
  leverage: ExchangeNumber;
  unrealizedPL: ExchangeNumber;
  liquidationPrice: ExchangeNumber;
  markPrice: ExchangeNumber;
  openPriceAvg: ExchangeNumber;
}

export type OpenPositionData = {
  positions: Position[];
  openOrders: OpenOrder[];
};
