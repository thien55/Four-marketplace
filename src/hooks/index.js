import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {displayAuthentication, saveNavigation} from '../redux/actions';

export const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (text) => setValue(text);
  return {value, onChange};
};
export const useCheckboxValue = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggleCheckbox = () => setValue(!value);
  return {value, toggleCheckbox};
};
export const useTabsValue = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const selectTab = (tab) => setValue(tab);
  return {value, selectTab};
};
export const useMainTabRoute = () => {
  const navigation = useNavigation();
  const navigationParent = navigation.dangerouslyGetParent();
  if (!navigationParent) {
    return null;
  }
  const {index, routeNames} = navigationParent.dangerouslyGetState();
  return routeNames[index];
};
export const useSignInAlert = () => {
  const dispatch = useDispatch();
  const stateNavigation = {
    navigation: useNavigationState((state) => state),
    tabMain: useMainTabRoute(),
  };
  const displaySignInAlert = (msj = 'You need to sign in') => {
    Alert.alert('Must Sign In', msj, [
      {
        text: 'Sign In Now',
        onPress: () => {
          dispatch(saveNavigation(stateNavigation));
          dispatch(displayAuthentication(true));
        },
      },
      {
        text: 'No Thanks',
        style: 'cancel',
      },
    ]);
  };
  return displaySignInAlert;
};
