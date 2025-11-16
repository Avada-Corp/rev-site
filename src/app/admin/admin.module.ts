import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { GetUsersEffect } from './store/effects/users.effect';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { AdminService } from './services/admin.service';
import { BotOptionsCacheService } from './services/bot-options-cache.service';
import { TableModule } from 'primeng/table';
import { BotsComponent } from './pages/bots/bots.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { GetBotsEffect } from './store/effects/bots.effect';
import { GetBotStrategiesEffect } from './store/effects/botStrategies.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateBotEffect } from './store/effects/updateBot.effect';
import { ToastModule } from 'primeng/toast';
import { RemoveBotEffect } from './store/effects/removeBot.effect';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { GetBotSettingsEffect } from './store/effects/botSettings.effect';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SaveAllBotsEffect } from './store/effects/saveAllBots.effect';
import { UpdateBotsByApiEffect } from './store/effects/updateBotsByApi.effect';
import { SharedComponentsModule } from '../shared/shared-components/shared-components.module';
import { ActualizeBotsByApiEffect } from './store/effects/actualizeBotsByApi.effect';
import { ApiTableComponent } from './pages/api-table/api-table.component';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './pages/main/main.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { BotCardComponent } from './components/bot-card/bot-card.component';
import { FilterBotCardComponent } from './components/bot-card/filter-bot-card/filter-bot-card.component';
import { EditUserApiComponent } from './components/edit-user-api/edit-user-api.component';
import { GetReportsEffect } from './store/effects/getReports.effect';
import { ControlApiService } from './services/controlApi.service';
import { ShowEmptyComponent } from './pages/show-empty/show-empty.component';
import { GetEmptyUsersEffect } from './store/effects/getEmptyUsers.effect';
import { UpdateApiPrivateCommissionEffect } from './store/effects/updateApiPrivateCommission.effect';
import { GetCommissionsApiEffect } from './store/effects/getApiCommissions.effect';
import { UpdateCommissionComponent } from './components/update-commission/update-commission.component';
import { GetCommissionsUserEffect } from './store/effects/getUserCommissions.effect';
import { GetUsersCommissionsEffect } from './store/effects/getUsersCommissions.effect';
import { UpdateUserPrivateCommissionEffect } from './store/effects/updateUserPrivateCommission.effect';
import { GetRefPercentEffect } from './store/effects/getRefPercents.effect';
import { UpdateRefPercentEffect } from './store/effects/updateRefPercents.effect';
import { UpdateRefComponent } from './components/update-ref/update-ref.component';
import { UpdateCommissionFrequencyEffect } from './store/effects/updateCommissionFrequency.effect';
import { GetAllFullBalancesEffect } from './store/effects/getAllFullBalances.effect';
import { ActualizeBotsNotStartByApiEffect } from './store/effects/actualizeBotsNotStartByApi.effect';
import { WalletsComponent } from './pages/wallets/wallets.component';
import { GetWalletsEffect } from './store/effects/getWallets.effect';
import { TopUpBalanceEffect } from './store/effects/topUpBalance.effect';
import { WithdrawRefBalanceEffect } from './store/effects/withdrawRefBalance.effect';
import { GetOpenPositionsEffect } from './store/effects/getOpenPositions.effect';
import { ClosePositionEffect } from './store/effects/closePosition.effect';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReportChartComponent } from './components/report-chart/report-chart.component';
import { ChartComponent } from './components/report-chart/chart/chart.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CancelOrderEffect } from './store/effects/cancelOrder.effect';
import { CancelAllOrdersEffect } from './store/effects/cancelAllOrders.effect';
import { GetUsernamesEffect } from './store/effects/getUsernames.effect';
import { UpdateParentRefEffect } from './store/effects/updateParentRef.effect';
import { GetWalletHistoryEffect } from './store/effects/getWalletHistory.effect';
import { GetPnlReportsUsersEffect } from './store/effects/getPnlReportsUsers.effect';
import { GetSoloPnlReportsEffect } from './store/effects/getSoloPnlReports.effect';
import { WalletHistoryModalComponent } from './pages/wallets/wallet-history/wallet-history-modal.component';
import { WalletCommissionsTabComponent } from './pages/wallets/wallet-history/wallet-commissions-tab.component';
import { WalletManualTransactionsTabComponent } from './pages/wallets/wallet-history/wallet-manual-transactions-tab.component';
import { WalletReferralTransactionsTabComponent } from './pages/wallets/wallet-history/wallet-referral-transactions-tab.component';
import { WalletAllTransactionsTabComponent } from './pages/wallets/wallet-history/wallet-all-transactions-tab.component';
import { UsersComponent } from './pages/users/users.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { PromocodesComponent } from './pages/promocodes/promocodes.component';
import { PromoHistoryComponent } from './pages/promo-history/promo-history.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { EditCommissionTextModalComponent } from './components/edit-commission-text-modal/edit-commission-text-modal.component';
import { EditBotStrategyModalComponent } from './components/edit-bot-strategy-modal/edit-bot-strategy-modal.component';
import { EditStrategyMoneyPolicyModalComponent } from './components/edit-strategy-money-policy-modal/edit-strategy-money-policy-modal.component';
import { EditFunnelModalComponent } from './components/edit-funnel-modal/edit-funnel-modal.component';
import { GetPromocodesEffect } from './store/effects/getPromocodes.effect';
import { GeneratePromocodesEffect } from './store/effects/generatePromocodes.effect';
import { DeactivatePromocodeEffect } from './store/effects/deactivatePromocode.effect';
import { ActivatePromocodeEffect } from './store/effects/activatePromocode.effect';
import { DeletePromocodeEffect } from './store/effects/deletePromocode.effect';
import { GetWalletDetailsEffect } from './store/effects/getWalletDetails.effect';
import { PartnersEffect } from './store/effects/partners.effect';
import { SettingsEffect } from './store/effects/settings.effect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BulkActualizeBotsEffect } from './store/effects/bulkActualizeBots.effect';
import { BulkActualizeBotsNotStartEffect } from './store/effects/bulkActualizeBotsNotStart.effect';
import { BulkStartBotsEffect } from './store/effects/bulkStartBots.effect';
import { BulkStopBotsEffect } from './store/effects/bulkStopBots.effect';
import { UpdateUserRoleEffect } from './store/effects/updateUserRole.effect';
import { UpdateDefaultFreezePeriodEffect } from './store/effects/updateDefaultFreezePeriod.effect';
import { GetUserCommissionReportEffect } from './store/effects/getUserCommissionReport.effect';
import { CopyStrategySettingsEffect } from './store/effects/copyStrategySettings.effect';
import { SetApiStrategyEffect } from './store/effects/setApiStrategy.effect';
import { SetApiStrategyModalComponent } from './components/set-api-strategy-modal/set-api-strategy-modal.component';

