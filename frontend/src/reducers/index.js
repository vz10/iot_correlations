import {combineReducers} from 'redux';

import graphs from './graphs';
import loading from './loading';

export default combineReducers({
  graphs,
  loading
});
