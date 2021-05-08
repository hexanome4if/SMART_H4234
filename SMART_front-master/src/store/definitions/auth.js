export const initAuthState = () => ({
  currentUser: null,
  authState: 'init',
  loginError: null,
  userToken: null,
  userName: null,
});

export const SET_AUTH_STATE = 'SET_AUTH_STATE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_USER_NAME = 'SET_USER_NAME';
export const LOGIN_OK = 'LOGIN_OK';