@NgModule({
  declarations: [
    MainComponent,
    BotCardComponent,
    BotsComponent,
    FilterBotCardComponent,
    EditUserApiComponent,
    ApiTableComponent,
    StatisticsComponent,
    ShowEmptyComponent,
    UpdateCommissionComponent,
    UpdateRefComponent,
    WalletsComponent,
    ReportChartComponent,
    ChartComponent,
    WalletHistoryModalComponent,
    WalletCommissionsTabComponent,
    WalletManualTransactionsTabComponent,
    WalletReferralTransactionsTabComponent,
    WalletAllTransactionsTabComponent,
    UsersComponent,
    PartnersComponent,
    PromocodesComponent,
    PromoHistoryComponent,
    SettingsComponent,
    EditCommissionTextModalComponent,
    EditBotStrategyModalComponent,
    EditStrategyMoneyPolicyModalComponent,
    SetApiStrategyModalComponent,
    EditFunnelModalComponent,
  ],
  imports: [
    SharedComponentsModule,
    CommonModule,
    AdminRoutingModule,
    TableModule,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    MatSelectModule,
    CheckboxModule,
    AccordionModule,
    InputTextModule,
    DragDropModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    RadioButtonModule,
    FormsModule,
    ConfirmDialogModule,
    StoreModule.forFeature('admin', reducers),
    EffectsModule.forFeature([
      GetUsersEffect,
      GetBotsEffect,
      GetBotStrategiesEffect,
      GetBotSettingsEffect,
      GetRefPercentEffect,
      UpdateRefPercentEffect,
      UpdateApiPrivateCommissionEffect,
      UpdateUserPrivateCommissionEffect,
      GetAllFullBalancesEffect,
      GetCommissionsApiEffect,
      GetCommissionsUserEffect,
      GetUsersCommissionsEffect,
      GetWalletsEffect,
      SaveAllBotsEffect,
      UpdateCommissionFrequencyEffect,
      UpdateBotsByApiEffect,
      ActualizeBotsByApiEffect,
      ActualizeBotsNotStartByApiEffect,
      GetEmptyUsersEffect,
      UpdateBotEffect,
      RemoveBotEffect,
      GetReportsEffect,
      TopUpBalanceEffect,
      WithdrawRefBalanceEffect,
      GetOpenPositionsEffect,
      ClosePositionEffect,
      CancelOrderEffect,
      CancelAllOrdersEffect,
      GetUsernamesEffect,
      UpdateParentRefEffect,
      GetWalletHistoryEffect,
      GetPnlReportsUsersEffect,
      GetSoloPnlReportsEffect,
      GetPromocodesEffect,
      GeneratePromocodesEffect,
      DeactivatePromocodeEffect,
      ActivatePromocodeEffect,
      DeletePromocodeEffect,
      GetWalletDetailsEffect,
      PartnersEffect,
      BulkActualizeBotsEffect,
      BulkActualizeBotsNotStartEffect,
      BulkStartBotsEffect,
      BulkStopBotsEffect,
      UpdateUserRoleEffect,
      UpdateDefaultFreezePeriodEffect,
      SettingsEffect,
      GetUserCommissionReportEffect,
      CopyStrategySettingsEffect,
      SetApiStrategyEffect,
    ]),
    TabViewModule,
    ChartModule,
    DialogModule,
    BadgeModule,
    TooltipModule,
    SelectButtonModule,
    InputTextareaModule,
  ],
  providers: [
    AdminService,
    ControlApiService,
    ConfirmationService,
    MessageService,
    BotOptionsCacheService,
  ],
})
export class AdminModule {}
