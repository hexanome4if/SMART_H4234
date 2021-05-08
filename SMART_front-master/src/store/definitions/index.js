import { initAuthState } from './auth';
import { initChatState } from './chat';
import { initProfile } from './profile';
import { initSuggestions } from './suggestions';
import { initRecProfiles } from './recProfiles';
import { initMeetingState } from './meeting';
import { initVisitProfile } from './visitProfile';
import { initSearch } from './search';

export const initState = () => ({
  auth: initAuthState(),
  profile: initProfile(),
  suggestions: initSuggestions(),
  chat: initChatState(),
  recProfiles: initRecProfiles(),
  meeting: initMeetingState(),
  visitProfile: initVisitProfile(),
  search: initSearch(),
});
