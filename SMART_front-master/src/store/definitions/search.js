export const initSearch = () => ({
    results: [],
    resultsError: null,
    resultsState: 'not_loaded'
});

export const SET_RESULTS= 'SET_RESULTS';
export const SET_RESULTS_ERROR= 'SET_RESULTS_ERROR';
export const SET_RESULTS_STATE= 'SET_RESULTS_STATE';