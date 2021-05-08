import {
  initAuthState,
  LOGIN_OK,
  SET_AUTH_STATE,
  SET_CURRENT_USER,
  SET_LOGIN_ERROR,
  SET_USER_NAME,
  SET_USER_TOKEN,
} from '../definitions/auth';

export default (state = initAuthState(), action) => {
  switch (action.type) {
    case SET_AUTH_STATE: {
      return {
        ...state,
        authState: action.authState,
      };
    }
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.currentUser,
      };
    }
    case SET_LOGIN_ERROR: {
      return {
        ...state,
        loginError: action.loginError,
      };
    }
    case SET_USER_TOKEN: {
      return {
        ...state,
        userToken: action.userToken,
      };
    }
    case SET_USER_NAME: {
      return {
        ...state,
        userName: action.userName,
      };
    }
    case LOGIN_OK: {
      return {
        ...state,
        userToken: action.userToken,
        userName: action.userName,
        loginError: null,
      };
    }
  }
  return state;
};
