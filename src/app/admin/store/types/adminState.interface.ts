import {
  NewReport,
  Report,
  WalletBalance,
  WalletCommission,
  ExpectedPayment,
} from 'src/app/page/types/page.interface';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';
import { BotStatus } from 'src/app/shared/types/botStatus.interface';
import { EmptyUser } from 'src/app/shared/types/emptyUsersResponse.interface.interface';
import { CommissionType } from '../../shared';
import { OpenPositionData } from 'src/app/shared/types/response.interface';

export interface BotFilter {
  filter_type: string; // 'rsi' | 'bb_l' | 'bb_u'
  operation?: string; // для RSI: '<', '==', '>'
  value: string; // значение для сравнения
  period?: string; // для BB: '1d', '4h', '2h', '1h', '30m', '15m', '5m', '1m'
  length?: string; // для BB: длина от 1 до 144
  pair: string; // пара для фильтра
  data?: string; // дополнительные настройки (для RSI)
}

export interface BotStrategy {
  _id?: string;
  strategyId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  __v?: number;
  minDeposit?: number;
  actualLeverage?: number;
}

export interface StrategyMoneyPolicy {
  strategyId: string;
  minDeposit: number;
  actualLeverage: number;
}

export interface Bot {
  name: string;
  algo: 'long' | 'short';
  pair: string;
  depo_percent: string;
  depo_abs: string;
  isAutoDepoCount: boolean;
  positionmode: string;
  rate_cover: string;
  first_order_indent: string;
  rate_mode: string;
  order_matrix: string;
  part_orders_enabled: boolean;
  part_orders_value: string;
  profit: string;
  cycle_up: string;
  sleep_before_cancel: string;
  sleep_before_up: string;
  sleep_after_done: string;
  logarithmic_scale_for_orders: string;
  logarithmic_factor: string;
  autorestart: string;
  botRefsTags: any[];
  leverage: string;
  id: string;
  _id: string;
  isForStart: boolean;
  start_filters_enabled: boolean;
  filters?: BotFilter[]; // новый массив фильтров
  // старые поля для обратной совместимости
  sf__id_op?: string;
  sf__value?: string;
  sf__data?: string;
  sf__pair?: string;
  orderIndex: number;
  orderIndexInfo: any;
  strategyId: string;
}
export interface Api {
  key: string;
  secret: string;
  name: string;
  market: string;
  rev_id: string;
  isTransferHistoryAvailable?: boolean;
  strategyId?: string;
  botIds: Array<{
    bot_id: string;
    rev_id: string;
  }>;
}

export interface ApiWithEmail extends Api {
  email: string;
  username: string;
  status: BotStatus;
  parentRef: string;
  commissionType: CommissionType;
  expirationDate: number;
  regDate: Date;
  userRole?: import('src/app/shared/types/userRole.enum').UserRole;
  freezePeriod?: number | null;
  canWorkOnCredit?: boolean;
}

export interface UserCommissions {
  email: string;
  username: string;
  commissionType: CommissionType;
}

export interface PrivateCommission {
  percent: number | null;
  absolute: number | null;
}

export interface CommissionApi {
  apiKey: string;
  apiName: string;
  privateCommission: PrivateCommission;
  apiBalance: number;
  userBalance: number;
  balanceForCommissions: number;
  countedCommission: number;
  email: string;
}

export interface CommissionUser {
  privateCommission: PrivateCommission;
  userBalance: number;
  balanceForCommissions: number;
  countedCommission: number;
  email: string;
}

export interface RefPercent {
  email: string;
  refPercent: number | null;
}

export interface RefLevels {
  email: string;
  refLevels: {
    refPercent1: number | null;
    refPercent2: number | null;
    refPercent3: number | null;
  };
}

export interface AllFullBalance {
  email: string;
  balance: number | null;
  refBalance: number | null;
}

export interface OpenPosition {
  symbol: string;
  amount: number;
  size: number;
  entryPrice: number;
  markPrice: number;
  unRealizedProfit: number;
  liquidationPrice: number;
  leverage: number;
  marginType: string;
  side: string;
  updateTime: number;
}

export interface User {
  email: string;
  privateCommission?: {
    percent: number | null;
    absolute: number | null;
  };
  api: Api[];
}

