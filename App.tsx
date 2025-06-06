import { Dimensions, StyleSheet, View } from "react-native";

import { Canvas, Circle, Rect, SkPoint, vec } from "@shopify/react-native-skia";
import Matter, { Sleeping } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { makeMutable, SharedValue } from "react-native-reanimated";
import { Buttons } from "./Buttons";

const engine = Matter.Engine.create();
const world = engine.world;

const { height, width } = Dimensions.get("window");

const BOX_SIZE = 50;
const BALL_SIZE = 30;
const BOTTOM_HEIGHT = 40;

interface BoxCoords {
  x: SharedValue<number>;
  y: SharedValue<number>;
  angle: SharedValue<[{ rotateZ: number }]>;
  origin: SharedValue<SkPoint>;
  width: number;
  height: number;
  type: "box";
}

interface BallCoords {
  x: SharedValue<number>;
  y: SharedValue<number>;
  radius: number;
  type: "ball";
}

type GameObjects = BoxCoords | BallCoords;

const topWall = Matter.Bodies.rectangle(width / 2, 0, width, 1, {
  isStatic: true,
});

const bottomWall = Matter.Bodies.rectangle(
  width / 2,
  height - BOTTOM_HEIGHT,
  width,
  BOTTOM_HEIGHT,
  { isStatic: true }
);

const leftWall = Matter.Bodies.rectangle(-BALL_SIZE, height / 2, 1, height, {
  isStatic: true,
});

const rightWall = Matter.Bodies.rectangle(
  width - BALL_SIZE,
  height / 2,
  1,
  height * 2,
  {
    isStatic: true,
  }
);

const groundCoords: BoxCoords = {
  x: makeMutable(0),
  y: makeMutable(height - BOTTOM_HEIGHT),
  angle: makeMutable([{ rotateZ: 0 }]),
  width: width,
  height: BOTTOM_HEIGHT,
  origin: makeMutable(vec(0, 0)),
  type: "box",
};

const ballCoords: BallCoords = {
  x: makeMutable(width * 0.15),
  y: makeMutable(height * 0.83),
  radius: BALL_SIZE,
  type: "ball",
};

const ball = Matter.Bodies.circle(
  ballCoords.x.value,
  ballCoords.y.value,
  ballCoords.radius,
  {
    isSleeping: true,
    restitution: 0.9,
  }
);

Matter.World.add(world, [bottomWall, topWall, leftWall, rightWall, ball]);

function launchBall() {
  Sleeping.set(ball, false);
  Matter.Body.setAngularVelocity(ball, 5);
  Matter.Body.setVelocity(ball, { x: 63, y: 0 });
}

export default function App() {
  const [elements, setElements] = useState<GameObjects[]>([ballCoords]);
  const boxesWorld = useRef([ball]);

  useEffect(() => {
    let animationFrame: any;

    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);
      animationFrame = requestAnimationFrame(update);

      elements.forEach((element, i) => {
        if (element.type === "box") {
          element.x.value = boxesWorld.current[i].position.x;
          element.y.value = boxesWorld.current[i].position.y;
          element.angle.value = [{ rotateZ: boxesWorld.current[i].angle }];
          element.origin.value = vec(
            element.x.value + BOX_SIZE / 2,
            element.y.value + BOX_SIZE / 2
          );
        } else if (element.type === "ball") {
          element.x.value = boxesWorld.current[i].position.x + BALL_SIZE;
          element.y.value = boxesWorld.current[i].position.y + BALL_SIZE;
        }
      });
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [elements]);

  const offsetVal = useRef(0);

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        {elements.map((box, i) => {
          if (box.type === "box") {
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
          } else {
            return (
              <Circle
                key={i}
                cx={ballCoords.x}
                cy={ballCoords.y}
                r={ballCoords.radius}
                color="limegreen"
              />
            );
          }
        })}

        <Rect
          x={groundCoords.x}
          y={groundCoords.y}
          height={groundCoords.height}
          width={groundCoords.width}
          color="grey"
        />
      </Canvas>
      <Buttons
        onPress1={() => {
          const newBoxCoords: BoxCoords = {
            x: makeMutable(width / 2 + 40),
            y: makeMutable(200),
            angle: makeMutable([{ rotateZ: 0 }]),
            width: BOX_SIZE,
            height: BOX_SIZE,
            origin: makeMutable(
              vec(width / 2 + BOX_SIZE / 2, 200 / 2 + BOX_SIZE / 2)
            ),
            type: "box",
          };

          offsetVal.current = (offsetVal.current + 1) % 2;

          const newBox = Matter.Bodies.rectangle(
            newBoxCoords.x.value + offsetVal.current * BOX_SIZE,
            newBoxCoords.y.value,
            BOX_SIZE,
            BOX_SIZE,
            {
              restitution: 0.9,
            }
          );

          Matter.World.add(world, newBox);
          setElements([...elements, newBoxCoords]);

          boxesWorld.current.push(newBox);
        }}
        onPress2={launchBall}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
