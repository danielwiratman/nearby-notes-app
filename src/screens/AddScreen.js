import { View, Text, TextInput, Button } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { FAB } from "react-native-paper";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const AddScreen = ({navigation, route}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {longitude, latitude} = route.params

    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
            <Button onPress={() => navigation.replace('Home')} title="Back" />
        )
      })
    
    }, [])

    async function addData() {
        if (title === "" || content === ""){
            console.log("Neither title nor content can be empty..")
            return
        }
        await addDoc(collection(db, "posts"), {
            title,
            content,
            latitude,
            longitude
        });
        navigation.replace('Home')
    }

    return (
        <View style={{ flex: 1, padding: 15, justifyContent: "center" }}>
            <TextInput
                placeholder="Title"
                style={{ padding: 5, fontSize: 20 }}
                onChangeText={(text) => setTitle(text)}
                multiline
            />
            <TextInput
                placeholder="Content"
                textAlignVertical="top"
                style={{ padding: 5, fontSize: 18, height: 250 }}
                onChangeText={(text) => setContent(text)}
            />
            <FAB
                style={{ width: 200, alignSelf: "center" }}
                label="Submit"
                color="white"
                onPress={addData}
            />
        </View>
    );
};

export default AddScreen;
