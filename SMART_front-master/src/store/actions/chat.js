import moment from 'moment';
import { SpringWsProvider } from '../../components/spring-ws-provider';
import constants from '../../constants';
import {
  ADD_MESSAGE_IN_CURRENT_DISCUSSION,
  FETCH_DISCUSSIONS,
  GOT_DISCUSSIONS,
  GOT_REQUESTS,
  REMOVE_REQUEST,
  SET_AVAILABLE_USERS,
  SET_CREATING_DISCUSSION,
  SET_CURRENT_DISCUSSION,
  SET_CURRENT_DISCUSSION_MESSAGES,
  SET_CURRENT_DISCUSSION_USERS,
} from '../definitions/chat';
import { getAvatar } from './user';
import NotificationProvider from '../../components/notification-provider';

const initChat = (history) => async (dispatch, getStoreState) => {
  if (!SpringWsProvider.getInstance().isConnected) {
    await new Promise((resolve) => SpringWsProvider.getInstance().eventEmitter.on('connect', resolve));
  }
  SpringWsProvider.getInstance().on('/user/queue/chat/message', (message) => {
    dispatch(receiveMessage(message, history));
  });
};

// Done
const getRequests = () => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  let requests = [];
  try {
    const response = await fetch(`${constants.apiUrl}/chat/demande/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    if (response.status === 200) {
      const json = await response.json();
      requests = json;
    }
  } catch (e) {
    console.error(e);
    // We should show an error here
  }
  dispatch({
    type: GOT_REQUESTS,
    requests,
  });
};

// Done
const getDiscussions = () => async (dispatch, getStoreState) => {
  dispatch({
    type: FETCH_DISCUSSIONS,
  });
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  let discussions = [];
  try {
    const response = await fetch(`${constants.apiUrl}/chat/byUser/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    if (response.status === 200) {
      const json = await response.json();
      discussions = json;
    }
  } catch (e) {
    console.error(e);
    // We should show an error here
  }
  dispatch({
    type: GOT_DISCUSSIONS,
    discussions,
  });
};

// Done
const acceptOrRefuseRequest = (request, accept) => async (dispatch, getStoreState) => {
  dispatch({
    type: REMOVE_REQUEST,
    requestId: request.chatId,
  });
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const participantId = request.participants.find((p) => p.userId === storeState.auth.currentUser.userId)
      ?.participantId;
    const response = await fetch(
      `${constants.apiUrl}/participant/${accept ? 'accepterChat' : 'refuserChat'}/${participantId}`,
      {
        method: 'PUT',
        headers,
      },
    );
    console.log('Accept/Refuse chat request', response.status);
    if (response.status === 200) {
      if (accept) {
        dispatch(getDiscussions());
      } else {
        NotificationProvider.showNotification('Demande refusée', 'success', 5);
      }
    }
  } catch (err) {
    console.log(err);
    // We should show an error here and maybe put the request back in the list
  }
};

// Done
const openDiscussion = (discussionId) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  console.log('Open discussion');
  console.log(discussionId);
  console.log(storeState.chat);
  const discussion = storeState.chat.discussions?.find((d) => d.chatId == discussionId);
  if (!discussion) return;
  console.log('Discussion found');

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  dispatch({
    type: SET_CURRENT_DISCUSSION,
    currentDiscussion: discussion,
  });
  try {
    const participant = discussion.participants.find((p) => p.userId === storeState.auth.currentUser.userId);
    participant.lastOpen = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    const participantId = participant?.participantId;
    const response = await fetch(`${constants.apiUrl}/participant/ouvrirConv/${participantId}`, {
      method: 'PUT',
      headers,
    });
    console.log('Open discussion', response.status);
    if (response.status === 200) {
      const json = await response.json();
      for(let i = 0; i < json.length; ++i) {
        json[i].avatar = await getAvatar(json[i].userId, storeState.auth.userToken);
      }
      dispatch({
        type: SET_CURRENT_DISCUSSION_USERS,
        users: json,
      });
      const res = await fetch(`${constants.apiUrl}/participant/getMessages/${participantId}`, {
        method: 'GET',
        headers,
      });
      console.log('Get messages', res.status);
      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
        dispatch({
          type: SET_CURRENT_DISCUSSION_MESSAGES,
          messages: json,
        });
      }
    }
  } catch (err) {
    // We should show an error here and maybe put the request back in the list
  }
};

