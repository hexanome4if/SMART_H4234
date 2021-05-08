import { SET_PROFILE, initProfile, SET_USER_ERROR, SET_PROFILE_STATE } from '../definitions/profile';

export default (state = initProfile(), action) => {
  switch (action.type) {
    case SET_PROFILE: {
      return {
        ...state,
        profile: action.profile,
        profileState: 'ready',
      };
    }
    case SET_USER_ERROR: {
      return {
        ...state,
        userError: action.userError,
      };
    }
    case SET_PROFILE_STATE: {
      return {
        ...state,
        profileState: action.profileState,
      };
    }
  }
  return state;
};
