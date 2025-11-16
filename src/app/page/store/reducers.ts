import { Action, createReducer, on } from '@ngrx/store';
import { PageInterface } from '../types/page.interface';
import {
  createApiAction,
  createApiFailureAction,
  createApiSuccessAction,
} from './actions/createApi.action';

import {
  startBotAction,
  startBotFailureAction,
  startBotSuccessAction,
} from './actions/startBot.action';
import {
  editApiAction,
  editApiSuccessAction,
  editApiFailureAction,
} from './actions/editApi.action';
import {
  getCurrentUserInfoAction,
  getCurrentUserInfoSuccessAction,
  getCurrentUserInfoFailureAction,
} from './actions/getCurrentUserInfo.action';
import {
  getApiStatusesAction,
  getApiStatusesFailureAction,
  getApiStatusesSuccessAction,
} from './actions/getApiStatuses.action';

import {
  stopBotAction,
  stopBotFailureAction,
  stopBotSuccessAction,
} from './actions/stopBot.action';
import {
  getReportsAction,
  getReportsSuccessAction,
  getReportsFailureAction,
} from './actions/getReports.action';
import {
  deleteApiAction,
  deleteApiSuccessAction,
  deleteApiFailureAction,
} from './actions/deleteApi.action';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { logoutSuccessAction } from 'src/app/auth/store/actions/logout.action';
import {
  clearRefsAction,
  getRefsAction,
  getRefsFailureAction,
  getRefsSuccessAction,
} from './actions/getRefs.action';
import {
  fullStopBotAction,
  fullStopBotFailureAction,
  fullStopBotSuccessAction,
} from './actions/fullStopBot.action';

const initialState: PageInterface = {
  apiId: null,
  isApiCreated: false,
  botStatus: BotStatus.Unknown,
  loaderCount: 0,
  userApi: [],
  reports: [],
  refs: [],
};

const authReducer = createReducer(
  initialState,
  on(logoutSuccessAction, (): PageInterface => initialState),
  on(
    createApiAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    createApiSuccessAction,
    (state, action): PageInterface => ({
      ...state,
      apiId: action.id,
      isApiCreated: true,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    createApiFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    startBotAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    startBotFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    startBotSuccessAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    stopBotAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    stopBotFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    stopBotSuccessAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    fullStopBotAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    fullStopBotFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    fullStopBotSuccessAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
    })
  ),
  on(
    getCurrentUserInfoAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getCurrentUserInfoSuccessAction,
    (state, request): PageInterface => ({
      ...state,
      userApi: request.apiKeys || [],
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getCurrentUserInfoFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getApiStatusesSuccessAction,
    (state, request): PageInterface => ({
      ...state,
      userApi: request.apiKeys || [],
    })
  ),
  on(
    deleteApiAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    deleteApiSuccessAction,
    (state, request): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
      userApi: state.userApi.filter((api) => api.id !== request.apiId),
    })
  ),
  on(
    deleteApiFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    editApiAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    editApiSuccessAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    editApiFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getReportsAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getReportsSuccessAction,
    (state, request): PageInterface => ({
      ...state,
      reports: request.reports,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getReportsFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(
    getRefsAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount + 1,
    })
  ),
  on(
    getRefsSuccessAction,
    (state, { refs }): PageInterface => ({
      ...state,
      refs,
      loaderCount: state.loaderCount - 1,
    })
  ),
  on(
    getRefsFailureAction,
    (state): PageInterface => ({
      ...state,
      loaderCount: state.loaderCount - 1,
    })
  ),

  on(clearRefsAction, (state): PageInterface => ({ ...state, refs: [] }))
);
export function reducers(state: PageInterface, action: Action) {
  return authReducer(state, action);
}
