import {Platform, Linking, Alert} from 'react-native';
import moment from 'moment';
import InAppReview from 'react-native-in-app-review';
import {find, propEq, includes, uniq, isEmpty, equals} from 'ramda';
import {getDistance} from 'geolib';
import queryString from 'query-string';
import config from '../config/index';
import logAnalyticsEvent from './logEvent';
import styles from '../styles/styles';
const days = Object.freeze({
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Monday',
});

export const callInAppReview = () => {
  InAppReview.isAvailable();
  InAppReview.RequestInAppReview();
};

export const isOpen = (schedule) => {
  if (schedule) {
    const weekDay = days[moment().isoWeekday()];
    const day = find(propEq('day', weekDay))(schedule);
    if (!day) {
      return false;
    }
    return day.closed
      ? false
      : moment().isBetween(
          moment(day.openAt, 'H:mm'),
          moment(day.openAt, 'H:mm').add(day.workingHours, 'h'),
        );
  }
  return false;
};
export async function getDrivingDistance(userLocation, businessLocation) {
  // const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  // const params = {
  //   origin: [userLocation.latitude, userLocation.longitude],
  //   destination: [businessLocation.lat, businessLocation.lng],
  //   units: 'imperial',
  //   key: config.google.geoKey,
  // };
  // const queryParams = queryString.stringify(params, {
  //   arrayFormat: 'comma',
  // });
  const pointA = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
  };
  const pointB = {
    latitude: businessLocation.lat,
    longitude: businessLocation.lng,
  };
  const distanceInMeters = getDistance(pointA, pointB);
  const disntanceInMiles = (distanceInMeters / 1609).toFixed(2);
  const distance =
    disntanceInMiles >= 1 ? Math.round(disntanceInMiles) : disntanceInMiles;
  const distanceObject = {
    text: distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    value: distance,
  };
  // const response = await fetch(`${baseUrl}?${queryParams}`);
  // const result = await response.json();
  // return result.routes[0].legs[0].distance;
  return distanceObject;
}
export const getOperationHours = (schedule) => {
  const weekDay = days[moment().isoWeekday()];
  const day = find(propEq('day', weekDay))(schedule);
  if (!day) {
    return;
  }
  const hoursObject = {
    openTime: moment(day.openAt, 'H:mm').format('h:mm a'),
    closeTime: moment(day.openAt, 'H:mm')
      .add(day.workingHours, 'h')
      .format('h:mm a'),
  };
  return hoursObject;
};
export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}
export function formatPrice(price) {
  return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
export function formatNumbers(number, character) {
  return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, character)}`;
}
export function getItemRange(item, field) {
  return uniq(
    item.units.items.map((unit) => {
      if (equals(field, 'fullBaths')) {
        const halfBaths = unit.halfBaths * 0.5;
        return unit[field] + halfBaths;
      }
      return unit[field];
    }),
  ).sort((a, b) => a - b);
}
export function displayNumber(number1, number2, sqFt) {
  if (number1 && number2 && !sqFt) {
    return equals(number1, number2)
      ? `$${formatNumbers(number1, ',')}`
      : `$${formatNumbers(number1, ',')} - $${formatNumbers(number2, ',')}`;
  } else if (number1 && number2 && sqFt) {
    return equals(number1, number2)
      ? `${formatNumbers(number1, ',')}`
      : `${formatNumbers(number1, ',')} - ${formatNumbers(number2, ',')}`;
  } else if (number1 && !number2) {
    return `${formatNumbers(number1, ',')}`;
  } else if (number2 && !number1) {
    return `${formatNumbers(number2, ',')}`;
  } else {
    return 'Contact Us';
  }
}
export function getPropertiesRanges(items) {
  const properties = items.map((property) => {
    if (!isEmpty(property.units.items)) {
      const baths = getItemRange(property, 'fullBaths');
      const beds = getItemRange(property, 'bedrooms');
      const rents = getItemRange(property, 'rent');
      const maxRents = getItemRange(property, 'maxRent');
      const bathsRange =
        baths.length > 1
          ? `${baths[0]}-${baths[baths.length - 1]} baths`
          : baths[0] === 1
          ? `${baths[0]} bath`
          : `${baths[0]} baths`;
      const bedsRange =
        beds.length > 1
          ? `${beds[0]}-${beds[beds.length - 1]} beds`
          : beds[0] === 1 || beds[0] === 0
          ? beds[0] > 0
            ? `${beds[0]} bed`
            : 'Studio'
          : `${beds[0]} beds`;
      let rentRanges = '';
      if (rents[0] && maxRents[maxRents.length - 1]) {
        rentRanges = `$${formatNumbers(rents[0], ',')} - $${formatNumbers(
          maxRents[maxRents.length - 1],
          ',',
        )}`;
        if (rents[0] === maxRents[maxRents.length - 1]) {
          rentRanges = `$${formatNumbers(rents[0], ',')}`;
        }
      } else {
        rentRanges = 'Contact Us';
      }
      property.bathsRange = bathsRange;
      property.bedsRange = bedsRange;
      property.rentRanges = rentRanges;
    }
    return property;
  });
  return properties;
}
export const openMapToLocation = (address, label) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:'});
  const {lat, lng} = address.location;
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}?q=${label}`,
  });
  Linking.openURL(url);
};
export function getItemFavorites(list, type, items) {
  const favorites = list
    .filter((item) => item.type === type)
    .map((item) => item.itemID);
  const filteredList = items.filter((item) => includes(item.id, favorites));
  return filteredList;
}
export const itemExistsInFavorites = (type, itemId, list) => {
  const filteredList = list.filter(
    (item) => item.type === type && item.itemID === itemId,
  );
  return filteredList ;
};
export const onNavigatingToLink = async (link) => {
  const supported = await Linking.canOpenURL(link);
  if (supported) {
    await Linking.openURL(link);
    logAnalyticsEvent('Visit_Our_Site', {URL: link});
  } else {
    Alert.alert(`Don't know how to open this URL: ${link}`);
  }
};
export function searchForCategories(query, categories) {
  const lowercaseQuery = query.toLowerCase();
  const filterCategories = categories.filter((category) =>
    includes(lowercaseQuery, category.name.toLowerCase()),
  );
  return filterCategories;
}

