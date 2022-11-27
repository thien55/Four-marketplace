import {put, takeLatest} from 'redux-saga/effects';
import OrderService from '../api/orderService';
import {actionTypes} from '../redux/constants/actionTypes';

const orderService = new OrderService();
function* addProductItemToOrder(action) {
  try {
    const cart = yield orderService.addProductItemToOrder(action.product);
    yield put({type: actionTypes.ADD_TO_ORDER_SUCCESS, cart});
  } catch (e) {
    yield put({type: actionTypes.ADD_TO_ORDER_FAIL, message: e.message});
  }
}
function* getOrder() {
  try {
    const cart = yield orderService.getOrder();
    yield put({type: actionTypes.GET_ORDER_SUCCESS, cart});
  } catch (e) {
    yield put({type: actionTypes.GET_ORDER_FAIL, cart: null});
  }
}
function* updateOrderProduct(action) {
  try {
    const cart = yield orderService.updateOrderItem(
      action.product,
      action.operator,
    );
    yield put({type: actionTypes.UPDATE_ORDER_SUCCESS, cart});
  } catch (e) {
    yield put({type: actionTypes.UPDATE_ORDER_FAIL, cart: null});
  }
}
function* deleteOrderProduct(action) {
  try {
    const cart = yield orderService.deleteOrderItem(action.product);
    yield put({type: actionTypes.DELETE_PRODUCT_FROM_ORDER_SUCCESS, cart});
  } catch (e) {
    yield put({type: actionTypes.DELETE_PRODUCT_FROM_ORDER_FAIL, cart: null});
  }
}
function* clearOrder() {
  try {
    yield orderService.clearOrder();
    yield put({type: actionTypes.CLEAR_ORDER_SUCCESS, cart: null});
  } catch (e) {
    yield put({type: actionTypes.CLEAR_ORDER_FAIL, cart: null});
  }
}
function* placeOrder(action) {
  try {
    yield orderService.placeOrder(action.order);
    yield put({type: actionTypes.PLACE_ORDER_SUCCESS});
  } catch (e) {
    yield put({type: actionTypes.PLACE_ORDER_FAIL});
  }
}
function* listOrders(action) {
  try {
    const result = yield orderService.listOrders(action.customerId);
    yield put({type: actionTypes.LIST_ORDERS_SUCCESS, orders: result});
  } catch (e) {
    yield put({type: actionTypes.LIST_ORDERS_FAIL, orders: []});
  }
}
function* addItemToOrder() {
  yield takeLatest('ADD_TO_ORDER', addProductItemToOrder);
}
function* getCurrentOrder() {
  yield takeLatest('GET_ORDER', getOrder);
}
function* updateOrder() {
  yield takeLatest('UPDATE_ORDER', updateOrderProduct);
}
function* deleteProductFromOrder() {
  yield takeLatest('DELETE_PRODUCT_FROM_ORDER', deleteOrderProduct);
}
function* deleteOrder() {
  yield takeLatest('CLEAR_ORDER', clearOrder);
}
function* placeOrderNow(){
  yield takeLatest('PLACE_ORDER', placeOrder);
}
function* getPlacedOrder(){
  yield takeLatest('LIST_ORDERS', listOrders);
}
export default [
  addItemToOrder,
  getCurrentOrder,
  updateOrder,
  deleteProductFromOrder,
  deleteOrder,
  placeOrderNow,
  getPlacedOrder,
];
