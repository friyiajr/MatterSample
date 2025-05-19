import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import {
  makeMutable,
  SharedValue,
  useFrameCallback,
} from "react-native-reanimated";
import {
  Canvas,
  Rect,
  rotateZ,
  RoundedRect,
  SkPoint,
  vec,
} from "@shopify/react-native-skia";

const engine = Matter.Engine.create();
const world = engine.world;

const { height, width } = Dimensions.get("window");

const BOX_SIZE = 50;

interface InitialPosition {
  x: SharedValue<number>;
  y: SharedValue<number>;
  angle: SharedValue<[{ rotateZ: number }]>;
  origin: SharedValue<SkPoint>;
  width: number;
  height: number;
}

const groundCoords: InitialPosition = {
  x: makeMutable(0),
  y: makeMutable(height - 60),
  angle: makeMutable([{ rotateZ: 0 }]),
  width: 810,
  height: 60,
  origin: makeMutable(vec(0, 0)),
};

const boxCoords: InitialPosition = {
  x: makeMutable(width / 2),
  y: makeMutable(200),
  angle: makeMutable([{ rotateZ: 0 }]),
  width: BOX_SIZE,
  height: BOX_SIZE,
  origin: makeMutable(vec(width / 2 + BOX_SIZE / 2, 200 / 2 + BOX_SIZE / 2)),
};

// Create bodies (physics only)
const ground = Matter.Bodies.rectangle(
  groundCoords.x.value,
  groundCoords.y.value,
  groundCoords.width,
  groundCoords.height,
  { isStatic: true }
);

const leftWall = Matter.Bodies.rectangle(-50, height / 2, 1, height, {
  isStatic: true,
});

const rightWall = Matter.Bodies.rectangle(width + 1, height, 1, height, {
  isStatic: true,
});

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const box = Matter.Bodies.rectangle(
  boxCoords.x.value,
  boxCoords.y.value,
  boxCoords.width,
  boxCoords.height,
  {
    restitution: 0.9,
  }
);

Matter.World.add(world, [ground, leftWall, rightWall, box]);

export default function App() {
  const [boxes, setBoxes] = useState([boxCoords]);
  const [boxesWorld, setBoxesWorld] = useState([box]);

  useEffect(() => {
    let animationFrame: any;

    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);
      animationFrame = requestAnimationFrame(update);

      boxes.forEach((box, i) => {
        box.x.value = boxesWorld[i].position.x;
        box.y.value = boxesWorld[i].position.y;
        box.angle.value = [{ rotateZ: boxesWorld[i].angle }];
        box.origin.value = vec(
          box.x.value + BOX_SIZE / 2,
          box.y.value + BOX_SIZE / 2
        );
      });
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [boxesWorld]);

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        {boxes.map((box, i) => {
          return (
            <Rect
              x={box.x}
              y={box.y}
              height={box.height}
              width={box.width}
              color="limegreen"
              key={i}
              style="stroke"
              strokeWidth={3}
              transform={box.angle}
              origin={box.origin}
            />
          );
        })}

        <Rect
          x={groundCoords.x}
          y={groundCoords.y}
          height={groundCoords.height}
          width={groundCoords.width}
          color="grey"
        />
      </Canvas>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          backgroundColor: "limegreen",
          width: width,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          const newBoxCoords: InitialPosition = {
            x: makeMutable(width / 2 - 20),
            y: makeMutable(200),
            angle: makeMutable([{ rotateZ: 0 }]),
            width: BOX_SIZE,
            height: BOX_SIZE,
            origin: makeMutable(
              vec(width / 2 + BOX_SIZE / 2, 200 / 2 + BOX_SIZE / 2)
            ),
          };

          let offset = getRandomIntInclusive(-100, 100);

          const newBox = Matter.Bodies.rectangle(
            newBoxCoords.x.value + offset,
            newBoxCoords.y.value,
            boxCoords.width,
            boxCoords.height,
            {
              restitution: 0.9,
            }
          );

          Matter.World.add(world, newBox);
          setBoxes([...boxes, newBoxCoords]);
          setBoxesWorld([...boxesWorld, newBox]);
        }}
      >
        <Text
          style={{
            fontSize: 40,
          }}
        >
          ADD BOX
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
