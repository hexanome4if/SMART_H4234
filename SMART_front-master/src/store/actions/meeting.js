import moment from 'moment';
import constants from '../../constants';
import {
  REMOVE_RECEIVED_REQUEST, REMOVE_SCHEDULE_MEETING,
  REMOVE_SENT_REQUEST,
  SET_RECEIVED_REQUESTS,
  SET_SCHEDULED_MEETINGS,
  SET_SENT_REQUESTS,
} from '../definitions/meeting';
import NotificationProvider from '../../components/notification-provider';

const getReceivedRequests = () => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/getReceivedMeetings/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    if (response.status === 200) {
      const json = await response.json();
      dispatch({
        type: SET_RECEIVED_REQUESTS,
        receivedRequests: json,
      });
    }
  } catch (err) {
    console.error(err);
    // We should show an error here and maybe put the request back in the list
  }
};

const getSentRequests = () => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/getSentMeetings/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    if (response.status === 200) {
      const json = await response.json();
      dispatch({
        type: SET_SENT_REQUESTS,
        sentRequests: json,
      });
    }
  } catch (err) {
    // We should show an error here and maybe put the request back in the list
  }
};

const getScheduledMeetings = () => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/getPlannedMeetings/${storeState.auth.currentUser.userId}`, {
      method: 'GET',
      headers,
    });
    if (response.status === 200) {
      const json = await response.json();
      dispatch({
        type: SET_SCHEDULED_MEETINGS,
        scheduledMeetings: json,
      });
    }
  } catch (err) {
    // We should show an error here and maybe put the request back in the list
  }
};

const acceptOrRefuseRequest = (meetingId, accept) => async (dispatch, getStoreState) => {
  dispatch({
    type: REMOVE_RECEIVED_REQUEST,
    meetingId,
  })
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  try {
    const response = await fetch(`${constants.apiUrl}/${accept ? 'acceptMeeting' : 'refuseMeeting'}/${storeState.auth.currentUser.userId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        meetingId
      })
    });
    console.log("Accept/Refuse meeting", response.status);
    if (response.status === 200) {
      if (accept) {
        dispatch(getScheduledMeetings());
      } else {
        NotificationProvider.showNotification('Demande refusée', 'success', 5);
      }
    }
  } catch (e) {

  }
};

const createMeeting = (meetingLabel, date, otherUserId) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  console.log(moment(date).format('YYYY-MM-DDTHH:mm'));
  console.log(meetingLabel);
  console.log("other user id", otherUserId);
  const response = await fetch(
    `${constants.apiUrl}/arrangeMeeting/${storeState.auth.currentUser.userId}/${otherUserId}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        label: meetingLabel,
        date: moment(date).format('YYYY-MM-DDTHH:mm'),
      }),
    },
  );
  console.log('Create meeting', response.status);
  NotificationProvider.showNotification('Rendez-vous créé', 'success', 5);
};

const createMeetingForCurrentDiscussion = (meetingLabel, date) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const discussion = storeState.chat.currentDiscussion;
  if (!discussion) return;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);

  const users = discussion.participants.filter(p => p.userId !== storeState.auth.currentUser.userId);
  if (!users.length) return;

  try {
    const response = await fetch(
      `${constants.apiUrl}/arrangeMeeting/${storeState.auth.currentUser.userId}/${users[0].userId}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          label: meetingLabel,
          date: moment(date).format('YYYY-MM-DDTHH:mm'),
        }),
      },
    );
    console.log('Arrange meeting for discussion', response.status);
    if (response.status === 200) {
      const json = await response.json();
      for (let i = 1; i < users.length; ++i) {
        await fetch(`${constants.apiUrl}/addParticipantMeeting/${json.meetingId}/${users[i].userId}`, {
          method: 'POST',
          headers,
        });
      }
      NotificationProvider.showNotification('Rendez-vous créé', 'success', 5);
    }
  } catch (e) {
    console.error(e);
  }
};

const cancelMeeting = (meetingId) => async (dispatch, getStoreState) => {
  const storeState = getStoreState();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', storeState.auth.userToken);
  dispatch({
    type: REMOVE_SENT_REQUEST,
    meetingId,
  });
  dispatch({
    type: REMOVE_SCHEDULE_MEETING,
    meetingId,
  })
  try {
    const response = await fetch(`${constants.apiUrl}/cancelMeeting/${storeState.auth.currentUser.userId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        meetingId
      })
    });
    NotificationProvider.showNotification('Rendez-vous annulé', 'success', 5);
    console.log("Cancel", response.status);
  } catch (e) {

  }
};

export default {
  getReceivedRequests,
  getSentRequests,
  getScheduledMeetings,
  acceptOrRefuseRequest,
  createMeeting,
  createMeetingForCurrentDiscussion,
  cancelMeeting,
};
