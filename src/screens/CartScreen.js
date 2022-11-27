import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-simple-toast';
import {add, find, propEq, equals, isEmpty, isNil, toUpper} from 'ramda';
import Header from '../components/Header';
import generalStyles from '../styles/styles';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';
import LineDivider from '../components/LineDivider';
import ProductIncrementor from '../components/ProductIncrementor';
import CallToActionText from '../components/CallToActionText';
import {
  getOrder,
  getUser,
  updateOrderItem,
  getCategories,
  setMerchant,
  deleteOrderItem,
  clearOrder,
  getCustomerPayments,
  placeOrder,
} from '../redux/actions';
import ModalContainer from '../components/ModalContainer';
import Tabs from '../components/Tabs';
import { useTabsValue } from '../hooks';

const styles = StyleSheet.create({
  sectionHeaderStyle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
    color: '#404852',
  },
  bigRedPriceStyle: {
    marginLeft: 5,
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
    color: '#E11B22',
  },
  totalPriceStyle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    color: '#404852',
  },
  sectionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#404852',
  },
  optionTitleStyle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 14,
    color: '#404852',
  },
  optionTextStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#404852',
  },
  sectionSpacingStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultMessageStyle: {
    width: Dimensions.get('window').width / 1.58,
    marginTop: 20,
    textAlign: 'center',
  },
  cardNumberLabelStyle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    color: '#404852',
    opacity: 0.75,
  },
  cardHolderStyle: {
    color: '#404852',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 5,
    opacity: 0.75,
  },
  lineStyle: {
    borderColor: '#D4D4E4',
    borderWidth: 1,
    width: Dimensions.get('window').width / 1.1,
    marginVertical: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  deliveryTextStyle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#404852',
    marginLeft: 10,
  },
});
const tabs = [
  {
    title: 'Pick up',
    value: 'pickup',
  },
  {
    title: 'Delivery',
    value: 'delivery',
  },
];
function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order.cart);
  const profile = useSelector((state) => state.user.profile);
  const categories = useSelector((state) => state.categories.list);
  const sub = useSelector((state) => state.auth.sub);
  const merchantPayments = useSelector((state) => state.merchants.payments);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [payment, setMerchantPaymentMethod] = useState(null);
  const tab = useTabsValue('pickup');
  useEffect(() => {
    dispatch(getOrder());
    dispatch(getUser(sub));
    dispatch(getCategories());
  }, [dispatch, sub, profile]);
  useEffect(() => {
    if (order) {
      let total = 0;
      order.products.forEach(
        (product) => (total += product.totalPrice * product.amount),
      );
      setTotalPrice(total.toFixed(2));
    }
  }, [order]);
  const incrementAmount = (product) => {
    dispatch(updateOrderItem(product, 'increment'));
  };
  const decrementAmount = (product) => {
    dispatch(updateOrderItem(product, 'decrement'));
  };
  const deleteProduct = (product) => {
    dispatch(deleteOrderItem(product));
  };
  const navigateToMerchantScreen = () => {
    const category = find(propEq('name', order.category))(categories);
    const selectedItem = category.merchants.items.filter(
      (item) => item.merchant.name === order.merchant,
    );
    selectedItem[0].merchant.category = category.name;
    dispatch(setMerchant(selectedItem[0].merchant));
    navigation.navigate('Merchant');
  };
  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all the products from your cart?',
      [
        {
          text: 'Clear',
          onPress: () => dispatch(clearOrder()),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };
  const displayCardModal = () => {
    dispatch(getCustomerPayments(profile.stripeID));
    setCardModalVisible(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header>
          <View style={generalStyles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: 40, height: 30}}>
              <View style={{marginLeft: 20}}>
                <Image source={require('../static/icons/back-button.png')} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={generalStyles.headerStyle}>Your Order</Text>
            </View>
            <View />
          </View>
        </Header>
      ),
    });
  }, [navigation]);
  const placeOrderNow = () => {
    const products = [];
    order.products.forEach((product) => {
      products.push({
        productID: product.productId,
        name: product.name,
        amount: product.amount,
        price: product.totalPrice,
        buyer: product.buyer,
        specialNotes: product.specialNotes,
        selectedOptions: JSON.stringify(product.selectedOptions),
      });
    });
    const orderObject = {
      merchantID: order.merchantID,
      customerID: profile.id,
      paymentMethodID: payment.id,
      stripeID: profile.stripeID,
      status: 'PENDING',
      type: toUpper(tab.value),
      orderTotal: equals(tab.value, 'delivery')
        ? add(totalPrice, 5.25).toFixed(2)
        : totalPrice,
      products,
    };
    dispatch(placeOrder(orderObject));
    Toast.show('Your order has been placed.');
  };
  const onTabSelection = (selectedTab) => {
    tab.selectTab(selectedTab);
    if (selectedTab === 'delivery') {
      Alert.alert('Delivery functionality coming soon.');
    }
  };
  const selectPaymentMethod = (merchantPaymentMethod) => {
    if (equals(merchantPaymentMethod, payment)) {
      setMerchantPaymentMethod(null);
    } else {
      setMerchantPaymentMethod(merchantPaymentMethod);
    }
  };
  const navigateToUserProfile = () => {
    setCardModalVisible(false);
    navigation.navigate('Profile', {comingFromCart: true});
  };
  return (
    <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
      <View style={generalStyles.screenContainer}>
        <ModalContainer
          modalVisible={cardModalVisible}
          hideModal={() => setCardModalVisible(false)}>
          <TouchableOpacity
            onPress={() => setCardModalVisible(false)}
            style={{alignSelf: 'flex-end'}}>
            <Image source={require('../static/icons/close.png')} />
          </TouchableOpacity>
          <Text style={generalStyles.headerStyle}>Payment Methods</Text>
          <ScrollView>
            {merchantPayments &&
              merchantPayments.map((merchantPayment, paymentIndex) => (
                <View
                  key={paymentIndex}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    value={equals(merchantPayment, payment)}
                    onValueChange={() => selectPaymentMethod(merchantPayment)}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.cardNumberLabelStyle}>
                      {merchantPayment.card.brand} {merchantPayment.card.last4}
                    </Text>
                    <Text style={styles.cardHolderStyle}>
                      {merchantPayment.billing_details.name}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
          <CallToActionText onPress={navigateToUserProfile} text="Add Payment Method" />
        </ModalContainer>
        {order && profile ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginHorizontal: 10, alignItems: 'center'}}>
              <View style={{alignSelf: 'flex-start', marginLeft: 15}}>
                
              </View>
              <LineDivider lineStyle={styles.lineStyle} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('../static/icons/delivery-type.png')} />
                <Text style={styles.deliveryTextStyle}>Delivery Type</Text>
              </View>
              <Tabs
                tabs={tabs}
                onTabSelection={onTabSelection}
                selected={tab.value}
              />
              <FormContainer
                formContainer={{
                  marginLeft: 10,
                  width: '90%',
                  marginVertical: 10,
                }}>
                {order.products.map((product, productIndex) => (
                  <View key={productIndex}>
                    <View style={styles.sectionSpacingStyle}>
                      <SaverImage
                        imageContainer={{
                          width: Dimensions.get('window').width / 5,
                        }}
                        imageStyle={generalStyles.imageStyle}
                        imageKey={product.image.key}
                      />
                      <View>
                        <Text
                          style={[
                            generalStyles.orderHeaderStyle,
                            {marginBottom: 5},
                          ]}>
                          {product.name}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={generalStyles.priceStyle}>
                            ${product.price}
                          </Text>
                          <ProductIncrementor
                            number={product.amount}
                            disabled={product.amount === 1}
                            increment={() => incrementAmount(product)}
                            decrement={() => decrementAmount(product)}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => deleteProduct(product)}>
                        <Image
                          source={require('../static/icons/x.png')}
                          style={{width: 20, height: 20}}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      {product.selectedOptions &&
                        product.selectedOptions.map((item, itemIndex) => (
                          <View key={itemIndex}>
                            {item.options && !isEmpty(item.options) && (
                              <View style={{marginVertical: 3}}>
                                <Text style={styles.optionTitleStyle}>
                                  {item.section}
                                </Text>
                                {item.options &&
                                  item.options.map((option, optionIndex) => (
                                    <View
                                      style={{flexDirection: 'row'}}
                                      key={optionIndex}>
                                      <Text style={styles.optionTextStyle}>
                                        {option.name}
                                      </Text>
                                      {!equals(option.price, 0) && (
                                        <Text
                                          style={[
                                            styles.optionTextStyle,
                                            {marginLeft: 5},
                                          ]}>
                                          ${option.price.toFixed(2)}
                                        </Text>
                                      )}
                                    </View>
                                  ))}
                              </View>
                            )}
                          </View>
                        ))}
                      {!isEmpty(product.specialNotes) && (
                        <>
                          <Text style={styles.optionTitleStyle}>
                            Special Notes*
                          </Text>
                          <Text style={styles.optionTextStyle}>
                            {product.specialNotes}
                          </Text>
                        </>
                      )}
                      {!isEmpty(product.buyer) && (
                        <>
                          <Text style={styles.optionTitleStyle}>For:</Text>
                          <Text style={styles.optionTextStyle}>
                            {product.buyer}
                          </Text>
                        </>
                      )}
                    </View>
                    <LineDivider lineStyle={generalStyles.lineStyle} />
                  </View>
                ))}
                <CallToActionText
                  onPress={navigateToMerchantScreen}
                  text="Add More Products"
                  textContainer={{alignItems: 'center'}}
                />
              </FormContainer>
              {equals(tab.value, 'delivery') && (
                <FormContainer
                  formContainer={{
                    marginLeft: 10,
                    width: '85%',
                    marginVertical: 10,
                  }}>
                  <View
                    style={{
                      marginLeft: 5,
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                    }}>
                    <Image source={require('../static/icons/black-pin.png')} />
                    <Text style={[styles.sectionHeaderStyle, {marginLeft: 5}]}>
                      Delivery address
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={styles.sectionText}>
                      {profile.address
                        ? profile.address[0].street
                        : 'No address provided'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sectionSpacingStyle,
                      {
                        marginVertical: 10,
                      },
                    ]}>
                    <Text style={styles.sectionText}>
                      {profile.address
                        ? profile.address[0].city
                        : 'No city provided'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => Alert.alert('edit address')}>
                      <Image source={require('../static/icons/edit.png')} />
                    </TouchableOpacity>
                  </View>
                </FormContainer>
              )}
              <FormContainer
                formContainer={{
                  marginLeft: 10,
                  width: '85%',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    marginLeft: 5,
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <Image source={require('../static/icons/order.png')} />
                  <Text style={[styles.sectionHeaderStyle, {marginLeft: 5}]}>
                    Your Order
                  </Text>
                </View>
                <View
                  style={[
                    styles.sectionSpacingStyle,
                    {
                      marginTop: 10,
                    },
                  ]}>
                  <Text style={styles.sectionText}>Basket Charges</Text>
                  <Text style={styles.sectionText}>{`${totalPrice}`}</Text>
                </View>
                {equals(tab.value, 'delivery') && (
                  <View
                    style={[
                      styles.sectionSpacingStyle,
                      {
                        marginTop: 10,
                      },
                    ]}>
                    <Text style={styles.sectionText}>Delivery Charges</Text>
                    <Text style={styles.sectionText}>$5.25</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.sectionSpacingStyle,
                    {
                      marginVertical: 10,
                    },
                  ]}>
                  <Text style={styles.totalPriceStyle}>
                    Total Amount Payable
                  </Text>
                  <Text style={styles.bigRedPriceStyle}>
                    {equals(tab.value, 'delivery')
                      ? `${add(totalPrice, 5.25).toFixed(2)}`
                      : totalPrice}
                  </Text>
                </View>
              </FormContainer>
              <FormContainer
                formContainer={{
                  marginLeft: 10,
                  width: '85%',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginLeft: 5,
                  }}>
                  <Image source={require('../static/icons/offer.png')} />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.sectionHeaderStyle}>
                      Discount Coupon
                    </Text>
                    <Text style={styles.sectionText}>1 available</Text>
                    <CallToActionText
                      onPress={() => Alert.alert('use now')}
                      text="use now"
                    />
                  </View>
                </View>
              </FormContainer>
              <FormContainer
                formContainer={{
                  marginLeft: 10,
                  width: '85%',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginLeft: 5,
                  }}>
                  <Image
                    source={require('../static/icons/cards.png')}
                    style={{alignSelf: 'flex-start'}}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.sectionHeaderStyle}>
                      Choose Payment Method
                    </Text>
                    {payment && (
                      <>
                        <Text style={styles.cardNumberLabelStyle}>
                          {payment.card.brand} {payment.card.last4}
                        </Text>
                        <Text style={styles.cardHolderStyle}>
                          {payment.billing_details.name}
                        </Text>
                      </>
                    )}
                    <CallToActionText
                      onPress={displayCardModal}
                      text="Choose"
                    />
                  </View>
                </View>
              </FormContainer>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button
                text="Place order now"
                disabled={isNil(payment) || isEmpty(order.products)}
                buttonStyle={
                  isNil(payment) || isEmpty(order.products)
                    ? [generalStyles.buttonStyle, {opacity: 0.75}]
                    : generalStyles.buttonStyle
                }
                textStyle={generalStyles.buttonTextStyle}
                navigateTo={placeOrderNow}
              />
              <TouchableOpacity
                onPress={clearCart}
                style={{marginVertical: 10}}>
                <Text style={styles.sectionText}>Clear my cart</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Image source={require('../static/images/cart-order.png')} />
            <Text
              style={[styles.sectionHeaderStyle, styles.defaultMessageStyle]}>
              You don't have products in your cart
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default CartScreen;
