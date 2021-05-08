import { SET_SUGGESTIONS, initSuggestions, SET_SUGGESTIONS_ERROR, SET_SUGGESTIONS_STATE } from '../definitions/suggestions';

export default (state = initSuggestions(), action) => {
  switch (action.type) {
    case SET_SUGGESTIONS: {
      return {
        ...state,
        suggestions: action.suggestions,
        suggestionsState: 'ready',
      };
    }
    case SET_SUGGESTIONS_ERROR: {
      return {
        ...state,
        suggestionsError: action.suggestionsError,
      };
    }
    case SET_SUGGESTIONS_STATE: {
      return {
        ...state,
        suggestionsState: action.suggestionsState,
      };
    }
  }
  return state;
};
