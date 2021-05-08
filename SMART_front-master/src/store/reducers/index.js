import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import suggestions from './suggestions';
import chat from './chat';
import recProfiles from './recProfiles';
import meeting from './meeting';
import visitProfile from './visitProfile';
import search from './search';

export default combineReducers({
  auth,
  profile,
  suggestions,
  chat,
  recProfiles,
  meeting,
  visitProfile,
  search,
});
