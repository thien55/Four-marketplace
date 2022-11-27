import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  profile: null,
  links: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_USER_SUCCESS: {
      return {
        ...state,
        profile: action.profile,
      };
    }
    case actionTypes.GET_USER_FAIL: {
      return {
        ...state,
        profile: null,
      };
    }
    case actionTypes.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        profile: action.profile,
      };
    }
    case actionTypes.UPDATE_USER_FAIL: {
      return {
        ...state,
        profile: null,
      };
    }
    case actionTypes.GET_SHAREABLE_LINKS_SUCCESS: {
      return {
        ...state,
        links: action.links,
      };
    }
    case actionTypes.GET_SHAREABLE_LINKS_FAIL: {
      return {
        ...state,
        links: null,
      };
    }
    default:
      return state;
  }
}

export default userReducer;
