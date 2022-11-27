import {put, takeLatest} from 'redux-saga/effects';
import UserService from '../api/userService';
import {actionTypes} from '../redux/constants/actionTypes';

const userService = new UserService();
function* getCurrentUser(action) {
  try {
    const result = yield userService.getCurrentUser(action.sub);
    yield put({type: actionTypes.GET_USER_SUCCESS, profile: result});
  } catch (e) {
    yield put({type: actionTypes.GET_USER_FAIL, profile: null});
  }
}
function* updateUserProfile(action) {
  try {
    const result = yield userService.updateUserProfile(action.profile);
    yield put({type: actionTypes.UPDATE_USER_SUCCESS, profile: result});
  } catch (e) {
    yield put({type: actionTypes.UPDATE_USER_FAIL, profile: null});
  }
}
function* savePaymentMethod(action) {
  try {
    const result = yield userService.createCardToken(
      action.payment,
      action.stripeId,
    );
    yield put({type: actionTypes.SET_PAYMENT_SUCCESS, payment: result});
  } catch (e) {
    yield put({type: actionTypes.SET_PAYMENT_FAIL});
  }
}
function* getPayments(action) {
  try {
    const result = yield userService.getPayments(action.stripeId);
    yield put({type: actionTypes.GET_PAYMENTS_SUCCESS, payments: result});
  } catch (e) {
    yield put({type: actionTypes.GET_PAYMENTS_FAIL});
  }
}
function* getLinks(action) {
  try {
    const result = yield userService.getShareableLinks();
    yield put({type: actionTypes.GET_SHAREABLE_LINKS_SUCCESS, links: result});
  } catch (e) {
    yield put({type: actionTypes.GET_SHAREABLE_LINKS_FAIL, links: null});
  }
}

function* getUser() {
  yield takeLatest('GET_USER', getCurrentUser);
}
function* updateUser() {
  yield takeLatest('UPDATE_USER', updateUserProfile);
}
function* addPaymentMethod() {
  yield takeLatest('SET_PAYMENT', savePaymentMethod);
}
function* getCustomerPayments() {
  yield takeLatest('GET_PAYMENTS', getPayments);
}
function* getShareableLinks() {
  yield takeLatest('GET_SHAREABLE_LINKS', getLinks);
}
export default [
  getUser,
  updateUser,
  addPaymentMethod,
  getCustomerPayments,
  getShareableLinks,
];