const closeDiscussion = () => async (dispatch, getStoreState) => {
  dispatch({
    type: SET_CURRENT_DISCUSSION,
    currentDiscussion: null,
  });
};

const sendMessage = (content) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const chatId = storeState.chat.currentDiscussion?.chatId;
  if (!chatId) return;
  // Send the message here
  SpringWsProvider.getInstance().send(`chat/${chatId}`, {
    type: 'TEXT',
    content,
  });
};

const receiveMessage = (message, history) => async (dispatch, getStoreState) => {
  // Add message in the list here
  const storeState = getStoreState();
  console.log(message);
  if (storeState.chat.currentDiscussion && storeState.chat.currentDiscussion.chatId == message.chatId) {
    dispatch({
      type: ADD_MESSAGE_IN_CURRENT_DISCUSSION,
      message,
    });
  } else {
    NotificationProvider.showNotification('Nouveau message "' + message.content + '"', 'info', 5, false, 'Chat', () => {
      console.log('Open chat ' + message.chatId);
      console.log(history);
      history.push('/chat/discussion/' + message.chatId);
    });
  }
};

// Done
const leaveDiscussion = (chatId, history) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/chat/${chatId}/${storeState.auth.currentUser.userId}`, {
      method: 'DELETE',
      headers,
    });
    console.log('Leave discussion', response.status);
    if (response.status === 200) {
      dispatch(getDiscussions());
      NotificationProvider.showNotification('Discussion supprimée', 'success', 5);
      history.replace('/chat');
    }
  } catch (err) {
    // We should show an error here and maybe put the request back in the list
  }
};

// Done
const createDiscussion = (discussionName, participantsId) => async (dispatch, getStoreState) => {
  dispatch({
    type: SET_CREATING_DISCUSSION,
    value: true,
  });
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        // lastMessageDate: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        label: discussionName,
      }),
    });
    console.log('Create chat', response.status);
    if (response.status === 200) {
      const chat = await response.json();
      await fetch(`${constants.apiUrl}/chat/addUserChat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          chatId: chat.chatId,
          userId: storeState.auth.currentUser.userId,
          accepted: true,
          lastOpen: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
        }),
      });
      for (let userId of participantsId) {
        await fetch(`${constants.apiUrl}/chat/addUserChat`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            chatId: chat.chatId,
            userId: userId,
            accepted: false,
            lastOpen: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
          }),
        });
      }
      NotificationProvider.showNotification('Discussion créée', 'success', 5);
    }
  } catch (err) {
    // We should show an error here and maybe put the request back in the list
  }
  dispatch({
    type: SET_CREATING_DISCUSSION,
    value: false,
  });
};

// Done
const getAvailableUsers = () => async (dispatch, getStoreState) => {
  const storeState = getStoreState();

  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', storeState.auth.userToken);
    const response = await fetch(`${constants.apiUrl}/participants/user/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    console.log('Get available user', response.status);
    if (response.status === 200) {
      const json = await response.json();
      for(let i = 0; i < json.length; ++i) {
        json[i].avatar = await getAvatar(json[i].userId, storeState.auth.userToken);
      }
      dispatch({
        type: SET_AVAILABLE_USERS,
        availableUsers: json,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export default {
  initChat,
  getAvailableUsers,
  getRequests,
  getDiscussions,
  acceptOrRefuseRequest,
  openDiscussion,
  closeDiscussion,
  sendMessage,
  receiveMessage,
  leaveDiscussion,
  createDiscussion,
};
