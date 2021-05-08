export const initChatState = () => ({
  requests: null,
  discussions: null,
  isFetchingDiscussions: false,
  currentDiscussion: null,
  isCreatingDiscussion: false,
  availableUsers: null,
});

export const GOT_REQUESTS = 'GOT_REQUESTS';
export const FETCH_DISCUSSIONS = 'FETCH_DISCUSSIONS';
export const GOT_DISCUSSIONS = 'GOT_DISCUSSIONS';
export const REMOVE_REQUEST = 'REMOVE_REQUEST';
export const SET_CURRENT_DISCUSSION = 'SET_CURRENT_DISCUSSION';
export const REMOVE_DISCUSSION = 'REMOVE_DISCUSSION';
export const SET_CREATING_DISCUSSION = 'SET_CREATING_DISCUSSION';
export const SET_AVAILABLE_USERS = 'SET_AVAILABLE_USERS';
export const SET_CURRENT_DISCUSSION_USERS = 'SET_CURRENT_DISCUSSION_USERS';
export const SET_CURRENT_DISCUSSION_MESSAGES = 'SET_CURRENT_DISCUSSION_MESSAGES';
export const ADD_MESSAGE_IN_CURRENT_DISCUSSION = 'ADD_MESSAGE_IN_CURRENT_DISCUSSION';
