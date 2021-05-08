import {
  LOGIN_OK,
  SET_AUTH_STATE,
  SET_CURRENT_USER,
  SET_LOGIN_ERROR,
  SET_USER_NAME,
  SET_USER_TOKEN,
} from '../definitions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/auth';
import SSE from '../../services/sse';
import constants from '../../constants';

const init = () => async (dispatch) => {
  const storedToken = await AsyncStorage.getItem('auth_token');
  const storedUserName = await AsyncStorage.getItem('auth_username');
  if (storedToken && storedUserName) {
    dispatch({
      type: SET_USER_TOKEN,
      userToken: storedToken,
    });
    dispatch({
      type: SET_USER_NAME,
      userName: storedUserName,
    });
    dispatch(getUser());
  } else {
    dispatch({
      type: SET_AUTH_STATE,
      authState: 'login',
    });
  }
};

const getUser = () => async (dispatch, storeState) => {
  dispatch({
    type: SET_AUTH_STATE,
    authState: 'getting_user',
  });
  const state = storeState();
  const { status, json } = await authService.getUser(state.auth.userToken, state.auth.userName);

  if (status === 'ok') {
    dispatch({
      type: SET_CURRENT_USER,
      currentUser: json,
    });
    dispatch({
      type: SET_AUTH_STATE,
      authState: 'logged',
    });
    new SSE(json.userId, state.auth.userToken);
    // new WebSocketService(state.auth.userToken.replace('Bearer ', ''));
  } else {
    dispatch({
      type: SET_AUTH_STATE,
      authState: 'login',
    });
  }
};

const login = (username, password, deviceToken) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_STATE,
    authState: 'login_processing',
  });

  const { status, json } = await authService.login(username, password, deviceToken);
  if (status === 'ok') {
    await fetch(`${constants.apiUrl}/user/device/${username}`, {
      method: 'POST',
      headers: {
        Authorization: json.Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device: deviceToken,
      }),
    });
    await AsyncStorage.setItem('auth_token', json.Authorization);
    await AsyncStorage.setItem('auth_username', json.username);
    dispatch({
      type: LOGIN_OK,
      userToken: json.Authorization,
      userName: json.username,
    });
    dispatch(getUser());
    return;
  } else if (status === 'forbidden') {
    dispatch({
      type: SET_LOGIN_ERROR,
      loginError: 'Email ou mot de passe invalide',
    });
  } else {
    dispatch({
      type: SET_LOGIN_ERROR,
      loginError: 'Erreur inatendue',
    });
  }
  dispatch({
    type: SET_AUTH_STATE,
    authState: 'login',
  });
};

const logout = (history) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_STATE,
    authState: 'login',
  });
  dispatch({
    type: SET_USER_TOKEN,
    token: null,
  });

  await AsyncStorage.removeItem('auth_token');

  history.replace('/'); // Return to login
};

export default {
  init,
  login,
  logout,
};
