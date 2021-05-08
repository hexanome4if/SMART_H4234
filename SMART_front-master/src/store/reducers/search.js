import { SET_RESULTS, initSearch, SET_RESULTS_ERROR, SET_RESULTS_STATE } from '../definitions/search';

export default (state = initSearch(), action) => {
  switch (action.type) {
    case SET_RESULTS: {
      return {
        ...state,
        results: action.results,
        resultsState: 'ready',
      };
    }
    case SET_RESULTS_ERROR: {
      return {
        ...state,
        resultsError: action.resultsError,
      };
    }
    case SET_RESULTS_STATE: {
      return {
        ...state,
        resultsState: action.resultsState,
      };
    }
  }
  return state;
};
