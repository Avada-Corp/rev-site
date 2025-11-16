import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  GetterResponseInterface,
  OpenOrder,
  OpenPositionData,
  Position,
} from 'src/app/shared/types/response.interface';
import {
  AdminUsersResponse,
  AllFullBalance,
  ApiWithEmail,
  Bot,
  BotStrategy,
  CommissionApi,
  CommissionUser,
  OpenPosition,
  RefLevels,
  StrategyMoneyPolicy,
  User,
  UserCommissions,
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnersResponse,
  Scene,
} from '../store/types/adminState.interface';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { of } from 'rxjs';
import { CommissionType } from '../shared';
import { UserRole } from 'src/app/shared/types/userRole.enum';

@Injectable()
export class AdminService {
  constructor(
    private http: HttpClient,
    private persistanceService: PersistanceService
  ) {}

  getHeaders() {
    const token = this.persistanceService.get('accessToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  getUsers(email: string, page?: number, limit?: number) {
    const url = environment.apiUrl + '/admin/users';
    const data = { email, page, limit };
    return this.http.post<AdminUsersResponse>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getBots() {
    const url = environment.apiUrl + '/admin/bots';
    return this.http.get<GetterResponseInterface<Bot[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getBotStrategies() {
    const url = environment.apiUrl + '/admin/botStrategies';
    return this.http.get<GetterResponseInterface<BotStrategy[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  editBotStrategy(data: {
    strategyId: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    minDeposit?: number;
    actualLeverage?: number;
  }) {
    const url = environment.apiUrl + '/admin/botStrategy/edit';
    return this.http.post<GetterResponseInterface<BotStrategy>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getAllFullBalances() {
    const url = environment.apiUrl + '/admin/getAllFullBalances';
    console.log('url: ', url);
    return of({
      errors: [],
      messages: [],
      status: true,
      data: [],
    });
    // return this.http.get<GetterResponseInterface<AllFullBalance[]>>(url, {
    //   headers: this.getHeaders(),
    // });
  }

  getBotSettings() {
    const url = environment.apiUrl + '/admin/botSettingsInfo';
    return this.http.get<GetterResponseInterface<BotSettings>>(url, {
      headers: this.getHeaders(),
    });
  }

  updateBot(email: string, botSettings: Partial<Bot>) {
    const url = environment.apiUrl + '/admin/bots/' + botSettings.id;
    const data = { email, botSettings };
    return this.http.patch<GetterResponseInterface<Bot[]>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  removeBot(email: string, id: string) {
    const url = environment.apiUrl + '/admin/bots/' + id;
    return this.http.delete<GetterResponseInterface<Bot[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  saveAllBots(email: string, bots: Bot[]) {
    const url = environment.apiUrl + '/admin/saveBots';
    const data = { email, botArray: bots };
    return this.http.post<GetterResponseInterface<Bot[]>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updateBotByApi(email: string, apiId: string) {
    const url = environment.apiUrl + '/admin/updateBots';
    const data = { email, apiId };
    return this.http.post<GetterResponseInterface<number>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  actualizeBotByApi(email: string, apiId: string, apiName: string) {
    const url = environment.actualizeUrl + '/start';
    const data = { apiId, apiName, email };
    return this.http.post<GetterResponseInterface<number>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  actualizeBotNotStartByApi(email: string, apiId: string, apiName: string) {
    const url = environment.actualizeUrl + '/startNotStartedBots';
    const data = { apiId, apiName, email };
    return this.http.post<GetterResponseInterface<number>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  // Bulk operations
  bulkActualizeBots(
    apiKeys: Array<{
      apiId: string;
      email: string;
      username: string;
      apiName: string;
    }>
  ) {
    const url = environment.actualizeUrl + '/bulk/actualizeBots';
    console.log('url: ', url);
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  bulkActualizeBotsNotStart(
    apiKeys: Array<{
      apiId: string;
      email: string;
      username: string;
      apiName: string;
    }>
  ) {
    const url = environment.actualizeUrl + '/bulk/actualizeBotsNotStart';
    console.log('url: ', url);
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  bulkUpdateBots(apiKeys: Array<{ email: string; apiId: string }>) {
    const url = environment.apiUrl + '/admin/bulk/updateBots';
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  bulkStartBots(apiKeys: Array<{ email: string; apiId: string }>) {
    const url = environment.apiUrl + '/admin/bulk/startBots';
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  bulkStopBots(apiKeys: Array<{ email: string; apiId: string }>) {
    const url = environment.apiUrl + '/admin/bulk/stopBots';
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  bulkFullStopBots(apiKeys: Array<{ email: string; apiId: string }>) {
    const url = environment.apiUrl + '/admin/bulk/fullStopBots';
    const data = { apiKeys };
    return this.http.post<
      GetterResponseInterface<{ processedCount: number; totalCount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  updatePrivateApiCommission(
    apiKey: string,
    percent: number | null,
    absolute: number | null
  ) {
    const url = environment.apiUrl + '/admin/updateApiPrivateCommission';
    const data = { apiKey, percent, absolute };
    return this.http.post<GetterResponseInterface<User>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updatePrivateUserCommission(
    email: string,
    percent: number | null,
    absolute: number | null
  ) {
    const url = environment.apiUrl + '/admin/updateUserPrivateCommission';
    const data = { email, percent, absolute };
    return this.http.post<GetterResponseInterface<User>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updateRefPercents(
    email: string,
    {
      refPercent1 = null,
      refPercent2 = null,
      refPercent3 = null,
    }: {
      refPercent1: number | null;
      refPercent2: number | null;
      refPercent3: number | null;
    }
  ) {
    const url = environment.apiUrl + '/admin/updateUserRefPercents';
    const data = { email, refPercent1, refPercent2, refPercent3 };
    return this.http.post<GetterResponseInterface<User>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getCommissionsApi() {
    const url = environment.apiUrl + '/api/getApiCommissions';
    return this.http.get<GetterResponseInterface<CommissionApi[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getRefPercents() {
    const url = environment.apiUrl + '/api/getUserRefPercents';
    return this.http.get<GetterResponseInterface<RefLevels[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getCommissionsUser(to: number) {
    const url = environment.apiUrl + '/api/getAllUsersCommissions/' + to;
    return this.http.get<GetterResponseInterface<CommissionUser[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getUsersCommissions() {
    const url = environment.apiUrl + '/admin/getUsersCommissions';
    return this.http.get<GetterResponseInterface<UserCommissions[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  updateCommissionFrequency({
    email,
    commissionType,
  }: {
    email: string;
    commissionType: CommissionType;
  }) {
    const data = {
      email,
      commissionType,
    };
    const url = environment.apiUrl + '/admin/updateCommissionFrequency';
    return this.http.post<GetterResponseInterface<User>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  sendPersonalMessage(email: string, message: string) {
    const url = environment.apiUrl + '/admin/sendPersonalMessage';
    const data = { email, message };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  sendPersonalMessagesBulk(users: string[], message: string) {
    const url = environment.apiUrl + '/admin/sendPersonalMessagesBulk';
    const data = { users, message };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getUserCommissionReport(email: string) {
    const url = environment.apiUrl + '/admin/userCommissionReport';
    const data = { email };
    return this.http.post<
      GetterResponseInterface<{
        text: string;
        pdfBase64?: string;
        pdfUrl?: string;
      }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  topUpBalance(email: string, amount: number) {
    const currentDate = new Date().toLocaleString('ru-RU');
    const explanation = `Ручное пополнение баланса администратором на сумму ${amount} для ${email} (${currentDate})`;

    const url = environment.apiUrl + '/admin/topUpBalance';
    const data = { email, amount, explanation };
    return this.http.post<
      GetterResponseInterface<{ email: string; amount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  withdrawRefBalance(email: string, amount: number) {
    const currentDate = new Date().toLocaleString('ru-RU');
    const explanation = `Ручное снятие реферального баланса администратором на сумму ${amount} для ${email} (${currentDate})`;

    const url = environment.apiUrl + '/admin/withdrawBalance';
    const data = { email, amount, explanation };
    return this.http.post<
      GetterResponseInterface<{ email: string; amount: number }>
    >(url, data, {
      headers: this.getHeaders(),
    });
  }

  getOpenPositionsByApi(apiId: string) {
    const url = environment.apiUrl + '/admin/getOpenPositionByApi';
    const data = { apiId };
    return this.http.post<GetterResponseInterface<OpenPositionData>>(
      url,
      data,
      {
        headers: this.getHeaders(),
      }
    );
  }

  closePosition(apiId: string, position: OpenPosition) {
    const url = environment.apiUrl + '/admin/closePosition';
    const data = {
      apiRevId: apiId,
      symbol: position.symbol,
      positionSide: position.side,
      positionAmt: position.amount || position.size,
    };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  cancelOrder(apiId: string, order: OpenOrder) {
    const url = environment.apiUrl + '/admin/cancelOrder';
    const data = {
      apiRevId: apiId,
      symbol: order.symbol,
      orderId: order.orderId,
      price: order.price,
      side: order.side,
      amount: order.amount,
      leverage: order.leverage,
    };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  cancelAllOrders(apiId: string, orders: OpenOrder[]) {
    const url = environment.apiUrl + '/admin/cancelAllOrders';
    const data = { apiRevId: apiId, orders };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updateParentRef(email: string, newParentRef: string) {
    const url = environment.apiUrl + '/admin/updateUserRef';
    const data = { email, newParentRef };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getPromocodes() {
    const url = environment.apiUrl + '/admin/promocodes';
    return this.http.get<GetterResponseInterface<any>>(url, {
      headers: this.getHeaders(),
    });
  }

  generatePromocodes(request: any) {
    const url = environment.apiUrl + '/admin/promocodes/generate';
    return this.http.post<GetterResponseInterface<any>>(url, request, {
      headers: this.getHeaders(),
    });
  }

  deactivatePromocode(promocodeId: string) {
    const url =
      environment.apiUrl + '/admin/promocodes/' + promocodeId + '/deactivate';
    return this.http.patch<GetterResponseInterface<any>>(
      url,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  activatePromocode(promocodeId: string) {
    const url =
      environment.apiUrl + '/admin/promocodes/' + promocodeId + '/activate';
    return this.http.patch<GetterResponseInterface<any>>(
      url,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  deletePromocode(promocodeId: string) {
    const url = environment.apiUrl + '/admin/promocodes/' + promocodeId;
    return this.http.delete<GetterResponseInterface<any>>(url, {
      headers: this.getHeaders(),
    });
  }

  getUsernames() {
    const url = environment.apiUrl + '/api/getUsernames';

    return this.http.get<GetterResponseInterface<string[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getWalletDetails(email: string) {
    const url = environment.apiUrl + `/admin/getWalletDetails/${email}`;
    return this.http.get<
      GetterResponseInterface<
        {
          email: string;
          isPaid: boolean;
          amount: number;
          explanation: string;
        }[]
      >
    >(url, {
      headers: this.getHeaders(),
    });
  }

  // Partners methods
  getPartners() {
    const url = environment.apiUrl + '/admin/partners';
    return this.http.get<PartnersResponse>(url, {
      headers: this.getHeaders(),
    });
  }

  createPartner(partnerData: CreatePartnerRequest) {
    const url = environment.apiUrl + '/admin/partners';
    return this.http.post<{ status: boolean; data: Partner }>(
      url,
      partnerData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  updatePartner(partnerData: UpdatePartnerRequest) {
    const url = environment.apiUrl + '/admin/partners/' + partnerData.id;
    return this.http.put<{ status: boolean; data: Partner }>(url, partnerData, {
      headers: this.getHeaders(),
    });
  }

  deletePartner(partnerId: number) {
    const url = environment.apiUrl + '/admin/partners/' + partnerId;
    return this.http.delete<{ status: boolean }>(url, {
      headers: this.getHeaders(),
    });
  }

  updateUserRole(email: string, role: UserRole) {
    const url = environment.apiUrl + '/admin/updateUserRole';
    const data = { email, role };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updateUserFreezePeriod(email: string, freezePeriod: number) {
    const url = environment.apiUrl + '/admin/updateUserFreezePeriod';
    const data = { email, freezePeriod };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  removeUserFreezePeriod(email: string) {
    const url = environment.apiUrl + '/admin/removeUserFreezePeriod';
    const data = { email };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  updateDefaultFreezePeriod(freezePeriod: number | null) {
    const url = environment.apiUrl + '/admin/updateDefaultFreezePeriod';
    const data = { freezePeriod };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  getDefaultFreezePeriod() {
    const url = environment.apiUrl + '/admin/getDefaultFreezePeriod';
    return this.http.get<GetterResponseInterface<number | null>>(url, {
      headers: this.getHeaders(),
    });
  }

  updateUserCreditorStatus(email: string, canWorkOnCredit: boolean) {
    const url = environment.apiUrl + '/admin/setUserFreezeCreditStatus';
    const data = { email, canWorkOnCredit };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  // Settings methods
  getCommissionText() {
    const url = environment.apiUrl + '/admin/settings/commission-text';
    return this.http.get<GetterResponseInterface<{ ru: string; en: string }>>(
      url,
      {
        headers: this.getHeaders(),
      }
    );
  }

  saveCommissionText(text: string, lang: string) {
    const url = environment.apiUrl + '/admin/settings/commission-text';
    const data = { text, lang };
    return this.http.post<GetterResponseInterface<{ ru: string; en: string }>>(
      url,
      data,
      {
        headers: this.getHeaders(),
      }
    );
  }

  sendWalletReport(email: string) {
    const url = environment.apiUrl + '/admin/send-wallet-report-temporary';
    const data = { email };
    return this.http.post<GetterResponseInterface<any>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  copyStrategySettings(fromStrategyId: string, toStrategyId: string) {
    const url = environment.apiUrl + '/admin/copyStrategySettings';
    const data = { fromStrategyId, toStrategyId };
    return this.http.post<GetterResponseInterface<Bot[]>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  setApiStrategy(email: string, apiName: string, strategyId: string) {
    const url = environment.apiUrl + '/admin/setApiStrategy';
    const data = { email, apiName, strategyId };
    return this.http.post<GetterResponseInterface<null>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  // Scenes methods
  getScenes() {
    const url = environment.apiUrl + '/admin/scenes';
    return this.http.get<GetterResponseInterface<Scene[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  saveScenes(scenes: Scene[]) {
    const url = environment.apiUrl + '/admin/scenes';
    return this.http.post<GetterResponseInterface<Scene[]>>(url, scenes, {
      headers: this.getHeaders(),
    });
  }

  updateScene(scene: Scene) {
    const url = environment.apiUrl + '/admin/scene';
    const data = {
      sceneId: scene.sceneId,
      welcomeText: scene.welcomeText,
      welcomeButtons: scene.welcomeButtons,
      reminders: scene.reminders,
    };
    return this.http.post<GetterResponseInterface<Scene>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  createScene(scene: Scene) {
    const url = environment.apiUrl + '/admin/scenes/create';
    const data = {
      sceneId: scene.sceneId,
      welcomeText: scene.welcomeText,
      welcomeButtons: scene.welcomeButtons,
      reminders: scene.reminders,
    };
    return this.http.post<GetterResponseInterface<Scene>>(url, data, {
      headers: this.getHeaders(),
    });
  }

  deleteScene(sceneId: string) {
    const url = environment.apiUrl + '/admin/scenes';
    const data = { sceneId };
    return this.http.delete<GetterResponseInterface<null>>(url, {
      headers: this.getHeaders(),
      body: data,
    });
  }

  // Interactions methods
  getAllInteractions() {
    const url = environment.apiUrl + '/api/getAllInteractions';
    return this.http.get<GetterResponseInterface<any[]>>(url, {
      headers: this.getHeaders(),
    });
  }

  getInteractionsByChatId(chatId: number) {
    const url = environment.apiUrl + `/api/getInteractionsByChatId/${chatId}`;
    return this.http.get<GetterResponseInterface<any[]>>(url, {
      headers: this.getHeaders(),
    });
  }
}