export function searchForProperties(query, properties) {
  const lowercaseQuery = query.toLowerCase();
  const filterProperties = properties.filter(
    (property) =>
      includes(lowercaseQuery, property.marketingName.toLowerCase()) ||
      (property.address.details &&
        includes(lowercaseQuery, property.address.street.toLowerCase())),
  );
  return filterProperties;
}

export function searchForProducts(query, products) {
  const lowercaseQuery = query.toLowerCase();
  const filterProducts = products.filter((product) =>
    includes(lowercaseQuery, product.name.toLowerCase()),
  );
  return filterProducts;
}

export function searchForMerchants(query, merchants) {
  const lowercaseQuery = query.toLowerCase();
  const filterMerchants = merchants.filter((merchant) =>
    includes(lowercaseQuery, merchant.name.toLowerCase()),
  );
  return filterMerchants;
}
export function searchForOffers(query, offers) {
  const lowercaseQuery = query.toLowerCase();
  const filterOffers = offers.filter(
    (offer) =>
      includes(lowercaseQuery, offer.title.toLowerCase()) ||
      includes(lowercaseQuery, offer.merchant.name.toLowerCase()),
  );
  return filterOffers;
}

export function snakeToSentence(string) {
  return string
    .replace(/_/g, ' ')
    .split(' ')
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

export const getTodaySchedule = (schedule) => {
  if (schedule) {
    const weekDay = days[moment().isoWeekday()];
    const day = find(propEq('day', weekDay))(schedule);
    if (!day) {
      return '';
    }

    const format = 'h:mm a';
    const from = moment(day.openAt, 'H:mm').format(format);
    const to = moment(day.openAt, 'H:mm')
      .add(day.workingHours, 'h')
      .format(format);
    return `Open from ${from} to ${to}`;
  }
  return '';
};

export const getMerchantsDistance = async (userLocation, addresses) => {
  const merchantAddresses = addresses.map(async (business) => {
    try {
      const {value} = await getDrivingDistance(userLocation, business.location);
      return {...business, userDistanceInMiles: value};
    } catch {
      return business;
    }
  });
  return await Promise.all(merchantAddresses);
};

export const orderArrayByDate = (array) => {
  return array
    .slice()
    .sort((a, b) => moment(b.createdAt) - moment(a.createdAt));
};
