import {
  initMeetingState, REMOVE_RECEIVED_REQUEST, REMOVE_SCHEDULE_MEETING, REMOVE_SENT_REQUEST,
  SET_RECEIVED_REQUESTS,
  SET_SCHEDULED_MEETINGS,
  SET_SENT_REQUESTS,
} from '../definitions/meeting';

export default (state = initMeetingState(), action) => {
  switch (action.type) {
    case SET_RECEIVED_REQUESTS: {
      return {
        ...state,
        receivedRequests: action.receivedRequests,
      };
    }
    case SET_SENT_REQUESTS: {
      return {
        ...state,
        sentRequests: action.sentRequests,
      };
    }
    case SET_SCHEDULED_MEETINGS: {
      return {
        ...state,
        scheduledMeetings: action.scheduledMeetings,
      };
    }
    case REMOVE_SENT_REQUEST: {
      return {
        ...state,
        sentRequests: state.sentRequests.filter(req => req.meetingId !== action.meetingId)
      };
    }
    case REMOVE_RECEIVED_REQUEST: {
      return {
        ...state,
        receivedRequests: state.receivedRequests.filter(req => req.meetingId !== action.meetingId)
      };
    }
    case REMOVE_SCHEDULE_MEETING: {
      return {
        ...state,
        scheduledMeetings: state.scheduledMeetings.filter(req => req.meetingId !== action.meetingId)
      }
    }
  }

  return state;
};
