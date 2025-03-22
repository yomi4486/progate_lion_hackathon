import React from "react";
import { View, Text, TextInput } from "react-native";

interface SimpleInputComponentProps {
  title: string;
  textChange: (text: string) => void;
}

const SimpleInputComponent: React.FC<SimpleInputComponentProps> = ({
  title,
  textChange,
}) => {
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <Text
        style={{
          textAlign: "left",
          width: "80%",
          fontWeight: "bold",
          fontSize: 20,
          paddingBottom: 5,
        }}
      >
        {title}
      </Text>
      <TextInput
        onChangeText={(t) => {
          textChange(t);
        }}
        style={{
          height: 40,
          width: "80%",
          borderColor: "brack",
          borderWidth: 0.5,
          borderRadius: 3,
          marginBottom: 15,
          paddingHorizontal: 10,
        }}
      />
    </View>
  );
};

export default SimpleInputComponent;
