import chat from './screens/chat';
import chatDiscussion from './screens/chat-discussion';
import chatDiscussionSettings from './screens/chat-discussion-settings';
import createChatDiscussion from './screens/create-chat-discussion';
import Dashboard from './screens/dashboard';
import explore from './screens/explore';
import Login from './screens/login';
import modifyHeader from './screens/modify-header';
import ModifyParcours from './screens/modify-parcours';
import Profile from './screens/profile';
import Registration from './screens/registration';
import splash from './screens/splash';
import MyMeetings from './screens/my_meetings';
import VisitProfile from './screens/visit-profile';
import BookMeeting from './screens/book-meeting';
import chatRequest from './screens/chat-request';
import modifyDomaines from './screens/modify-domaines';
import BookMeetingDiscussion from './screens/book-meeting-discussion';
import modifyFaqs from './screens/modify-faqs';

const routes = [
  {
    path: '/',
    component: splash,
    showBottomBar: false,
  },
  {
    path: '/login',
    component: Login,
    showBottomBar: false,
  },
  {
    path: '/registration',
    component: Registration,
    showBottomBar: false,
  },
  {
    path: '/modify-parcours',
    component: ModifyParcours,
    showBottomBar: false,
  },
  {
    path: '/modify-header',
    component: modifyHeader,
    showBottomBar: false,
  },
  {
    path: '/modify-domaines',
    component: modifyDomaines,
    showBottomBar: false
  },
  {
    path: '/modify-faqs',
    component: modifyFaqs,
    showBottomBar:false
  },
  {
    path: '/profile',
    component: Profile,
    bottomBar: {
      title: 'Profil',
      icon: 'account-circle',
      color: '#1abc9c',
    },
    showBottomBar: true,
  },

  {
    path: '/explore',
    component: explore,
    bottomBar: {
      title: 'Explorer',
      icon: 'magnify',
      color: '#2980b9',
    },
    showBottomBar: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    bottomBar: {
      title: 'Accueil',
      icon: 'home',
      color: '#f1c40f',
    },
    showBottomBar: true,
  },
  {
    path: '/chat',
    component: chat,
    bottomBar: {
      title: 'Messagerie',
      icon: 'message',
      color: '#9b59b6',
    },
    showBottomBar: true,
  },
  {
    path: '/chat/create',
    component: createChatDiscussion,
    showBottomBar: false,
  },
  {
    path: '/chat/discussion/:discussion',
    component: chatDiscussion,
    showBottomBar: false,
  },
  {
    path: '/chat/discussion/:discussion/settings',
    component: chatDiscussionSettings,
    showBottomBar: false,
  },
  {
    path: '/meetings',
    component: MyMeetings,
    showBottomBar: true,
  },
  {
    path: '/visit-profile/:id',
    component: VisitProfile,
    showBottomBar: true,
  },
  {
    path: '/book-meeting/:userId',
    component: BookMeeting,
    showBottomBar: true,
  },
  {
    path: '/book-meeting-current-discussion',
    component: BookMeetingDiscussion,
    showBottomBar: false,
  },
  {
    path: '/create-chat-request/:userId',
    component: chatRequest,
    showBottomBar: false,
  },
];

export const getCurrentRoute = (location) => {
  return routes.find((r) => r.path === location.pathname);
};

export default routes;
