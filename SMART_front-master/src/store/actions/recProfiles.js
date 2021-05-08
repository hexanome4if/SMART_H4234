import { SET_RECPROFILES, SET_RECPROFILES_ERROR, SET_RECPROFILES_STATE } from '../definitions/recProfiles';
import constants from '../../constants';
import actions from '.';
import { getAvatar } from './user';

const getRecProfiles = () => (dispatch, getState) => {
  const storeState = getState();

  dispatch({
    type: SET_RECPROFILES_STATE,
    profileState: 'fetching',
  });

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', storeState.auth.userToken);

  const recIdList = storeState.suggestions.suggestions.map((s) => s.userId);

  for (let i = 0; i < recIdList.length; i++) {
    fetch(`${constants.apiUrl}/profile/${recIdList[i]}`, {
      method: 'GET',
      headers: myHeaders,
    })
      .then(async (data) => {
        if (data.status === 200) {
          const json = await data.json();
          const avatar = await getAvatar(json.userId, storeState.auth.userToken);
          json.avatar = avatar;
          dispatch({
            type: SET_RECPROFILES,
            recProfiles: json,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: SET_RECPROFILES_ERROR,
          loginError: 'Erreur inattendue',
        });
        console.error(err);
      });
  }
};

export default {
  getRecProfiles,
};
