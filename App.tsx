import { Dimensions, StyleSheet, View } from "react-native";

import { Canvas, Circle, Rect, SkPoint, vec } from "@shopify/react-native-skia";
import Matter, { Sleeping } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { makeMutable, SharedValue } from "react-native-reanimated";
import { Buttons } from "./Buttons";

const { height, width } = Dimensions.get("window");

const BOX_SIZE = 50;
const BALL_SIZE = 30;
const BOTTOM_HEIGHT = 40;

export default function App() {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}></Canvas>
      <Buttons onAddBox={() => {}} onLaunch={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: "black",
  },
});
