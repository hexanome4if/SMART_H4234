import { SET_VISIT_PROFILE, initVisitProfile, SET_VISIT_PROFILE_ERROR, SET_VISIT_PROFILE_STATE } from '../definitions/visitProfile';

export default (state = initVisitProfile(), action) => {
  switch (action.type) {
    case SET_VISIT_PROFILE: {
      return {
        ...state,
        visitProfile: action.visitProfile,
        visitProfileState: 'ready',
      };
    }
    case SET_VISIT_PROFILE_ERROR: {
      return {
        ...state,
        visitProfileError: action.visitProfileError,
      };
    }
    case SET_VISIT_PROFILE_STATE: {
      return {
        ...state,
        visitProfileState: action.visitProfileState,
      };
    }
  }
  return state;
};
