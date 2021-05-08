import { SET_PROFILE, SET_PROFILE_STATE, SET_USER_ERROR } from '../definitions/profile';
import constants from '../../constants';
import { getAvatar } from './user';

const getProfile = () => (dispatch, getState) => {
  const storeState = getState();
  dispatch({
    type: SET_PROFILE_STATE,
    profileState: 'fetching',
  });
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', storeState.auth.userToken);
  fetch(`${constants.apiUrl}/profile/${storeState.auth.currentUser.userId}`, {
    method: 'GET',
    headers: myHeaders,
  })
    .then(async (data) => {
      if (data.status === 200) {
        const json = await data.json();
        const avatar = await getAvatar(storeState.auth.currentUser.userId, storeState.auth.userToken);
        json.avatar = avatar;
        dispatch({
          type: SET_PROFILE,
          profile: json,
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_USER_ERROR,
        loginError: 'Erreur inattendue',
      });
      console.error(err);
    });
};

export default {
  getProfile,
};
