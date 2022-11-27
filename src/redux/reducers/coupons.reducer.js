import {actionTypes} from '../constants/actionTypes';

export const initialState = {
  list: [],
  featuredList: [],
  customerOffersList: [],
  offer: null,
  couponApplied: false,
};

function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SELECT_COUPON: {
      return {
        ...state,
        offer: action.offer,
      };
    }
    case actionTypes.APPLY_OFFER_SUCCESS: {
      return {
        ...state,
        couponApplied: action.couponApplied,
      };
    }
    case actionTypes.GET_OFFERS_SUCCESS: {
      return {
        ...state,
        list: action.list,
      };
    }
    case actionTypes.GET_FEATURED_OFFERS_SUCCESS: {
      return {
        ...state,
        featuredList: action.featuredList,
      };
    }
    case actionTypes.GET_CUSTOMER_OFFERS_SUCCESS: {
      return {
        ...state,
        customerOffersList: action.customerOffersList,
      };
    }
    default:
      return state;
  }
}

export default categoriesReducer;
