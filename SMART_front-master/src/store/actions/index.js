import auth from './auth';
import profile from './profile';
import suggestions from './suggestions';
import chat from './chat';
import recProfiles from './recProfiles';
import meeting from './meeting';
import visitProfile from './visitProfile';
import search from './search';
import notif from './notif';

const init = (history) => (dispatch) => {
  dispatch(auth.init());
  dispatch(chat.initChat(history));
  dispatch(notif.initNotif(history));
};

export default {
  init,
  auth,
  profile,
  suggestions,
  chat,
  recProfiles,
  meeting,
  visitProfile,
  search
};
