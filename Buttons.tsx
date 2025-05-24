import React from "react";
import { TouchableOpacity, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const Buttons = ({
  onPress1,
  onPress2,
}: {
  onPress1: () => void;
  onPress2: () => void;
}) => {
  return (
    <>
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
        onPress={onPress1}
      >
        <Text
          style={{
            fontSize: 40,
          }}
        >
          ADD BOX
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          backgroundColor: "limegreen",
          width: width,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress2}
      >
        <Text
          style={{
            fontSize: 40,
          }}
        >
          LAUNCH
        </Text>
      </TouchableOpacity>
    </>
  );
};
