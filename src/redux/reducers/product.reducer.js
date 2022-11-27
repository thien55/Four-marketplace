import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  list: [],
  details: null,
};

function productReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SELECTED_PRODUCT: {
      return {
        ...state,
        details: action.product,
      };
    }
    case actionTypes.GET_PRODUCTS_SUCCESS: {
      return {
        ...state,
        list: action.list,
      };
    }
    case actionTypes.GET_PRODUCTS_FAIL: {
      return {
        ...state,
        list: action.list,
      };
    }
    default:
      return state;
  }
}

export default productReducer;
