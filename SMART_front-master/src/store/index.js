import { applyMiddleware, createStore } from 'redux';
import { initState } from './definitions';
import reducers from './reducers';
import thunk from 'redux-thunk';
import actions from './actions';

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
