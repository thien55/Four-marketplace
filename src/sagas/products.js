import {put, takeLatest} from 'redux-saga/effects';
import ProductsService from '../api/productsService';
import {actionTypes} from '../redux/constants/actionTypes';

const productsService = new ProductsService();
function* getProductsList() {
  try {
    const result = yield productsService.getProducts();
    yield put({type: actionTypes.GET_PRODUCTS_SUCCESS, list: result});
  } catch (e) {
    yield put({type: actionTypes.GET_PRODUCTS_FAIL, list: []});
  }
}

function* getProducts() {
  yield takeLatest('GET_PRODUCTS', getProductsList);
}
export default [getProducts];
