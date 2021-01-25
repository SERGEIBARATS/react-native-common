import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle, FlatList, Keyboard, TouchableOpacity, Text, Platform, Dimensions, Image } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'

const BASIC_SHADOW_STYLES = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 5,
  backgroundColor: '#fff',
}
const ERROR_COLOR: string = '#cc0000'
const SCREEN_WIDTH: number = Dimensions.get('window').width
const INPUT_WIDTH: number = SCREEN_WIDTH * 0.78
const SECONDARY_COLOR: string = '#da2d7e'
interface Props {
  isRTL?: string
  placeholder?: string
  options?: string[]
  shouldReset?: boolean
  isError?: boolean
  containerStyles?: ViewStyle
}

const DropDown = ({ isRTL, shouldReset, placeholder = 'something', isError, options = ['item1', 'item2', 'item3'], containerStyles, onValueSelected }: Props) => {
  const [dropDownAnim] = useState(new Animated.Value(0))
  const [isExpanded, setIsExpanded] = useState(false)
  const [focusBorderColor, setFocusBorderColor] = useState('#fff')
  const [valueSelected, setValueSelected] = useState('')

  useEffect(() => {
    if (shouldReset) {
      setValueSelected('')
      isExpanded && toggleList()
    }
  }, [shouldReset])

  const toggleList = () => {
    Keyboard.dismiss()
    Animated.timing(dropDownAnim, { toValue: isExpanded ? 0 : 1, duration: 200, easing: Easing.ease }).start()

    setIsExpanded(!isExpanded)
    isExpanded ? setFocusBorderColor('#fff') : setFocusBorderColor(SECONDARY_COLOR)
  }

  const onSelected = (option: string) => {
    toggleList()
    setValueSelected(option)
  }

  const animation = (type: string, outputRange: number[]) => ({
    [type]: dropDownAnim.interpolate({ inputRange: [0, 1], outputRange }),
  })

  const rotate = Animated.concat(
    dropDownAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 180],
    }),
    'deg',
  )

  const isDisabled = !options || options.length === 0
  const optionsContainerSize = options.length > 3 ? 200 : options.length * 50

  return (
    <Animated.View
      style={[styles.menuButtonWrapper, animation('height', [56, optionsContainerSize + 56]), isError && styles.error, isDisabled && { opacity: 0.4 }, containerStyles]}>
      <TouchableOpacity onPress={toggleList} disabled={isDisabled} accessibilityRole="combobox" expanded={isExpanded} accessibilityLabel={valueSelected || placeholder}>
        <View style={[styles.menuButton, { flexDirection: isRTL ? 'row-reverse' : 'row', borderColor: focusBorderColor }]}>
          <Text style={[styles.placeholderText, { [isRTL ? 'paddingLeft' : 'paddingRight']: 10 }]} numberOfLines={1}>
            {valueSelected || placeholder}
          </Text>

          <Animated.View style={{ transform: [{ rotate }] }}>
            <Image source={require('/Users/sergeibarats/amitim_rn/src/assets/arrowDropDown.png')} style={[{ width: 20 }]} resizeMethod="resize" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={[animation('opacity', [0, 1]), animation('height', [0, optionsContainerSize])]}>
        <FlatList
          data={options || []}
          extraData={[isExpanded, valueSelected]}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => onSelected(item)}>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText} numberOfLines={1} bold={item === valueSelected}>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={options.length > 4}
          nestedScrollEnabled
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  menuButtonWrapper: {
    ...BASIC_SHADOW_STYLES,
    width: INPUT_WIDTH,
    borderRadius: 20,
    backgroundColor: '#fff',
    top: 100,
  },
  menuButton: {
    width: INPUT_WIDTH - 2,
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  placeholderText: {
    width: INPUT_WIDTH - 60,
    fontSize: 16,
  },
  optionContainer: {
    width: INPUT_WIDTH,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
  },
  optionText: {
    width: INPUT_WIDTH - 40,
    fontSize: 16,
  },
  error: {
    borderWidth: 1,
    borderColor: ERROR_COLOR,
  },
})

export default DropDown
