export enum ActionTypes {
  CREATE_API_KEY = '[Create] New api key',
  CREATE_API_KEY_SUCCESS = '[Create] New api key success',
  CREATE_API_KEY_FAILURE = '[Create] New api key failure',

  DELETE_API_KEY = '[Delete] Api key',
  DELETE_API_KEY_SUCCESS = '[Delete] Api key success',
  DELETE_API_KEY_FAILURE = '[Delete] Api key failure',

  EDIT_API_KEY = '[Edit] Api key',
  EDIT_API_KEY_SUCCESS = '[Edit] Api key success',
  EDIT_API_KEY_FAILURE = '[Edit] Api key failure',

  GET_CURRENT_USER_INFO = '[Check] Get current user info',
  GET_CURRENT_USER_INFO_SUCCESS = '[Check] Get current user info success',
  GET_CURRENT_USER_INFO_FAILURE = '[Check] Get current user info failure',

  GET_API_STATUSES_INFO = '[Check] Get api statuses',
  GET_API_STATUSES_INFO_SUCCESS = '[Check] Get api statuses success',
  GET_API_STATUSES_INFO_FAILURE = '[Check] Get api statuses failure',

  START_BOT = '[Bot] Start bot',
  START_BOT_SUCCESS = '[Bot] Start bot success',
  START_BOT_FAILURE = '[Bot] Start bot failure',

  STOP_BOT = '[Bot] Stop bot',
  STOP_BOT_SUCCESS = '[Bot] Stop bot success',
  STOP_BOT_FAILURE = '[Bot] Stop bot failure',

  FULL_STOP_BOT = '[Bot] Full stop bot',
  FULL_STOP_BOT_SUCCESS = '[Bot] Full stop bot success',
  FULL_STOP_BOT_FAILURE = '[Bot] Full stop bot failure',

  TG_ADD_EMAIL_BOT = '[Add] Email to tg bot',
  TG_ADD_EMAIL_BOT_SUCCESS = '[Add] Email to tg bot success',
  TG_ADD_EMAIL_BOT_FAILURE = '[Add] Email to tg bot failure',

  GET_REPORTS = '[Get] Reports',
  GET_REPORTS_SUCCESS = '[Get] Reports success',
  GET_REPORTS_FAILURE = '[Get] Reports failure',

  GET_REFS = '[Get] Refs',
  GET_REFS_SUCCESS = '[Get] Refs success',
  GET_REFS_FAILURE = '[Get] Refs failure',

  CLEAR_REFS = '[Clear] Refs',
}