export interface UserInfo {
  email: string;
  username: string | null;
  tgAccount: string | null;
  _id: string | null;
  parentRef: string | null;
  freezePeriod?: number | null;
  canWorkOnCredit?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdminUsersResponse {
  status: boolean;
  data: ApiWithEmail[];
  meta: PaginationMeta;
}

export interface AdminStateInterface {
  users: ApiWithEmail[];
  allUsers: ApiWithEmail[]; // Все пользователи для клиентской пагинации
  usersPaginationMeta: PaginationMeta | null;
  bots: Bot[];
  botStrategies: BotStrategy[];
  settings: BotSettings;
  loaderCount: number;
  isReportsLoading: boolean;
  reports: NewReport[];
  reportsDateRange: {
    fromDate: number | null;
    toDate: number | null;
  };
  emptyUsers: EmptyUser[];
  apiCommissions: CommissionApi[];
  userCommissions: CommissionUser[];
  usersCommissions: UserCommissions[];
  refPercents: RefPercent[];
  refLevels: RefLevels[];
  allFullBalances: AllFullBalance[];
  wallets: WalletBalance[];
  openPositions: OpenPositionData;
  usernames: UserInfo[];
  selectedWalletCommissions: WalletCommission[];
  selectedWalletManualTransactions: WalletCommission[];
  selectedWalletReferralTransactions: WalletCommission[];
  selectedWalletReferralWithdrawals: WalletCommission[];
  selectedWalletPartnerCommissions: WalletCommission[];
  selectedWalletCryptoTransactions: WalletCommission[];
  selectedWalletEmail: string | null;
  // Wallet details
  walletDetails: {
    email: string | null;
    expectedPayments: ExpectedPayment[];
  };
  // New fields for users list and solo reports
  pnlReportsUsers: Array<{ username: string }>;
  soloPnlReports: NewReport[];
  selectedUserEmail: string | null;
  // Promocodes
  promocodes: Promocode[];
  // Partners
  partners: Partner[];
  // Freeze settings
  defaultFreezePeriod: number | null; // Настройка по умолчанию срока заморозки в днях
  // Settings
  commissionTexts: { ru: string; en: string }; // Тексты с информацией о расчете комиссии по языкам
  isCommissionTextLoading: boolean;
  scenes: SceneWithPreview[]; // Сцены воронки с превью изображений
  isScenesLoading: boolean;
  // User commission report
  userCommissionReport: {
    email: string | null;
    reportText: string;
    reportPdfBase64: string;
    reportPdfUrl: string;
    isLoading: boolean;
    error: string | null;
  };
}

export interface Promocode {
  id: string;
  code: string;
  amount: number;
  isReusable: boolean;
  expirationDate?: number;
  usageLimit?: number;
  currentUsage: number;
  referralUser?: string;
  createdAt: number;
  isActive: boolean;
}

export interface PromocodeGenerateRequest {
  amount: number;
  count: number;
  isReusable: boolean;
  expirationDate?: number;
  usageLimit?: number;
  referralUser?: string;
  personalCode?: string;
  tgAccount?: string;
}

// Partner types
export interface PartnerUser {
  email: string;
  username: string | null;
}

export interface Partner {
  id?: number;
  partnerType: 'internal' | 'external';
  email: string;
  username?: string;
  commissionType: string;
  commissionPercent: number;
  selectedUsers: PartnerUser[];
  fixedPayment?: number;
  disableReferralProgram?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePartnerRequest {
  partnerType: 'internal' | 'external';
  email: string;
  username?: string;
  commissionType: string;
  commissionPercent?: number;
  selectedUserEmails?: string[];
  fixedPayment?: number;
  disableReferralProgram?: boolean;
}

export interface UpdatePartnerRequest extends CreatePartnerRequest {
  id: number;
}

export interface PartnersResponse {
  status: boolean;
  data: Partner[];
}

export interface Commission {
  depo_min: number;
  depo_max: number;
  commission_percent: number;
}

// Funnel/Scene types
export interface WelcomeButton {
  text: string;
  targetSceneId: string;
}

export interface ReminderButton {
  text: string;
  action: string;
}

export interface Reminder {
  timer: number;
  text: string;
  imageUrl?: string; // URL изображения на сервере
  buttons: ReminderButton[];
}

export interface Scene {
  sceneId: string;
  welcomeText: string;
  welcomeImageUrl?: string; // URL изображения на сервере
  welcomeButtons: WelcomeButton[];
  reminders: Reminder[];
}

/**
 * Сцена с превью изображений
 */
export interface SceneWithPreview extends Scene {
  welcomeImagePreviewUrl?: string; // URL для превью welcome изображения
  reminderImagePreviewUrls: Map<number, string>; // Map<reminderIndex, previewUrl>
}