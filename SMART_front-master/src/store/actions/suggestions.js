import { SET_SUGGESTIONS, SET_SUGGESTIONS_ERROR, SET_SUGGESTIONS_STATE } from '../definitions/suggestions';
import constants from '../../constants';
import actions from '.';

const getSuggestions = () => (dispatch, getState) => {
  const storeState = getState();
  const tags = storeState.profile.profile.userInterestTags;

  dispatch({
    type: SET_SUGGESTIONS_STATE,
    suggestionsState: 'fetching',
  });
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', storeState.auth.userToken);

  fetch(`${constants.apiUrl}/suggestion/${storeState.profile.profile.userId}`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(tags),
  })
    .then(async (data) => {
      if (data.status === 200) {
        const json = await data.json();
        dispatch({
          type: SET_SUGGESTIONS,
          suggestions: json.sort((a, b) => (a.note < b.note) ? 1 : -1),
        });
        dispatch(actions.recProfiles.getRecProfiles());
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_SUGGESTIONS_ERROR,
        suggestionsError: 'Erreur inattendue',
      });
      console.error(err);
    });
};

export default {
  getSuggestions,
};
