import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen.js";
import AddScreen from "./src/screens/AddScreen.js";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerTitleAlign: "center" }}
                />
                <Stack.Screen
                    name="Add"
                    component={AddScreen}
                    options={{ headerTitleAlign: "center" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
