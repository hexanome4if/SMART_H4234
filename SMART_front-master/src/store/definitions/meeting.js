export const initMeetingState = () => ({
  receivedRequests: null,
  sentRequests: null,
  scheduledMeetings: null,
});

export const SET_RECEIVED_REQUESTS = 'SET_RECEIVED_REQUESTS';
export const SET_SENT_REQUESTS = 'SET_SENT_REQUESTS';
export const SET_SCHEDULED_MEETINGS = 'SET_SCHEDULED_MEETINGS';
export const REMOVE_SENT_REQUEST = 'REMOVE_SENT_REQUEST';
export const REMOVE_RECEIVED_REQUEST = 'REMOVE_RECEIVED_REQUEST';
export const REMOVE_SCHEDULE_MEETING = 'REMOVE_SCHEDULE_MEETING';
