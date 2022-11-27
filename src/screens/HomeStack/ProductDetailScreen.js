import React, {useLayoutEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import CheckBox from '@react-native-community/checkbox';
import generalStyles from '../../styles/styles';
import Header from '../../components/Header';
import LineDivider from '../../components/LineDivider';
import ProductIncrementor from '../../components/ProductIncrementor';
import Button from '../../components/Button';
import {useInputValue} from '../../hooks';
import {equals, find, propEq, includes, isEmpty} from 'ramda';
import {addToOrder} from '../../redux/actions';

const styles = StyleSheet.create({
  optionLineStyle: {
    borderColor: '#D4D4E4',
    borderWidth: 0.3,
    width: Dimensions.get('window').width / 1.1,
    marginVertical: 10,
    marginRight: 25,
  },
  optionTextStyle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#5C6269',
  },
  optionPriceStyle: {
    color: '#3D3E3E',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    marginLeft: 5,
  },
  recommendationTextStyle: {
    color: '#5E0407',
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    width: Dimensions.get('window').width / 1.2,
    marginVertical: 10,
  },
  incrementorContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    borderRadius: 26,
    borderWidth: 1,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    fontFamily: 'Montserrat-Regular',
    color: '#404852',
    fontSize: 15,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  statusStyle: {
    backgroundColor: '#F3F3F3',
    borderRadius: 36,
    width: 95,
    height: 20,
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15,
  },
  inputContainer: {
    borderColor: '#D9D9D9',
    borderWidth: 1,
    backgroundColor: '#FBFBFB',
    height: 80,
    marginRight: 20,
    marginVertical: 10,
  },
  inputStyle: {
    fontFamily: 'Montserrat-Regular',
    color: '#5C6269',
    fontSize: 12,
    height: 70,
    marginLeft: 10,
  },
  callToActionStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -20,
    left: 0,
    marginVertical: 20,
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#DBDBE7',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  decrementButtonStyle: {borderRadius: 10, width: 15, height: 15},
});

