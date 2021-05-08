export const initSuggestions = () => ({
    suggestions: null,
    suggestionsError: null,
    suggestionsState: 'not_loaded'
});

export const SET_SUGGESTIONS= 'SET_SUGGESTIONS';
export const SET_SUGGESTIONS_ERROR= 'SET_SUGGESTIONS_ERROR';
export const SET_SUGGESTIONS_STATE= 'SET_SUGGESTIONS_STATE';