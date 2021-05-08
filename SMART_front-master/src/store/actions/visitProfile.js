import { SET_VISIT_PROFILE, SET_VISIT_PROFILE_ERROR, SET_VISIT_PROFILE_STATE } from '../definitions/visitProfile';
import constants from '../../constants';
import { getAvatar } from './user';

const getVisitProfile = (id) => (dispatch, getState) => {
  const storeState = getState();
  dispatch({
    type: SET_VISIT_PROFILE_STATE,
    profileState: 'fetching',
  });
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', storeState.auth.userToken);
  fetch(`${constants.apiUrl}/profile/${id}`, {
    method: 'GET',
    headers: myHeaders,
  })
    .then(async (data) => {
      if (data.status === 200) {
        const json = await data.json();
        const avatar = await getAvatar(json.userId, storeState.auth.userToken);
        json.avatar = avatar;
        //json.shift();
        dispatch({
          type: SET_VISIT_PROFILE,
          visitProfile: json,
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_VISIT_PROFILE_ERROR,
        visitProfileError: 'Erreur inattendue',
      });
      console.error(err);
    });
};

export default {
  getVisitProfile,
};
