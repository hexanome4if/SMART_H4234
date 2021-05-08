import { SpringWsProvider } from '../../components/spring-ws-provider';
import NotificationProvider from '../../components/notification-provider';


const initNotif = (history) => (dispatch) => {
  SpringWsProvider.getInstance().on('/user/queue/notif', (notif) => {
    dispatch(receiveNotif(notif, history));
  });
};

const receiveNotif = (notif, history) => () => {

  NotificationProvider.showNotification(notif.message, notif.status, notif.duration, notif.cantRemove, notif.buttonTitle, () => {
    history.push(notif.pageAction);
  });
};

export default {
  initNotif,
}
