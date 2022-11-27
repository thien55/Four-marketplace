import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  token: null,
  displayAuthentication: false,
  user: null,
  sub: null,
  userData: null,
  stateNavigation: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SAVE_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }
    case actionTypes.DISPLAY_AUTHENTICATION_FLOW: {
      return {
        ...state,
        displayAuthentication: action.displayAuthentication,
      };
    }
    case actionTypes.CREATE_USER_SUCCESS: {
      return {
        ...state,
        sub: action.sub,
      };
    }
    case actionTypes.SET_USER: {
      return {
        ...state,
        userData: action.user,
      };
    }
    case actionTypes.SAVE_USER: {
      return {
        ...state,
        user: action.user,
      };
    }
    case actionTypes.SAVE_NAVIGATION: {
      return {
        ...state,
        stateNavigation: action.stateNavigation,
      };
    }
    default:
      return state;
  }
}

export default authReducer;
