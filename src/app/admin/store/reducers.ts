import { Action, createReducer, on } from '@ngrx/store';
import {
  getUsersAction,
  getUsersFailureAction,
  getUsersSuccessAction,
} from './actions/users.action';
import {
  getCommissionTextAction,
  getCommissionTextFailureAction,
  getCommissionTextSuccessAction,
  saveCommissionTextAction,
  saveCommissionTextFailureAction,
  saveCommissionTextSuccessAction,
  getScenesAction,
  getScenesFailureAction,
  getScenesSuccessAction,
  saveScenesAction,
  saveScenesFailureAction,
  saveScenesSuccessAction,
  updateSceneAction,
  updateSceneFailureAction,
  updateSceneSuccessAction,
  createSceneAction,
  createSceneFailureAction,
  createSceneSuccessAction,
  deleteSceneAction,
  deleteSceneFailureAction,
  deleteSceneSuccessAction,
} from './actions/settings.actions';
import {
  getUserCommissionReportAction,
  getUserCommissionReportFailureAction,
  getUserCommissionReportSuccessAction,
} from './actions/getUserCommissionReport.action';
import {
  copyStrategySettingsAction,
  copyStrategySettingsSuccessAction,
  copyStrategySettingsFailureAction,
} from './actions/copyStrategySettings.action';
import {
  getBotsAction,
  getBotsSuccessAction,
  getBotsFailureAction,
} from './actions/bots.action';
import {
  getBotStrategiesAction,
  getBotStrategiesSuccessAction,
  getBotStrategiesFailureAction,
  editBotStrategyAction,
  editBotStrategySuccessAction,
  editBotStrategyFailureAction,
} from './actions/botStrategies.action';
import {
  removeBotAction,
  removeBotSuccessAction,
  removeBotFailureAction,
} from './actions/removeBot.action';
import {
  updateBotAction,
  updateBotSuccessAction,
  updateBotFailureAction,
} from './actions/botUpdate.action';
import { AdminStateInterface } from './types/adminState.interface';
import {
  getBotSettingsAction,
  getBotSettingsFailureAction,
  getBotSettingsSuccessAction,
} from './actions/botSettings.action';
import {
  saveAllBotsAction,
  saveAllBotsFailureAction,
  saveAllBotsSuccessAction,
} from './actions/saveAllBots.action';
import {
  getReportsAction,
  getReportsFailureAction,
  getReportsSuccessAction,
  setReportsDateRangeAction,
} from './actions/getReports.action';
import {
  getEmptyUsersAction,
  getEmptyUsersFailureAction,
  getEmptyUsersSuccessAction,
} from './actions/getEmptyUsers.action';
import {
  getApiCommissionAction,
  getApiCommissionSuccessAction,
  getApiCommissionFailureAction,
} from './actions/getApiCommission.action';
import {
  getUserCommissionAction,
  getUserCommissionFailureAction,
  getUserCommissionSuccessAction,
} from './actions/getUserCommission.action';
import {
  getUsersCommissionsAction,
  getUsersCommissionsFailureAction,
  getUsersCommissionsSuccessAction,
} from './actions/getUsersCommissions.action';
import {
  getRefPercentsAction,
  getRefPercentsFailureAction,
  getRefPercentsSuccessAction,
} from './actions/getRefPercents.action';
import {
  updateRefPercentsAction,
  updateRefPercentsFailureAction,
  updateRefPercentsSuccessAction,
} from './actions/updateRefPercents.action';
import {
  updateCommissionFrequencyAction,
  updateCommissionFrequencyFailureAction,
  updateCommissionFrequencySuccessAction,
} from './actions/updateCommissionFrequency.action';
import {
  getAllFullBalancesAction,
  getAllFullBalancesFailureAction,
  getAllFullBalancesSuccessAction,
} from './actions/getAllFullBalances.action';
import {
  getWalletsAction,
  getWalletsFailureAction,
  getWalletsSuccessAction,
} from './actions/getWallets.action';
import {
  getOpenPositionsAction,
  getOpenPositionsFailureAction,
  getOpenPositionsSuccessAction,
} from './actions/getOpenPositions.action';
import {
  getUsernamesAction,
  getUsernamesSuccessAction,
  getUsernamesFailureAction,
} from './actions/getUsernames.action';
import {
  getWalletHistoryAction,
  getWalletHistorySuccessAction,
  getWalletHistoryFailureAction,
} from './actions/getWalletHistory.action';
import {
  getPnlReportsUsersAction,
  getPnlReportsUsersSuccessAction,
  getPnlReportsUsersFailureAction,
} from './actions/getPnlReportsUsers.action';
import {
  getSoloPnlReportsAction,
  getSoloPnlReportsSuccessAction,
  getSoloPnlReportsFailureAction,
} from './actions/getSoloPnlReports.action';
import {
  getPromocodesAction,
  getPromocodesSuccessAction,
  getPromocodesFailureAction,
} from './actions/getPromocodes.action';
import {
  generatePromocodesAction,
  generatePromocodesSuccessAction,
  generatePromocodesFailureAction,
} from './actions/generatePromocodes.action';
import {
  deactivatePromocodeAction,
  deactivatePromocodeSuccessAction,
  deactivatePromocodeFailureAction,
} from './actions/deactivatePromocode.action';
import {
  activatePromocodeAction,
  activatePromocodeSuccessAction,
  activatePromocodeFailureAction,
} from './actions/activatePromocode.action';
import {
  deletePromocodeAction,
  deletePromocodeSuccessAction,
  deletePromocodeFailureAction,
} from './actions/deletePromocode.action';
import {
  getPartnersAction,
  getPartnersSuccessAction,
  getPartnersFailureAction,
  createPartnerSuccessAction,
  updatePartnerSuccessAction,
  deletePartnerSuccessAction,
} from './actions/partners.action';
import { requestCancelledAction } from './actions/requestCancelled.action';
import {
  getWalletDetailsAction,
  getWalletDetailsSuccessAction,
  getWalletDetailsFailureAction,
} from './actions/getWalletDetails.action';
import {
  updateDefaultFreezePeriodAction,
  updateDefaultFreezePeriodSuccessAction,
  updateDefaultFreezePeriodFailureAction,
  getDefaultFreezePeriodAction,
  getDefaultFreezePeriodSuccessAction,
  getDefaultFreezePeriodFailureAction,
} from './actions/updateDefaultFreezePeriod.action';

