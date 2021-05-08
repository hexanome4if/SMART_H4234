import { SET_RESULTS, SET_RESULTS_ERROR, SET_RESULTS_STATE } from '../definitions/search';
import constants from '../../constants';
import actions from '.';
import { getAvatar } from './user';

const getResults = (label) => (dispatch, getState) => {
  const storeState = getState();
  dispatch({
    type: SET_RESULTS_STATE,
    resultsState: 'fetching',
  });
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', storeState.auth.userToken);

  fetch(`${constants.apiUrl}/profile/education/label/${label}`, {
    method: 'GET',
    headers: myHeaders,
  })
    .then(async (data) => {
      if (data.status === 200) {
        const json = await data.json();
        console.log("Debut results")
        console.log(json);
        for(let i = 0; i < json.true.length; ++i) {
          const avatar = await getAvatar(json.true[i].userId, storeState.auth.userToken);
          json.true[i].avatar = avatar;
        }
        dispatch({
          type: SET_RESULTS,
          results: json.true,
        });
        // dispatch(actions.recProfiles.getRecProfiles());
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_RESULTS_ERROR,
        suggestionsError: 'Erreur inattendue',
      });
      console.error(err);
    });
};

export default {
    getResults,
};
