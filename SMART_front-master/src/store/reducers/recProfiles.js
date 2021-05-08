import { SET_RECPROFILES, initRecProfiles, SET_RECPROFILES_ERROR, SET_RECPROFILES_STATE } from '../definitions/recProfiles';

export default (state = initRecProfiles(), action) => {
    switch (action.type) {
        case SET_RECPROFILES: {
            return {
                ...state,
                recProfiles: [...state.recProfiles, action.recProfiles],
                recProfilesState: 'ready',
            };
        }
        case SET_RECPROFILES_ERROR: {
            return {
                ...state,
                recProfilesError: action.recProfilesError,
            };
        }
        case SET_RECPROFILES_STATE: {
            return {
                ...state,
                recProfilesState: action.recProfilesState,
            };
        }
    }
    return state;
};