const initialState: AdminStateInterface = {
  users: [],
  allUsers: [],
  usersPaginationMeta: null,
  bots: [],
  botStrategies: [],
  settings: { matrixes: [], tags: [] },
  reports: [],
  reportsDateRange: {
    fromDate: null,
    toDate: null,
  },
  loaderCount: 0,
  isReportsLoading: false,
  emptyUsers: [],
  apiCommissions: [],
  userCommissions: [],
  usersCommissions: [],
  refPercents: [],
  refLevels: [],
  allFullBalances: [],
  wallets: [],
  openPositions: { positions: [], openOrders: [] },
  usernames: [],
  selectedWalletCommissions: [],
  selectedWalletManualTransactions: [],
  selectedWalletReferralTransactions: [],
  selectedWalletReferralWithdrawals: [],
  selectedWalletPartnerCommissions: [],
  selectedWalletCryptoTransactions: [],
  selectedWalletEmail: null,
  // Wallet details
  walletDetails: {
    email: null,
    expectedPayments: [],
  },
  // New fields for users list and solo reports
  pnlReportsUsers: [],
  soloPnlReports: [],
  selectedUserEmail: null,
  // Promocodes
  promocodes: [],
  // Partners
  partners: [],
  // Freeze settings
  defaultFreezePeriod: null,
  // Settings
  commissionTexts: { ru: '', en: '' },
  isCommissionTextLoading: false,
  scenes: [],
  isScenesLoading: false,
  // User commission report
  userCommissionReport: {
    email: null,
    reportText: '',
    reportPdfBase64: '',
    reportPdfUrl: '',
    isLoading: false,
    error: null,
  },
};

