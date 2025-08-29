import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function TestComponent() {
  const translateX = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  const handlePress = () => {
    //translateX.value += 50;
    opacity.value = withTiming(0, { duration: 1000 });
  };

  const animatedStyles = useAnimatedStyle(() => ({
    //transform: [{ translateX: withSpring(translateX.value * 2) }],
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <View style={styles.container}>
        <View style={{justifyContent: 'center' , marginTop: 50, backgroundColor: 'yellow'}}>
        <Button onPress={handlePress} title="Click me" />
        </View>

      </View>
    </>
  );
}
  const styles = StyleSheet.create({
    container: {
      //flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      width: 100,
      height: 100,
      backgroundColor: 'red',
      marginBottom: 20,
    },
  });

