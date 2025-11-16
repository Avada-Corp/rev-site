import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { CurrentUserApi } from './userInfo.interface';
import { ApiWithEmail } from 'src/app/admin/store/types/adminState.interface';

interface Transfers {
  deposits: number[];
  withdrawals: number[];
}

export interface RefInfo {
  email: string;
  tgUserName: string;
  tgAccount: string;
}

export interface Report {
  start: number;
  to: number;
  transfers: Transfers | null;
  notForTransferCount?: boolean;
  totalBalance: number;
  pnl: number;
  pnlDaily: number;
  username: string;
  keyId: string;
  result?: number;
  apiName: string;
  avalBalance: number;
  tgAccount: string;
  api: Omit<ApiWithEmail, 'name'>;
}

export interface NewReport {
  start: number;
  to: number;
  transfers: Transfers | null;
  totalBalance: number;
  pnl: number;
  pnlDaily: number;
  username: string;
  keyId: string;
  apiName: string;
  tgAccount: string;
  api: Omit<ApiWithEmail, 'name'>;
}

export interface FullReport {
  transfers: number;
  totalBalance: number;
  pnl: number;
  username: string;
  apiName: string;
  pnlDaily: number | null;
  totalDaily: number | null;
  avalBalance: number;
  avalBalanceStart: number;
  totalBalanceStart: number;
  pnlStart: number;
  isTransferHistoryAvailable: boolean;
  total: number;
  tgAccount: string;
  api: Omit<ApiWithEmail, 'name'>;
}

export interface FullPnlReport {
  pnl: number;
  username: string;
  apiName: string;
  pnlDaily: number | null;
  totalDaily: number | null;
  pnlStart: number;
  tgAccount: string;
  api: Omit<ApiWithEmail, 'name'>;
}

export interface PageInterface {
  apiId: string | null;
  isApiCreated: boolean;
  botStatus: BotStatus;
  loaderCount: number;
  userApi: CurrentUserApi[];
  reports: Report[];
  refs: RefInfo[][];
}

export interface WalletCommission {
  email: string;
  tgUserName: string;
  explanation: string;
  isPaid: boolean | null;
  amount: number;
  amountReserved: number;
  date: string;
  explanationData?: any;
  type?: string;
}

export interface Transaction {
  amount: number;
  createdAt: string;
  description: string;
  email: string;
  explanation: string;
  type: string;
  updatedAt: string;
  date: string;
  explanationData?: any;
}

export interface WalletBalance {
  accountBalance: number;
  refBalance: number | null;
  refPotentialBalance: number | null;
  tgAccount?: string | null;
  tgUserName?: string | null;
  email: string | null;
  commissions: WalletCommission[];
  transactions: Transaction[];
}

export interface OpenPosition {
  symbol: string;
  side: string;
  size: number;
  marginSize: number;
  leverage: number;
  unrealizedPL: number;
  liquidationPrice: number;
  markPrice: number;
  openPriceAvg: number;
}

export enum TransactionType {
  COMMISSION = 'commission',
  BALANCE = 'balance',
  REFERRAL_DEPOSIT = 'referralDeposit',
  REFERRAL_WITHDRAWAL = 'referralWithdraw',
  PARTNER_COMMISSION = 'partnerCommission',
  CRYPTO_WALLET = 'cryptoWallet',
}

export interface JsonData {
  email: string;
  endDate: number;
  startDate: number;
  totalCommission: number;
  username: string;
  apis: ApiJson[];
  transfers: number;
  pnl: number;
  unPnl: number;
  earned: number;
  netProfit: number;
}

export interface ApiJson {
  apiName: string;
  resultForPeriod: number;
  commission: number;
  startPnl: number;
  endPnl: number;
  cumulativePnl: number;
  unPnl: number;
  refPaid: Array<{
    amount: number;
    email: string;
    explanation: string;
    username: string;
  }>;
  totalBalance: number;
  totalBalanceStart: number;
  startBalance: number;
  endBalance: number;
  realizedPnl: number;
  explanationData: any;
}

export interface ExpectedPayment {
  email: string;
  isPaid: boolean;
  amount: number;
  explanation: string;
  fromCommission?: string;
  commissionAmount?: number;
  tgUserName?: string;
  commissionExplanation?: string;
  amountReserved?: number;
}