const adminReducer = createReducer(
  initialState,
  on(
    getUsersAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getUsersFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(getUsersSuccessAction, (state, { users, meta }): AdminStateInterface => {
    // Серверная пагинация - используем данные как есть
    return {
      ...state,
      users,
      allUsers: [], // Больше не нужно хранить всех пользователей
      usersPaginationMeta: meta,
      loaderCount: state.loaderCount - 1,
    };
  }),

  on(
    getBotsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getBotsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getBotStrategiesAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getBotStrategiesSuccessAction,
    (state, { botStrategies }): AdminStateInterface => ({
      ...state,
      botStrategies,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getBotStrategiesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    editBotStrategyAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    editBotStrategySuccessAction,
    (state, { strategy }): AdminStateInterface => ({
      ...state,
      botStrategies: state.botStrategies.map((s) =>
        s.strategyId === strategy.strategyId ? strategy : s
      ),
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    editBotStrategyFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getBotsSuccessAction,
    (state, { bots }): AdminStateInterface => ({
      ...state,
      bots,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    removeBotAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    removeBotSuccessAction,
    (state, { bots }): AdminStateInterface => ({
      ...state,
      bots,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    removeBotFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    updateBotAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    updateBotSuccessAction,
    (state, { bots }): AdminStateInterface => ({
      ...state,
      bots,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    updateBotFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getBotSettingsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getBotSettingsSuccessAction,
    (state, { settings }): AdminStateInterface => ({
      ...state,
      settings,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getBotSettingsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    saveAllBotsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    saveAllBotsSuccessAction,
    (state, { bots }): AdminStateInterface => ({
      ...state,
      bots,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    saveAllBotsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getReportsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
      isReportsLoading: true,
    })
  ),
  on(
    getReportsSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      reports: request.reports,
      loaderCount: state.loaderCount - 1,
      isReportsLoading: false,
    })
  ),
  on(
    getReportsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      isReportsLoading: false,
    })
  ),
  on(
    setReportsDateRangeAction,
    (state, { fromDate, toDate }): AdminStateInterface => ({
      ...state,
      reportsDateRange: {
        fromDate,
        toDate,
      },
    })
  ),

  on(
    getEmptyUsersAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getEmptyUsersSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      emptyUsers: request.users,
    })
  ),
  on(
    getEmptyUsersFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getApiCommissionAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getApiCommissionSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      apiCommissions: request.commissions,
    })
  ),
  on(
    getApiCommissionFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getUserCommissionAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getUserCommissionSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      userCommissions: request.commissions,
    })
  ),
  on(
    getUserCommissionFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getUsersCommissionsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getUsersCommissionsSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      usersCommissions: request.usersCommissions,
    })
  ),
  on(
    getUsersCommissionsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getRefPercentsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getRefPercentsSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      refLevels: request.refLevels,
    })
  ),
  on(
    getRefPercentsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    updateRefPercentsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    updateRefPercentsSuccessAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    updateRefPercentsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getWalletsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getWalletsSuccessAction,
    (state, request): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      wallets: request.wallets,
    })
  ),
  on(
    getWalletsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getAllFullBalancesAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getAllFullBalancesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getAllFullBalancesSuccessAction,
    (state, { balances }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      allFullBalances: balances,
    })
  ),

  on(
    updateCommissionFrequencyAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    updateCommissionFrequencySuccessAction,
    (state, { email, commissionType }): AdminStateInterface => {
      const newUsers = state.users.map((u) =>
        u.email === email
          ? {
              ...u,
              commissionType,
            }
          : u
      );

      return {
        ...state,
        loaderCount: state.loaderCount - 1,
        users: newUsers,
      };
    }
  ),
  on(
    updateCommissionFrequencyFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getOpenPositionsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getOpenPositionsSuccessAction,
    (state, { positions }): AdminStateInterface => ({
      ...state,
      openPositions: positions,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getOpenPositionsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getUsernamesAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getUsernamesSuccessAction,
    (state, { usernames }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      usernames,
    })
  ),
  on(
    getUsernamesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getWalletHistoryAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getWalletHistorySuccessAction,
    (
      state,
      {
        walletCommissions,
        walletManualTransactions,
        walletReferralTransactions,
        walletReferralWithdrawals,
        walletPartnerCommissions,
        walletCryptoTransactions,
        email,
      }
    ): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      selectedWalletCommissions: walletCommissions,
      selectedWalletManualTransactions: walletManualTransactions,
      selectedWalletReferralTransactions: walletReferralTransactions,
      selectedWalletReferralWithdrawals: walletReferralWithdrawals,
      selectedWalletPartnerCommissions: walletPartnerCommissions,
      selectedWalletCryptoTransactions: walletCryptoTransactions || [],
      selectedWalletEmail: email,
    })
  ),
  on(
    getWalletHistoryFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // New reducers for PNL reports users
  on(
    getPnlReportsUsersAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getPnlReportsUsersSuccessAction,
    (state, { users }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      pnlReportsUsers: users,
    })
  ),
  on(
    getPnlReportsUsersFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // New reducers for solo PNL reports
  on(
    getSoloPnlReportsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getSoloPnlReportsSuccessAction,
    (state, { reports, email }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      soloPnlReports: reports,
      selectedUserEmail: email,
    })
  ),
  on(
    getSoloPnlReportsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // Promocodes reducers
  on(
    getPromocodesAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getPromocodesSuccessAction,
    (state, { promocodes }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      promocodes,
    })
  ),
  on(
    getPromocodesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    generatePromocodesAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    generatePromocodesSuccessAction,
    (state, { promocodes }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      promocodes: [...promocodes, ...state.promocodes],
    })
  ),
  on(
    generatePromocodesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    deactivatePromocodeAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    deactivatePromocodeSuccessAction,
    (state, { promocodeId }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      promocodes: state.promocodes.map((promocode) =>
        promocode.id === promocodeId
          ? { ...promocode, isActive: false }
          : promocode
      ),
    })
  ),
  on(
    deactivatePromocodeFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    activatePromocodeAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    activatePromocodeSuccessAction,
    (state, { promocodeId }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      promocodes: state.promocodes.map((promocode) =>
        promocode.id === promocodeId
          ? { ...promocode, isActive: true }
          : promocode
      ),
    })
  ),
  on(
    activatePromocodeFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    deletePromocodeAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    deletePromocodeSuccessAction,
    (state, { promocodeId }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      promocodes: state.promocodes.filter(
        (promocode) => promocode.id !== promocodeId
      ),
    })
  ),
  on(
    deletePromocodeFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // Обработка отменённых запросов
  on(
    requestCancelledAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: Math.max(0, state.loaderCount - 1), // Не даём счетчику уйти в минус
    })
  ),

  // Partners reducers
  on(
    getPartnersAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),

  on(
    getPartnersSuccessAction,
    (state, action): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      partners: action.partners,
    })
  ),

  on(
    getPartnersFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    createPartnerSuccessAction,
    (state, action): AdminStateInterface => ({
      ...state,
      partners: [...state.partners, action.partner],
    })
  ),

  on(
    updatePartnerSuccessAction,
    (state, action): AdminStateInterface => ({
      ...state,
      partners: state.partners.map((partner) =>
        partner.id === action.partner.id ? action.partner : partner
      ),
    })
  ),

  on(
    deletePartnerSuccessAction,
    (state, action): AdminStateInterface => ({
      ...state,
      partners: state.partners.filter(
        (partner) => partner.id !== action.partnerId
      ),
    })
  ),

  // Wallet details actions
  on(
    getWalletDetailsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getWalletDetailsSuccessAction,
    (state, { email, expectedPayments }): AdminStateInterface => ({
      ...state,
      walletDetails: {
        email,
        expectedPayments,
      },
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getWalletDetailsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // Freeze period reducers
  on(
    updateDefaultFreezePeriodAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    updateDefaultFreezePeriodSuccessAction,
    (state, { freezePeriod }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      defaultFreezePeriod: freezePeriod,
    })
  ),
  on(
    updateDefaultFreezePeriodFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getDefaultFreezePeriodAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getDefaultFreezePeriodSuccessAction,
    (state, { freezePeriod }): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      defaultFreezePeriod: freezePeriod,
    })
  ),
  on(
    getDefaultFreezePeriodFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // Settings reducers
  on(
    getCommissionTextAction,
    (state): AdminStateInterface => ({
      ...state,
      isCommissionTextLoading: true,
    })
  ),
  on(
    getCommissionTextSuccessAction,
    (state, { texts }): AdminStateInterface => ({
      ...state,
      commissionTexts: texts,
      isCommissionTextLoading: false,
    })
  ),
  on(
    getCommissionTextFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isCommissionTextLoading: false,
    })
  ),
  on(
    saveCommissionTextAction,
    (state, { lang }): AdminStateInterface => ({
      ...state,
      isCommissionTextLoading: true,
    })
  ),
  on(
    saveCommissionTextSuccessAction,
    (state, { texts }): AdminStateInterface => ({
      ...state,
      commissionTexts: texts,
      isCommissionTextLoading: false,
    })
  ),
  on(
    saveCommissionTextFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isCommissionTextLoading: false,
    })
  ),

  // User commission report reducers
  on(
    getUserCommissionReportAction,
    (state, { email }): AdminStateInterface => ({
      ...state,
      userCommissionReport: {
        ...state.userCommissionReport,
        email,
        isLoading: true,
        error: null,
      },
    })
  ),
  on(
    getUserCommissionReportSuccessAction,
    (state, { email, reportData }): AdminStateInterface => ({
      ...state,
      userCommissionReport: {
        email,
        reportText: reportData.text || '',
        reportPdfBase64: reportData.pdfBase64 || '',
        reportPdfUrl: reportData.pdfUrl || '',
        isLoading: false,
        error: null,
      },
    })
  ),
  on(
    getUserCommissionReportFailureAction,
    (state, { errors }): AdminStateInterface => ({
      ...state,
      userCommissionReport: {
        ...state.userCommissionReport,
        isLoading: false,
        error:
          errors.length > 0
            ? errors[0]
            : 'Произошла ошибка при загрузке отчета',
      },
    })
  ),

  // Copy strategy settings reducers
  on(
    copyStrategySettingsAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    copyStrategySettingsSuccessAction,
    (state, { bots }): AdminStateInterface => ({
      ...state,
      bots,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    copyStrategySettingsFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  // Scenes reducers
  on(
    getScenesAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: true,
    })
  ),
  on(
    getScenesSuccessAction,
    (state, { scenes }): AdminStateInterface => ({
      ...state,
      scenes,
      isScenesLoading: false,
    })
  ),
  on(
    getScenesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: false,
    })
  ),
  on(
    saveScenesAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: true,
    })
  ),
  on(
    saveScenesSuccessAction,
    (state, { scenes }): AdminStateInterface => ({
      ...state,
      scenes,
      isScenesLoading: false,
    })
  ),
  on(
    saveScenesFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: false,
    })
  ),

  // Update scene reducers
  on(
    updateSceneAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: true,
    })
  ),
  on(
    updateSceneSuccessAction,
    (state, { scene }): AdminStateInterface => ({
      ...state,
      scenes: state.scenes.map((s) =>
        s.sceneId === scene.sceneId ? scene : s
      ),
      isScenesLoading: false,
    })
  ),
  on(
    updateSceneFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: false,
    })
  ),

  // Create scene reducers
  on(
    createSceneAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: true,
    })
  ),
  on(
    createSceneSuccessAction,
    (state, { scene }): AdminStateInterface => ({
      ...state,
      scenes: [...state.scenes, scene],
      isScenesLoading: false,
    })
  ),
  on(
    createSceneFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: false,
    })
  ),

  // Delete scene reducers
  on(
    deleteSceneAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: true,
    })
  ),
  on(
    deleteSceneSuccessAction,
    (state, { sceneId }): AdminStateInterface => ({
      ...state,
      scenes: state.scenes.filter((s) => s.sceneId !== sceneId),
      isScenesLoading: false,
    })
  ),
  on(
    deleteSceneFailureAction,
    (state): AdminStateInterface => ({
      ...state,
      isScenesLoading: false,
    })
  )
);
export function reducers(state: AdminStateInterface, action: Action) {
  return adminReducer(state, action);
}
