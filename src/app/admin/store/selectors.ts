import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AdminStateInterface,
  OpenPosition,
} from './types/adminState.interface';
import { EmptyUsersResponse } from 'src/app/shared/types/emptyUsersResponse.interface.interface';
import { AppStateInterface } from 'src/app/shared/types/appState.interface';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';
import { WalletBalance } from 'src/app/page/types/page.interface';
import { OpenPositionData } from 'src/app/shared/types/response.interface';

export const pageFeatureSelector =
  createFeatureSelector<AdminStateInterface>('admin');

export const usersSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.users
);

export const allUsersSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.allUsers
);

export const usersPaginationMetaSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.usersPaginationMeta
);

export const botsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.bots
);

export const botStrategiesSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.botStrategies
);

export const botSettingsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.settings
);

export const loaderCountAdminSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.loaderCount
);

export const isReportsLoadingSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.isReportsLoading
);

export const commissionsApiSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.apiCommissions
);

export const commissionsUserSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.userCommissions
);

export const usersCommissionsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.usersCommissions
);

export const refPercentsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.refPercents
);

export const refLevelsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.refLevels
);

export const allFullBalancesSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.allFullBalances
);

export const reportsSelector = createSelector(
  pageFeatureSelector,
  (authState: AdminStateInterface) => authState.reports
);

export const reportsDateRangeSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.reportsDateRange
);

export const reportsFromDateSelector = createSelector(
  reportsDateRangeSelector,
  (dateRange) => dateRange.fromDate
);

export const reportsToDateSelector = createSelector(
  reportsDateRangeSelector,
  (dateRange) => dateRange.toDate
);

export const emptyUsersSelector = createSelector(
  pageFeatureSelector,
  (authState: AdminStateInterface) => authState.emptyUsers
);

export const walletsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface): WalletBalance[] => state.wallets
);

export const openPositionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface): OpenPositionData => state.openPositions
);

export const usernamesSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.usernames
);

export const selectedWalletCommissionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletCommissions
);

export const selectedWalletManualTransactionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletManualTransactions
);

export const selectedWalletReferralTransactionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletReferralTransactions
);

export const selectedWalletReferralWithdrawalsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletReferralWithdrawals
);

export const selectedWalletPartnerCommissionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletPartnerCommissions
);

export const selectedWalletCryptoTransactionsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletCryptoTransactions
);

export const selectedWalletEmailSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedWalletEmail
);

// New selectors for PNL reports users and solo reports
export const pnlReportsUsersSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.pnlReportsUsers
);

export const soloPnlReportsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.soloPnlReports
);

export const selectedUserEmailSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.selectedUserEmail
);

export const isLoadingSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.loaderCount > 0
);

export const promocodesSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.promocodes
);

export const walletDetailsSelector = createSelector(
  pageFeatureSelector,
  (state: AdminStateInterface) => state.walletDetails
);

export const walletDetailsExpectedPaymentsSelector = createSelector(
  walletDetailsSelector,
  (walletDetails) => walletDetails.expectedPayments
);

export const walletDetailsEmailSelector = createSelector(
  walletDetailsSelector,
  (walletDetails) => walletDetails.email
);

// Partners selectors
export const partnersSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.partners
);

// Freeze period selectors
export const defaultFreezePeriodSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.defaultFreezePeriod
);

// Settings selectors
export const commissionTextsSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.commissionTexts
);

export const commissionTextSelector = createSelector(
  commissionTextsSelector,
  (texts: { ru: string; en: string }) => texts.ru || '' // По умолчанию возвращаем русский текст
);

export const isCommissionTextLoadingSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.isCommissionTextLoading
);

export const scenesSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.scenes
);

export const isScenesLoadingSelector = createSelector(
  pageFeatureSelector,
  (pageState: AdminStateInterface) => pageState.isScenesLoading
);

// User commission report selectors
export const userCommissionReportSelector = createSelector(
  pageFeatureSelector,
  (adminState: AdminStateInterface) => adminState.userCommissionReport
);

export const userCommissionReportTextSelector = createSelector(
  pageFeatureSelector,
  (adminState: AdminStateInterface) =>
    adminState.userCommissionReport.reportText
);

export const userCommissionReportPdfSelector = createSelector(
  pageFeatureSelector,
  (adminState: AdminStateInterface) => ({
    pdfBase64: adminState.userCommissionReport.reportPdfBase64,
    pdfUrl: adminState.userCommissionReport.reportPdfUrl,
  })
);

export const isUserCommissionReportLoadingSelector = createSelector(
  pageFeatureSelector,
  (adminState: AdminStateInterface) => adminState.userCommissionReport.isLoading
);

export const userCommissionReportErrorSelector = createSelector(
  pageFeatureSelector,
  (adminState: AdminStateInterface) => adminState.userCommissionReport.error
);
