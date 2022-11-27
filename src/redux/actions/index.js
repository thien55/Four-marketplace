import {actionTypes} from '../constants/actionTypes';
import {equals, isEmpty} from 'ramda';

export function saveValue(value) {
  return {
    type: actionTypes.SAVE_VALUE,
    value,
  };
}
export function createUser(userData) {
  return {
    type: actionTypes.CREATE_USER,
    userData,
  };
}
export function saveUserSub(sub) {
  return {
    type: actionTypes.CREATE_USER_SUCCESS,
    sub,
  };
}
export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
  };
}
export function saveUser(user) {
  return {
    type: actionTypes.SAVE_USER,
    user,
  };
}
export function saveFilters(filters) {
  return {
    type: actionTypes.SAVE_FILTERS,
    filters,
  };
}
export function clearPropertyWorksFlag() {
  return {
    type: actionTypes.FILTER_DONE,
    propertiesFilterWorked: false,
  };
}
export function clearSearchPropertyWorksFlag() {
  return {
    type: actionTypes.SEARCH_FILTER_DONE,
    propertiesFilterWorked: false,
  };
}
export function saveSearchFilters(filters) {
  return {
    type: actionTypes.SAVE_SEARCH_FILTERS,
    filters,
  };
}
export function updateUserProfile(profile) {
  return {
    type: actionTypes.UPDATE_USER,
    profile,
  };
}
export function saveToken(token) {
  return {
    type: actionTypes.SAVE_TOKEN,
    token,
  };
}
export function saveNavigation(stateNavigation) {
  return {
    type: actionTypes.SAVE_NAVIGATION,
    stateNavigation,
  };
}
export function getUser(sub) {
  return {
    type: actionTypes.GET_USER,
    sub,
  };
}
export function getCategories() {
  return {
    type: actionTypes.GET_CATEGORIES,
  };
}
export function getProperties(merchantId) {
  return {
    type: actionTypes.GET_PROPERTIES,
    merchantId,
  };
}
export function getProperty(propertyId) {
  return {
    type: actionTypes.GET_PROPERTY,
    propertyId,
  };
}
export function getFilteredProperties(object) {
  return {
    type: actionTypes.GET_FILTERED_PROPERTIES,
    object,
  };
}
export function getFilteredSearchProperties(object) {
  return {
    type: actionTypes.GET_FILTERED_SEARCH_PROPERTIES,
    object,
  };
}
export function getSearchProperties(merchantId) {
  return {
    type: actionTypes.GET_SEARCH_PROPERTIES,
    merchantId,
  };
}
export function getMerchants() {
  return {
    type: actionTypes.GET_MERCHANTS,
  };
}
export function getProducts() {
  return {
    type: actionTypes.GET_PRODUCTS,
  };
}
export function getOffers() {
  return {
    type: actionTypes.GET_OFFERS,
  };
}
export function displayAuthentication(displayAuthenticationFlow) {
  return {
    type: actionTypes.DISPLAY_AUTHENTICATION_FLOW,
    displayAuthentication: displayAuthenticationFlow,
  };
}
export function getFeaturedOffers(sub) {
  return {
    type: actionTypes.GET_FEATURED_OFFERS,
    customerId: sub,
  };
}
export function getCustomerOffers(sub) {
  return {
    type: actionTypes.GET_CUSTOMER_OFFERS,
    customerId: sub,
  };
}
export function setCategory(category) {
  return {
    type: actionTypes.SELECT_CATEGORY,
    category,
  };
}
export function clearCategory() {
  return {
    type: actionTypes.SELECT_CATEGORY_SUCCESS,
    category: null,
  };
}
export function clearSearchCategory() {
  return {
    type: actionTypes.SEARCH_SELECT_CATEGORY_SUCCESS,
    category: null,
  };
}
export function setSearchCategory(category) {
  return {
    type: actionTypes.SEARCH_SELECT_CATEGORY,
    category,
  };
}
export function setSearchMerchant(merchant) {
  return {
    type: actionTypes.SEARCH_SELECT_MERCHANT,
    merchant,
  };
}
export function setMerchant(merchant) {
  return {
    type: actionTypes.SELECT_MERCHANT,
    merchant,
  };
}
export function setMerchantId(merchantId) {
  return {
    type: actionTypes.SET_MERCHANT_ID,
    merchantId,
  };
}
export function setSearchMerchantId(merchantId) {
  return {
    type: actionTypes.SET_SEARCH_MERCHANT_ID,
    merchantId,
  };
}
export function getMerchantOffers(merchantId, sub) {
  return {
    type: actionTypes.GET_MERCHANT_OFFERS,
    merchantId,
    customerId: sub,
  };
}
export function getSearchMerchantOffers(merchantId, sub) {
  return {
    type: actionTypes.GET_SEARCH_MERCHANT_OFFERS,
    merchantId,
    customerId: sub,
  };
}
export function addToOrder(product) {
  return {
    type: actionTypes.ADD_TO_ORDER,
    product,
  };
}
export function updateOrderItem(product, operator) {
  return {
    type: actionTypes.UPDATE_ORDER,
    product,
    operator,
  };
}
export function deleteOrderItem(product) {
  return {
    type: actionTypes.DELETE_PRODUCT_FROM_ORDER,
    product,
  };
}
export function clearOrder() {
  return {
    type: actionTypes.CLEAR_ORDER,
  };
}
export function setMerchantPaymentMethods(payment, stripeId) {
  return {
    type: actionTypes.SET_PAYMENT,
    payment,
    stripeId,
  };
}
export function getCustomerPayments(stripeId) {
  return {
    type: actionTypes.GET_PAYMENTS,
    stripeId,
  };
}
export function setSelectedProduct(product) {
  const selectedProduct = product;
  if (selectedProduct.options) {
    selectedProduct.requiredOptions = selectedProduct.options.filter(
      (option) => option.required,
    );
    selectedProduct.optionalItems = selectedProduct.options.filter(
      (option) => !option.required,
    );
  }
  return {
    type: actionTypes.SET_SELECTED_PRODUCT,
    product: selectedProduct,
  };
}
export function getOrder() {
  return {
    type: actionTypes.GET_ORDER,
  };
}
export function placeOrder(order) {
  return {
    type: actionTypes.PLACE_ORDER,
    order,
  };
}
export function listOrders(customerId) {
  return {
    type: actionTypes.LIST_ORDERS,
    customerId,
  };
}
export function updateOrderStatus(orders, selectedOrder) {
  const updatedOrders = orders.map((order) => {
    if (order.id === selectedOrder.id) {
      order.status = selectedOrder.status;
    }
    return order;
  });
  return {
    type: actionTypes.UPDATE_CURRENT_ORDER,
    orders: updatedOrders,
  };
}
export function setMerchantOffer(offer, customerId) {
  const selectedOffer = offer;
  const isRedeemed = offer.customerOffers.filter((redemption) =>
  equals(redemption.couponID, offer.id),
);
  selectedOffer.isRedeemed = !isEmpty(isRedeemed);
  return {
    type: actionTypes.SELECT_COUPON,
    offer: selectedOffer,
  };
}
export function setSearchMerchantOffer(offer, customerId) {
  const selectedOffer = offer;
  const isRedeemed = offer.customerOffers.filter((redemption) =>
    equals(redemption.couponID, offer.id),
  );
  selectedOffer.isRedeemed = !isEmpty(isRedeemed);
  return {
    type: actionTypes.SEARCH_SELECT_COUPON,
    offer: selectedOffer,
  };
}
export function applyOffer(offer, merchantID) {
  return {
    type: actionTypes.APPLY_OFFER,
    offer,
    merchantID,
  };
}
export function getShareableLinks() {
  return {
    type: actionTypes.GET_SHAREABLE_LINKS,
  };
}
export function setProperty(property) {
  return {
    type: actionTypes.SELECT_PROPERTY,
    property,
  };
}
export function clearProperty() {
  return {
    type: actionTypes.SELECT_PROPERTY_SUCCESS,
    property: null,
  };
}
export function saveItemToFavorites(itemObject) {
  return {
    type: actionTypes.SAVE_ITEM_TO_FAV,
    itemObject,
  };
}
export function deleteItemFromFavorites({items}) {
  return {
    type: actionTypes.DELETE_ITEM_FROM_FAVORITES,
    items
  };
}
export function getUserFavorites(customerId) {
  return {
    type: actionTypes.GET_FAVORITES,
    customerId,
  };
}
