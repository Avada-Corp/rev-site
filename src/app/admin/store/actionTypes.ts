export enum ActionTypes {
  GET_USERS = '[Get] Users',
  GET_USERS_SUCCESS = '[Get] Users success',
  GET_USERS_FAILURE = '[Get] Users failure',
  SET_USERS_PAGE = '[Set] Users page',

  GET_BOTS_SETTINGS = '[Get] Bots settings',
  GET_BOTS_SETTINGS_SUCCESS = '[Get] Bots settings success',
  GET_BOTS_SETTINGS_FAILURE = '[Get] Bots settings failure',

  GET_ALL_FULL_BALANCES = '[Get] All full balances',
  GET_ALL_FULL_BALANCES_SUCCESS = '[Get] All full balances success',
  GET_ALL_FULL_BALANCES_FAILURE = '[Get] All full balances failure',

  GET_BOTS = '[Get] Bots',
  GET_BOTS_SUCCESS = '[Get] Bots success',
  GET_BOTS_FAILURE = '[Get] Bots failure',

  GET_BOT_STRATEGIES = '[Get] Bot Strategies',
  GET_BOT_STRATEGIES_SUCCESS = '[Get] Bot Strategies success',
  GET_BOT_STRATEGIES_FAILURE = '[Get] Bot Strategies failure',

  EDIT_BOT_STRATEGY = '[Edit] Bot Strategy',
  EDIT_BOT_STRATEGY_SUCCESS = '[Edit] Bot Strategy success',
  EDIT_BOT_STRATEGY_FAILURE = '[Edit] Bot Strategy failure',

  UPDATE_BOT = '[Update] Bots',
  UPDATE_BOT_SUCCESS = '[Update] Bots success',
  UPDATE_BOT_FAILURE = '[Update] Bots failure',

  UPDATE_BOTS_BY_API = '[Update] Bots by api',
  UPDATE_BOTS_BY_API_SUCCESS = '[Update] Bots by api success',
  UPDATE_BOTS_BY_API_FAILURE = '[Update] Bots by api failure',

  ACTUALIZE_BOTS_BY_API = '[Actualize] Bots by api',
  ACTUALIZE_BOTS_BY_API_SUCCESS = '[Actualize] Bots by api success',
  ACTUALIZE_BOTS_BY_API_FAILURE = '[Actualize] Bots by api failure',

  ACTUALIZE_BOTS_NOT_START_BY_API = '[Actualize] Bots not start by api',
  ACTUALIZE_BOTS_NOT_START_BY_API_SUCCESS = '[Actualize] Bots not start by api success',
  ACTUALIZE_BOTS_NOT_START_BY_API_FAILURE = '[Actualize] Bots not start by api failure',

  // Bulk operations
  BULK_ACTUALIZE_BOTS = '[Bulk] Actualize Bots',
  BULK_ACTUALIZE_BOTS_SUCCESS = '[Bulk] Actualize Bots success',
  BULK_ACTUALIZE_BOTS_FAILURE = '[Bulk] Actualize Bots failure',

  BULK_ACTUALIZE_BOTS_NOT_START = '[Bulk] Actualize Bots not start',
  BULK_ACTUALIZE_BOTS_NOT_START_SUCCESS = '[Bulk] Actualize Bots not start success',
  BULK_ACTUALIZE_BOTS_NOT_START_FAILURE = '[Bulk] Actualize Bots not start failure',

  BULK_UPDATE_BOTS = '[Bulk] Update Bots',
  BULK_UPDATE_BOTS_SUCCESS = '[Bulk] Update Bots success',
  BULK_UPDATE_BOTS_FAILURE = '[Bulk] Update Bots failure',

  BULK_START_BOTS = '[Bulk] Start Bots',
  BULK_START_BOTS_SUCCESS = '[Bulk] Start Bots success',
  BULK_START_BOTS_FAILURE = '[Bulk] Start Bots failure',

  BULK_STOP_BOTS = '[Bulk] Stop Bots',
  BULK_STOP_BOTS_SUCCESS = '[Bulk] Stop Bots success',
  BULK_STOP_BOTS_FAILURE = '[Bulk] Stop Bots failure',

  BULK_FULL_STOP_BOTS = '[Bulk] Full Stop Bots',
  BULK_FULL_STOP_BOTS_SUCCESS = '[Bulk] Full Stop Bots success',
  BULK_FULL_STOP_BOTS_FAILURE = '[Bulk] Full Stop Bots failure',

  REMOVE_BOT = '[Remove] Bots',
  REMOVE_BOT_SUCCESS = '[Remove] Bots success',
  REMOVE_BOT_FAILURE = '[Remove] Bots failure',

  SAVE_ALL_BOTS = '[Save] Bots',
  SAVE_ALL_BOTS_SUCCESS = '[Save] Bots success',
  SAVE_ALL_BOTS_FAILURE = '[Save] Bots failure',

  UPDATE_COMMISSION_FREQUENCY = '[Update] Commission frequency',
  UPDATE_COMMISSION_FREQUENCY_SUCCESS = '[Update] Commission frequency success',
  UPDATE_COMMISSION_FREQUENCY_FAILURE = '[Update] Commission frequency failure',

  GET_REPORTS = '[Get] Admin Reports',
  GET_REPORTS_SUCCESS = '[Get] Admin Reports success',
  GET_REPORTS_FAILURE = '[Get] Admin Reports failure',
  SET_REPORTS_DATE_RANGE = '[Set] Reports Date Range',

  GET_API_COMMISSIONS = '[Get] Admin Api Commission',
  GET_API_COMMISSIONS_SUCCESS = '[Get] Admin Api Commission success',
  GET_API_COMMISSIONS_FAILURE = '[Get] Admin Api Commission failure',

  GET_USER_COMMISSIONS = '[Get] Admin User Commission',
  GET_USER_COMMISSIONS_SUCCESS = '[Get] Admin User Commission success',
  GET_USER_COMMISSIONS_FAILURE = '[Get] Admin User Commission failure',

  GET_USERS_COMMISSIONS = '[Get] Admin Users Commissions',
  GET_USERS_COMMISSIONS_SUCCESS = '[Get] Admin Users Commissions success',
  GET_USERS_COMMISSIONS_FAILURE = '[Get] Admin Users Commissions failure',

  GET_REF_PERCENTS_COMMISSIONS = '[Get] Admin Ref Percents',
  GET_REF_PERCENTS_COMMISSIONS_SUCCESS = '[Get] Admin Ref Percents success',
  GET_REF_PERCENTS_COMMISSIONS_FAILURE = '[Get] Admin Ref Percents failure',

  UPDATE_API_PRIVATE_COMMISSION = '[Update] Admin Api Private Commission',
  UPDATE_API_PRIVATE_COMMISSION_SUCCESS = '[Update] Admin Api Private Commission success',
  UPDATE_API_PRIVATE_COMMISSION_FAILURE = '[Update] Admin Api Private Commission failure',

  UPDATE_REF_PERCENTS_COMMISSION = '[Update] Admin Ref Percents Commission',
  UPDATE_REF_PERCENTS_COMMISSION_SUCCESS = '[Update] Admin Ref Percents Commission success',
  UPDATE_REF_PERCENTS_COMMISSION_FAILURE = '[Update] Admin Ref Percents Commission failure',

  UPDATE_USER_PRIVATE_COMMISSION = '[Update] Admin User Private Commission',
  UPDATE_USER_PRIVATE_COMMISSION_SUCCESS = '[Update] Admin User Private Commission success',
  UPDATE_USER_PRIVATE_COMMISSION_FAILURE = '[Update] Admin User Private Commission failure',

  GET_EMPTY_USERS = '[Get] Empty Users',
  GET_EMPTY_USERS_SUCCESS = '[Get] Empty Users success',
  GET_EMPTY_USERS_FAILURE = '[Get] Empty Users failure',

  GET_WALLETS = '[Get] Wallets',
  GET_WALLETS_SUCCESS = '[Get] Wallets success',
  GET_WALLETS_FAILURE = '[Get] Wallets failure',

  TOP_UP_BALANCE = '[Admin] Top Up Balance',
  TOP_UP_BALANCE_SUCCESS = '[Admin] Top Up Balance Success',
  TOP_UP_BALANCE_FAILURE = '[Admin] Top Up Balance Failure',

  WITHDRAW_REF_BALANCE = '[Admin] Withdraw Ref Balance',
  WITHDRAW_REF_BALANCE_SUCCESS = '[Admin] Withdraw Ref Balance Success',
  WITHDRAW_REF_BALANCE_FAILURE = '[Admin] Withdraw Ref Balance Failure',

  GET_OPEN_POSITIONS = '[Get] Open Positions',
  GET_OPEN_POSITIONS_SUCCESS = '[Get] Open Positions Success',
  GET_OPEN_POSITIONS_FAILURE = '[Get] Open Positions Failure',

  CLOSE_POSITION = '[Close] Position',
  CLOSE_POSITION_SUCCESS = '[Close] Position Success',
  CLOSE_POSITION_FAILURE = '[Close] Position Failure',

  CANCEL_ORDER = '[Cancel] Order',
  CANCEL_ORDER_SUCCESS = '[Cancel] Order Success',
  CANCEL_ORDER_FAILURE = '[Cancel] Order Failure',

  CANCEL_ALL_ORDERS = '[Cancel] All Orders',
  CANCEL_ALL_ORDERS_SUCCESS = '[Cancel] All Orders Success',
  CANCEL_ALL_ORDERS_FAILURE = '[Cancel] All Orders Failure',

  GET_USERNAMES = '[Get] Usernames',
  GET_USERNAMES_SUCCESS = '[Get] Usernames success',
  GET_USERNAMES_FAILURE = '[Get] Usernames failure',

  UPDATE_PARENT_REF = '[Admin] Update parent ref',
  UPDATE_PARENT_REF_SUCCESS = '[Admin] Update parent ref success',
  UPDATE_PARENT_REF_FAILURE = '[Admin] Update parent ref failure',

  GET_WALLET_HISTORY = '[Get] Wallet History',
  GET_WALLET_HISTORY_SUCCESS = '[Get] Wallet History Success',
  GET_WALLET_HISTORY_FAILURE = '[Get] Wallet History Failure',

  GET_PNL_REPORTS_USERS = '[Get] PNL Reports Users',
  GET_PNL_REPORTS_USERS_SUCCESS = '[Get] PNL Reports Users Success',
  GET_PNL_REPORTS_USERS_FAILURE = '[Get] PNL Reports Users Failure',

  GET_SOLO_PNL_REPORTS = '[Get] Solo PNL Reports',
  GET_SOLO_PNL_REPORTS_SUCCESS = '[Get] Solo PNL Reports Success',
  GET_SOLO_PNL_REPORTS_FAILURE = '[Get] Solo PNL Reports Failure',

  // Promocodes actions
  GET_PROMOCODES = '[Get] Promocodes',
  GET_PROMOCODES_SUCCESS = '[Get] Promocodes Success',
  GET_PROMOCODES_FAILURE = '[Get] Promocodes Failure',

  GENERATE_PROMOCODES = '[Generate] Promocodes',
  GENERATE_PROMOCODES_SUCCESS = '[Generate] Promocodes Success',
  GENERATE_PROMOCODES_FAILURE = '[Generate] Promocodes Failure',

  DEACTIVATE_PROMOCODE = '[Deactivate] Promocode',
  DEACTIVATE_PROMOCODE_SUCCESS = '[Deactivate] Promocode Success',
  DEACTIVATE_PROMOCODE_FAILURE = '[Deactivate] Promocode Failure',

  ACTIVATE_PROMOCODE = '[Activate] Promocode',
  ACTIVATE_PROMOCODE_SUCCESS = '[Activate] Promocode Success',
  ACTIVATE_PROMOCODE_FAILURE = '[Activate] Promocode Failure',

  DELETE_PROMOCODE = '[Delete] Promocode',
  DELETE_PROMOCODE_SUCCESS = '[Delete] Promocode Success',
  DELETE_PROMOCODE_FAILURE = '[Delete] Promocode Failure',

  // Action for handling cancelled requests
  REQUEST_CANCELLED = '[Admin] Request Cancelled',

  // Wallet details actions
  GET_WALLET_DETAILS = '[Get] Wallet Details',
  GET_WALLET_DETAILS_SUCCESS = '[Get] Wallet Details Success',
  GET_WALLET_DETAILS_FAILURE = '[Get] Wallet Details Failure',

  // Partners actions
  GET_PARTNERS = '[Get] Partners',
  GET_PARTNERS_SUCCESS = '[Get] Partners Success',
  GET_PARTNERS_FAILURE = '[Get] Partners Failure',

  CREATE_PARTNER = '[Create] Partner',
  CREATE_PARTNER_SUCCESS = '[Create] Partner Success',
  CREATE_PARTNER_FAILURE = '[Create] Partner Failure',

  UPDATE_PARTNER = '[Update] Partner',
  UPDATE_PARTNER_SUCCESS = '[Update] Partner Success',
  UPDATE_PARTNER_FAILURE = '[Update] Partner Failure',

  DELETE_PARTNER = '[Delete] Partner',
  DELETE_PARTNER_SUCCESS = '[Delete] Partner Success',
  DELETE_PARTNER_FAILURE = '[Delete] Partner Failure',

  UPDATE_USER_ROLE = '[Admin] Update User Role',
  UPDATE_USER_ROLE_SUCCESS = '[Admin] Update User Role success',
  UPDATE_USER_ROLE_FAILURE = '[Admin] Update User Role failure',

  // Settings actions
  GET_COMMISSION_TEXT = '[Settings] Get Commission Text',
  GET_COMMISSION_TEXT_SUCCESS = '[Settings] Get Commission Text Success',
  GET_COMMISSION_TEXT_FAILURE = '[Settings] Get Commission Text Failure',

  SAVE_COMMISSION_TEXT = '[Settings] Save Commission Text',
  SAVE_COMMISSION_TEXT_SUCCESS = '[Settings] Save Commission Text Success',
  SAVE_COMMISSION_TEXT_FAILURE = '[Settings] Save Commission Text Failure',

  // User commission report actions
  GET_USER_COMMISSION_REPORT = '[Get] User Commission Report',
  GET_USER_COMMISSION_REPORT_SUCCESS = '[Get] User Commission Report Success',
  GET_USER_COMMISSION_REPORT_FAILURE = '[Get] User Commission Report Failure',

  // Copy strategy settings actions
  COPY_STRATEGY_SETTINGS = '[Copy] Strategy Settings',
  COPY_STRATEGY_SETTINGS_SUCCESS = '[Copy] Strategy Settings Success',
  COPY_STRATEGY_SETTINGS_FAILURE = '[Copy] Strategy Settings Failure',

  // Set API strategy actions
  SET_API_STRATEGY = '[Set] API Strategy',
  SET_API_STRATEGY_SUCCESS = '[Set] API Strategy Success',
  SET_API_STRATEGY_FAILURE = '[Set] API Strategy Failure',

  // Scenes/Funnel actions
  GET_SCENES = '[Get] Scenes',
  GET_SCENES_SUCCESS = '[Get] Scenes Success',
  GET_SCENES_FAILURE = '[Get] Scenes Failure',

  SAVE_SCENES = '[Save] Scenes',
  SAVE_SCENES_SUCCESS = '[Save] Scenes Success',
  SAVE_SCENES_FAILURE = '[Save] Scenes Failure',

  UPDATE_SCENE = '[Update] Scene',
  UPDATE_SCENE_SUCCESS = '[Update] Scene Success',
  UPDATE_SCENE_FAILURE = '[Update] Scene Failure',

  CREATE_SCENE = '[Create] Scene',
  CREATE_SCENE_SUCCESS = '[Create] Scene Success',
  CREATE_SCENE_FAILURE = '[Create] Scene Failure',

  DELETE_SCENE = '[Delete] Scene',
  DELETE_SCENE_SUCCESS = '[Delete] Scene Success',
  DELETE_SCENE_FAILURE = '[Delete] Scene Failure',
}