function ProductDetailScreen() {
  const productDetails = useSelector((state) => state.product.details);
  const order = useSelector((state) => state.order.cart);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(productDetails.price);
  const specialNotes = useInputValue('');
  const buyer = useInputValue('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header>
          <View style={[generalStyles.headerContainer, {marginHorizontal: 17}]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: 40, height: 30}}>
              <View style={{marginLeft: 20}}>
                <Image source={require('../../static/icons/back-button.png')} />
              </View>
            </TouchableOpacity>
            <View style={{width: Dimensions.get('window').width / 2.2}}>
              <Text style={generalStyles.headerStyle}>Product details</Text>
            </View>
            {/*<View>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <Image source={require('../../static/icons/shopping.png')} />
              </TouchableOpacity>
              {order && order.products.length > 0 && (
                <View style={generalStyles.iconContainer}>
                  <Text style={generalStyles.iconTextStyle}>
                    {order.products.length}
                  </Text>
                </View>
              )}
              </View>*/}
          </View>
        </Header>
      ),
    });
  }, [navigation, productDetails, order]);

  const addToSelectedOptions = (section, limit, selectedOption) => {
    let newSelectedSections = [];
    let updatedPrice = parseFloat(totalPrice);
    if (selectedSections.length === 0) {
      updatedPrice += selectedOption.price;
      setTotalPrice(updatedPrice.toFixed(2));
      newSelectedSections.push({
        section,
        limit,
        options: [selectedOption],
      });
    } else if (find(propEq('section', section))(selectedSections)) {
      newSelectedSections = selectedSections.map((element) => {
        if (equals(element.section, section)) {
          if (find(propEq('name', selectedOption.name))(element.options)) {
            updatedPrice -= selectedOption.price;
            setTotalPrice(updatedPrice.toFixed(2));
            element.options = element.options.filter(
              (option) => !equals(selectedOption.name, option.name),
            );
          } else if (
            element.limit > 1 &&
            element.options.length < element.limit
          ) {
            updatedPrice += selectedOption.price;
            setTotalPrice(updatedPrice.toFixed(2));
            element.options = [...element.options, selectedOption];
          } else if (equals(element.limit, 1)) {
            const chosenSection = find(propEq('section', section))(
              selectedSections,
            );
            if (chosenSection && chosenSection.options.length > 0) {
              updatedPrice -= chosenSection.options[0].price;
            }
            updatedPrice += selectedOption.price;
            setTotalPrice(updatedPrice.toFixed(2));
            element.options = [selectedOption];
          }
        }
        return element;
      });
    } else {
      updatedPrice += selectedOption.price;
      setTotalPrice(updatedPrice.toFixed(2));
      newSelectedSections = [
        ...selectedSections,
        {
          section,
          limit,
          options: [selectedOption],
        },
      ];
    }
    const newSelectedOptions = [];
    newSelectedSections.forEach((item) => {
      item.options.forEach((option) => {
        newSelectedOptions.push(`${option.name}${option.price}`);
      });
    });
    setSelectedOptions(newSelectedOptions);
    setSelectedSections(newSelectedSections);
  };
  const updatePrice = (operation) => {
    let newAmount = amount;
    if (equals(operation, 'increment')) {
      newAmount += 1;
    } else {
      newAmount -= 1;
    }
    setAmount(newAmount);
  };
  const addToCart = () => {
    if (order && !equals(productDetails.merchantID, order.merchantID)) {
      Toast.show('You have a pending order');
      return;
    }
    const productToAdd = {
      ...productDetails,
      productId: productDetails.id,
      totalPrice,
      selectedOptions: selectedSections,
      specialNotes: specialNotes.value,
      buyer: buyer.value,
      amount: amount,
      category: productDetails.category,
      merchant: productDetails.merchant,
      logo: productDetails.logo,
      id: Math.random(),
    };
    dispatch(addToOrder(productToAdd));
    Toast.show('Product added to cart');
  };
  const hideCheckbox = (optionalItem, item) => {
    if (optionalItem.limit === 1) {
      return false;
    } else if (
      !isEmpty(selectedSections) &&
      find(propEq('section', optionalItem.label))(selectedSections) &&
      find(propEq('section', optionalItem.label))(selectedSections).options
        .length === optionalItem.limit
    ) {
      if (includes(`${item.name}${item.price}`, selectedOptions)) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };
  return (
    <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{marginBottom: 80}}>
          <View style={{marginVertical: 10, alignItems: 'center'}}>
          </View>
          <View style={{justifyContent: 'flex-start', marginLeft: 30}}>
            <Text style={generalStyles.productTitleStyle}>
              {productDetails.name}
            </Text>
            <Text style={generalStyles.productDescriptionStyle}>
              {productDetails.description}
            </Text>
            <LineDivider lineStyle={generalStyles.productLineStyle} />
            {productDetails.requiredOptions &&
              productDetails.requiredOptions.length > 0 &&
              productDetails.requiredOptions.map(
                (requiredOption, requiredOptionIndex) => (
                  <View key={requiredOptionIndex} style={{marginVertical: 10}}>
                    <View style={styles.sectionContainer}>
                      <Text style={generalStyles.productTitleStyle}>
                        {requiredOption.label}
                      </Text>
                      <View style={styles.statusStyle}>
                        <Text style={styles.optionTextStyle}>Required</Text>
                      </View>
                    </View>
                    <Text style={generalStyles.productDescriptionStyle}>
                      {`(Must pick ${requiredOption.limit})`}
                    </Text>
                    {requiredOption.items.map((item, itemIndex) => (
                      <View key={itemIndex}>
                        <LineDivider
                          lineStyle={[
                            generalStyles.productLineStyle,
                            {opacity: 0.5},
                          ]}
                        />
                        <View style={styles.optionContainer}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.optionTextStyle}>
                              {item.name}
                            </Text>
                            {item.price > 0 && (
                              <Text
                                style={
                                  styles.optionPriceStyle
                                }>{`+ $${item.price.toFixed(2)}`}</Text>
                            )}
                          </View>
                          <CheckBox
                            onTintColor="transparent"
                            onFillColor="#5C6269"
                            onCheckColor="#FFFFFF"
                            value={includes(
                              `${item.name}${item.price}`,
                              selectedOptions,
                            )}
                            onValueChange={() =>
                              addToSelectedOptions(
                                requiredOption.label,
                                requiredOption.limit,
                                item,
                              )
                            }
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                ),
              )}
            {productDetails.optionalItems &&
              productDetails.optionalItems.length > 0 &&
              productDetails.optionalItems.map(
                (optionalItem, optionalItemIndex) => (
                  <View key={optionalItemIndex} style={{marginVertical: 10}}>
                    <View style={styles.sectionContainer}>
                      <Text style={generalStyles.productTitleStyle}>
                        {optionalItem.label}
                      </Text>
                      <View style={styles.statusStyle}>
                        <Text style={styles.optionTextStyle}>Optional</Text>
                      </View>
                    </View>
                    <Text style={generalStyles.productDescriptionStyle}>
                      {`(Select maximum ${optionalItem.limit} options)`}
                    </Text>
                    {optionalItem.items.map((item, itemIndex) => (
                      <View key={itemIndex}>
                        <LineDivider
                          lineStyle={[
                            generalStyles.productLineStyle,
                            {opacity: 0.5},
                          ]}
                        />
                        <View style={styles.optionContainer}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.optionTextStyle}>
                              {item.name}
                            </Text>
                            {item.price > 0 && (
                              <Text
                                style={
                                  styles.optionPriceStyle
                                }>{`+ $${item.price.toFixed(2)}`}</Text>
                            )}
                          </View>
                          {!hideCheckbox(optionalItem, item) && (
                            <CheckBox
                              onTintColor="transparent"
                              boxType={
                                equals(optionalItem.limit, 1)
                                  ? 'circle'
                                  : 'square'
                              }
                              onFillColor="#5C6269"
                              onCheckColor="#FFFFFF"
                              value={includes(
                                `${item.name}${item.price}`,
                                selectedOptions,
                              )}
                              onValueChange={() =>
                                addToSelectedOptions(
                                  optionalItem.label,
                                  optionalItem.limit,
                                  item,
                                )
                              }
                            />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ),
              )}
            <LineDivider lineStyle={generalStyles.productLineStyle} />
            <Text style={generalStyles.productTitleStyle}>Special notes</Text>
            <Text style={generalStyles.productDescriptionStyle}>
              {'(Optional)'}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={specialNotes.onChange}
                multiline
                placeholder="Certain requests can affect the item price. Any necessary adjustments will be made after your order is submitted"
              />
            </View>
            <Text style={generalStyles.productTitleStyle}>
              Who is this item for?
            </Text>
            <Text style={generalStyles.productDescriptionStyle}>
              {'(Optional)'}
            </Text>
            <View style={[styles.inputContainer, {height: 30}]}>
              <TextInput
                onChangeText={buyer.onChange}
                style={[styles.inputStyle, {height: 25}]}
                placeholder="For John"
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.callToActionStyle}>
          <ProductIncrementor
            number={amount}
            redMinus={require('../../static/icons/red-minus.png')}
            redPlus={require('../../static/icons/redplus.png')}
            incrementorContainer={styles.incrementorContainer}
            increment={() => updatePrice('increment')}
            decrement={() => updatePrice('decrement')}
            disabled={equals(amount, 1)}
          />
          <Button
            text={`Add $${(totalPrice * amount).toFixed(2)}`}
            buttonStyle={generalStyles.smallRedButtonStyle}
            textStyle={generalStyles.redButtonTextStyle}
            navigateTo={addToCart}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ProductDetailScreen;
