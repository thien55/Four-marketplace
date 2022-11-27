import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  list: [],
};

function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_FAVORITES_SUCCESS: {
      return {
        ...state,
        list: action.list,
      };
    }
    case actionTypes.GET_FAVORITES_FAIL: {
      return {
        ...state,
        list: action.list,
      };
    }
    default:
      return state;
  }
}

export default favoritesReducer;
