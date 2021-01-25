import React, {
  RefObject,
  Dimensions,
  Platform,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
const BASIC_SHADOW_STYLES = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 3},
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 5,
  backgroundColor: '#fff',
};
const ERROR_COLOR: string = '#cc0000';
const SCREEN_WIDTH: number = Dimensions.get('window').width;
const INPUT_WIDTH: number = SCREEN_WIDTH * 0.78;
const IS_IOS: boolean = Platform.OS === 'ios';
const MAIN_COLOR: string = '#161e90';
const TEXT_COLOR: string = '#151e4c';
const DEEP_BLUE: string = '#161f72';
const SECONDARY_COLOR: string = '#da2d7e';
interface InputProps extends TextInputProps {
  value: string;
  placeholder: string;
  onChangeText(value: string): void;
  secureTextEntry?: string;
  maxLength?: number;
  blurOnSubmit?(): void;
  onSubmitEditing?(): void;
  multiline?: boolean;
  textContentType?: string;
  autoFocus?: any;
  keyboardType?: string;
  isRTL?: boolean;
  locale?: string;
  strings?: any;
  refObj?: RefObject<any>;
  isError?: boolean;
  isLogin?: boolean;
  placeholderPosition?: number;
  inputStyles?: StyleProp<TextStyle>;
  containerStyles?: ViewStyle;
  isWeight?: boolean;
}

const Input = ({
  refObj,
  value,
  placeholder,
  onChangeText,
  isError,
  isLogin,
  secureTextEntry,
  keyboardType,
  maxLength,
  blurOnSubmit,
  onSubmitEditing,
  multiline,
  textContentType,
  autoFocus,
  placeholderPosition,
  inputStyles,
  containerStyles,
  isWeight,
}: InputProps) => {
  const [placeholderAnim] = useState(new Animated.Value(0));
  const [focusBorderColor, setFocusBorderColor] = useState('#fff');
  const animValue = useRef(0);
  const isFocused = useRef(false);

  useEffect(() => {
    if (value && animValue.current === 0) {
      animate(1);
    }
    if (!value && animValue.current === 1 && !isFocused.current) {
      animate(0);
    }
  }, [value]);

  const animate = (toValue: number) => {
    Animated.timing(placeholderAnim, {
      toValue,
      duration: 150,
      easing: Easing.linear,
    }).start();
    animValue.current = toValue;
  };

  const checkPlaceholder = (isFocus: boolean) => {
    if (isFocus) {
      setFocusBorderColor(SECONDARY_COLOR);
      !value && animate(1);
    } else {
      setFocusBorderColor('#fff');
      !value && animate(0);
    }

    isFocused.current = isFocus;
  };

  const animation = (outputRange: number[]) =>
    placeholderAnim.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: Animated.Extrapolate.CLAMP,
    });
  const containerHeight: any = containerStyles?.height || 50;

  const inputHandeling = (input: string) => {
    if (isWeight && input.length > 10) {
      return;
    }
    onChangeText && onChangeText(input);
  };

  return (
    <View
      style={[
        styles.container,
        containerStyles,
        {borderColor: isError ? ERROR_COLOR : focusBorderColor},
        {
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 1,
          backgroundColor: 'rgba(7,0,107,0.2)',
        },
      ]}>
      <TextInput
        ref={refObj}
        style={[
          styles.text,
          {textAlign: isRTL ? 'right' : 'left'},
          styles.input,
          inputStyles,
          multiline && {height: containerHeight - 20},
        ]}
        value={value}
        placeholderTextColor={MAIN_COLOR}
        secureTextEntry={secureTextEntry}
        onChangeText={inputHandeling}
        keyboardType={keyboardType || 'default'}
        blurOnSubmit={blurOnSubmit}
        maxLength={maxLength}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
        spellCheck={false}
        multiline={multiline}
        textContentType={textContentType}
        autoFocus={autoFocus}
        onFocus={() => checkPlaceholder(true)}
        onBlur={() => checkPlaceholder(false)}
        underlineColorAndroid="rgba(0,0,0,0)"
      />

      {/*
      // @ts-ignore */}
      <Animated.Text
        style={[
          styles.text,
          {
            position: 'absolute',
            top: placeholderPosition || undefined,
            color: isLogin ? '#fff' : isError ? ERROR_COLOR : DEEP_BLUE,
            width: INPUT_WIDTH - 40,
            [isRTL ? 'right' : 'left']: 20,
            textAlign: isRTL ? 'right' : 'left',
            fontSize: animation([16, 12]),
            transform: [{translateY: animation([0, -12])}],
          },
        ]}>
        {placeholder}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: INPUT_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },
  input: {
    width: INPUT_WIDTH - 40,
    height: 36,
    padding: 0,
    paddingTop: 0,
    margin: 0,
    borderWidth: 0,
    color: TEXT_COLOR,
    zIndex: 1000,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: IS_IOS ? 16 : 20,
    color: DEEP_BLUE,
  },
});

export {Input};
