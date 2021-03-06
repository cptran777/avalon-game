import { LOGGED_IN, LOGGED_OUT } from '../actions';

const initialState = {
  authenticated: false
};

export default function auth (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        authenticated: true
      };
    case LOGGED_OUT:
      return {
        ...state,
        authenticated: false  
      };
    default:
      return state;
  }
}
