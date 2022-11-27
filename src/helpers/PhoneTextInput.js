import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {TextInput, StyleSheet, Platform, Image, View} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: '#D4D4E4',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Platform.OS === 'ios' ? 12 : 3,
  },
});

function PhoneTextInput(
  {
    placeholder,
    autoComplete,
    autoFocus,
    value,
    onChange,
    inputStyle,
    source,
    iconStyle,
    inputContainer,
  },
  ref,
) {
  // Instead of `onChangeText` it could use `onChange` and get `value` from `nativeEvent.text`.
  const onChangeText = useCallback(
    (value) => {
      onChange({
        preventDefault() {
          this.defaultPrevented = true;
        },
        target: {value},
      });
    },
    [onChange],
  );
  return (
    <View style={inputContainer || styles.inputContainer}>
      <Image source={source} style={iconStyle} />
      <TextInput
        style={inputStyle}
        ref={ref}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoCompleteType={autoComplete}
        keyboardType="phone-pad"
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="#404852"
      />
    </View>
  );
}

PhoneTextInput = React.forwardRef(PhoneTextInput);

PhoneTextInput.propTypes = {
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default PhoneTextInput;
