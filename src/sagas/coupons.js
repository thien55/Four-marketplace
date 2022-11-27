import {put, takeLatest} from 'redux-saga/effects';
import CouponsService from '../api/couponsService';
import MerchantsService from '../api/merchantsService';
import {actionTypes} from '../redux/constants/actionTypes';
import {isEmpty} from 'ramda';

const couponsService = new CouponsService();
const merchantsService = new MerchantsService();
function* applyMerchantOffer(action) {
  try {
    const result = yield couponsService.applyOffer(action.offer);
    const merchant = yield merchantsService.getOffers(
      action.merchantID,
      action.offer.customerID,
    );
    yield put({
      type: actionTypes.APPLY_OFFER_SUCCESS,
      couponApplied: !isEmpty(result),
    });
    yield put({
      type: actionTypes.GET_SEARCH_MERCHANT_OFFERS_SUCCESS,
      selectedMerchant: merchant,
    });
    yield put({
      type: actionTypes.GET_MERCHANT_OFFERS_SUCCESS,
      selectedMerchant: merchant,
    });
    const redeemedOffers = yield couponsService.getAllCustomerOffers(action.offer.customerID);
    yield put({
      type: actionTypes.GET_CUSTOMER_OFFERS_SUCCESS,
      customerOffersList: redeemedOffers,
    });
  } catch (e) {
    yield put({type: actionTypes.APPLY_OFFER_FAIL, couponApplied: false});
  }
}
function* getAllOffers() {
  try {
    const result = yield couponsService.getOffers();
    yield put({
      type: actionTypes.GET_OFFERS_SUCCESS,
      list: result,
    });
  } catch (e) {
    yield put({type: actionTypes.GET_OFFERS_FAIL, list: []});
  }
}
function* getAllFeaturedOffers(action) {
  try {
    const result = yield couponsService.getFeaturedOffers(action.customerId);
    yield put({
      type: actionTypes.GET_FEATURED_OFFERS_SUCCESS,
      featuredList: result,
    });
  } catch (e) {
    yield put({type: actionTypes.GET_FEATURED_OFFERS_FAIL, featuredList: []});
  }
}
function* getAllCustomerOffers(action) {
  try {
    const result = yield couponsService.getAllCustomerOffers(action.customerId);
    yield put({
      type: actionTypes.GET_CUSTOMER_OFFERS_SUCCESS,
      customerOffersList: result,
    });
  } catch (e) {
    yield put({
      type: actionTypes.GET_CUSTOMER_OFFERS_FAIL,
      customerOffersList: [],
    });
  }
}

function* applyOffer() {
  yield takeLatest('APPLY_OFFER', applyMerchantOffer);
}
function* getOffers() {
  yield takeLatest('GET_OFFERS', getAllOffers);
}
function* getCustomerOffers() {
  yield takeLatest('GET_CUSTOMER_OFFERS', getAllCustomerOffers);
}
function* getFeaturedOffers() {
  yield takeLatest('GET_FEATURED_OFFERS', getAllFeaturedOffers);
}

export default [getOffers, applyOffer, getFeaturedOffers, getCustomerOffers];
