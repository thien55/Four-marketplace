import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  cart: null,
  orders: [],
};

function orderReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_ORDER_SUCCESS: {
      return {
        ...state,
        cart: action.cart,
      };
    }
    case actionTypes.ADD_TO_ORDER_SUCCESS: {
      return {
        ...state,
        cart: action.cart,
      };
    }
    case actionTypes.UPDATE_ORDER_SUCCESS: {
      return {
        ...state,
        cart: action.cart,
      };
    }
    case actionTypes.DELETE_PRODUCT_FROM_ORDER_SUCCESS: {
      return {
        ...state,
        cart: action.cart,
      };
    }
    case actionTypes.CLEAR_ORDER_SUCCESS: {
      return {
        ...state,
        cart: action.cart,
      };
    }
    case actionTypes.LIST_ORDERS_SUCCESS: {
      return {
        ...state,
        orders: action.orders,
      };
    }
    case actionTypes.UPDATE_CURRENT_ORDER: {
      return {
        ...state,
        orders: action.orders,
      };
    }
    default:
      return state;
  }
}

export default orderReducer;
