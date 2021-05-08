import RNEventSource from 'react-native-event-source';
import constants from '../constants';

export default class SSE {
  eventSource;
  constructor(userId, token) {
    // this.eventSource = new RNEventSource(`${constants.apiUrl}/wait/${userId}`, {
    //   headers: {
    //     Authorization: token,
    //   },
    // });
    // this.eventSource.addEventListener('message', (msg) => {
    //   console.log('get msg', msg);
    // });
    // this.eventSource.addEventListener('notification', (notif) => {
    //   console.log('get notif', notif);
    // });
  }
}
