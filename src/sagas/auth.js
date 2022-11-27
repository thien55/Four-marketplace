import {put, takeLatest} from 'redux-saga/effects';
import AuthService from '../api/authService';
import {actionTypes} from '../redux/constants/actionTypes';

const authService = new AuthService();
function* createUserAccount(action) {
  try {
    const result = yield authService.createUserAccount(action.userData);
    yield put({type: actionTypes.CREATE_USER_SUCCESS, sub: result});
  } catch (e) {
    yield put({type: actionTypes.CREATE_USER_FAIL, sub: null});
  }
}
/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* createUser() {
  yield takeLatest('CREATE_USER', createUserAccount);
}
export default [createUser];
