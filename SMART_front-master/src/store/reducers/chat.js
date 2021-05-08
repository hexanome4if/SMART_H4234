import { SET_CURRENT_USER } from '../definitions/auth';
import {
  ADD_MESSAGE_IN_CURRENT_DISCUSSION,
  FETCH_DISCUSSIONS,
  GOT_DISCUSSIONS,
  GOT_REQUESTS,
  initChatState,
  REMOVE_DISCUSSION,
  REMOVE_REQUEST,
  SET_AVAILABLE_USERS,
  SET_CREATING_DISCUSSION,
  SET_CURRENT_DISCUSSION,
  SET_CURRENT_DISCUSSION_MESSAGES,
  SET_CURRENT_DISCUSSION_USERS,
} from '../definitions/chat';

export default (state = initChatState(), action) => {
  switch (action.type) {
    case GOT_REQUESTS: {
      return {
        ...state,
        requests: action.requests,
      };
    }
    case GOT_DISCUSSIONS: {
      return {
        ...state,
        discussions: action.discussions,
        isFetchingDiscussions: false,
      };
    }
    case FETCH_DISCUSSIONS: {
      return {
        ...state,
        isFetchingDiscussions: true,
      };
    }
    case REMOVE_REQUEST: {
      return {
        ...state,
        requests: state.requests.filter((request) => request.chatId !== action.requestId),
      };
    }
    case SET_CURRENT_DISCUSSION: {
      return {
        ...state,
        currentDiscussion: action.currentDiscussion,
      };
    }
    case REMOVE_DISCUSSION: {
      return {
        ...state,
        discussions: state.discussions.filter((discussion) => discussion.chatId !== action.discussionId),
      };
    }
    case SET_CREATING_DISCUSSION: {
      return {
        ...state,
        isCreatingDiscussion: action.value,
      };
    }
    case SET_AVAILABLE_USERS: {
      return {
        ...state,
        availableUsers: action.availableUsers,
      };
    }
    case SET_CURRENT_DISCUSSION_USERS: {
      return {
        ...state,
        currentDiscussion: {
          ...state.currentDiscussion,
          users: action.users,
        },
      };
    }
    case SET_CURRENT_DISCUSSION_MESSAGES: {
      return {
        ...state,
        currentDiscussion: {
          ...state.currentDiscussion,
          messages: action.messages,
        },
      };
    }
    case ADD_MESSAGE_IN_CURRENT_DISCUSSION: {
      return {
        ...state,
        currentDiscussion: {
          ...state.currentDiscussion,
          messages: [...state.currentDiscussion.messages, action.message],
        },
      };
    }
  }
  return state;
};
