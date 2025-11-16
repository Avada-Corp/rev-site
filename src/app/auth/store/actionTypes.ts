export enum ActionTypes {
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth] Signup success',
  SIGNUP_FAILURE = '[Auth] Signup failure',

  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS_ACTION = '[Auth] Logout success',
  LOGOUT_FAILURE_ACTION = '[Auth] Logout failure',

  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login success',
  LOGIN_FAILURE = '[Auth] Login failure',

  FORGET_PASSWORD = '[Auth] Forget password',
  FORGET_PASSWORD_SUCCESS = '[Auth] Forget password success',
  FORGET_PASSWORD_FAILURE = '[Auth] Forget password failure',

  GET_CURRENT_USER = '[Auth] Get current user',
  GET_CURRENT_USER_SUCCESS = '[Auth] Get current user success',
  GET_CURRENT_USER_FAILURE = '[Auth] Get current user failure',

  NEW_PASSWORD = '[Auth] New password',
  NEW_PASSWORD_SUCCESS = '[Auth] New password success',
  NEW_PASSWORD_FAILURE = '[Auth] New password failure',

  TG_LOGIN = '[Auth] Tg login',
  TG_LOGIN_SUCCESS = '[Auth] Tg login success',
  TG_LOGIN_FAILURE = '[Auth] Tg login failure',

  ADD_REFERRAL = '[Auth] Add Referral',
  ADD_REFERRAL_SUCCESS = '[Auth] Add Referral success',
  ADD_REFERRAL_FAILURE = '[Auth] Add Referral failure',
}
