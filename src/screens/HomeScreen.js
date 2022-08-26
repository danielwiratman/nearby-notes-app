import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "@firebase/firestore";
import { db } from "../firebase";
import { FAB } from "react-native-paper";
import * as Location from "expo-location";
import { getPreciseDistance } from "geolib";

const HomeScreen = ({ navigation }) => {
    const [postsData, setPostsData] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [someCoords, setSomeCoords] = useState({
        latitude: 48.8584,
        longitude: 2.2945,
    });
    const [myCoords, setMyCoords] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        if (location === null) return;
        setMyCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    }, [location]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });
            setLocation(location);
        })();
        onSnapshot(collection(db, "posts"), (snapshot) => {
            const newList = [];
            snapshot.docs.map((doc) => {
                newList.push(doc);
            });
            setPostsData(newList);
        });
    }, []);

    async function deleteMyData(id) {
        await deleteDoc(doc(db, "posts", id));
    }


    return (
        <View
            style={{
                flex: 1,
                padding: 15,
            }}
        >
            <FlatList
                data={postsData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    flex: 1,
                }}
                renderItem={({ item }) => {
                    const cardCoords = { latitude: 0, longitude: 0 };
                    if (item.data().latitude && item.data().longitude) {
                        cardCoords.latitude = item.data().latitude;
                        cardCoords.longitude = item.data().longitude;
                    }
                    return (
                        <Card
                            title={item.data().title}
                            content={item.data().content}
                            currLat={myCoords.latitude}
                            currLong={myCoords.longitude}
                            latitude={cardCoords.latitude}
                            longitude={cardCoords.longitude}
                            trashFunc={() => {
                                deleteMyData(item.id);
                            }}
                        />
                    );
                }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {location ? (
                    <Text style={{ flexGrow: 1, fontSize: 20, color: "green" }}>
                        Location OK
                    </Text>
                ) : (
                    <Text style={{ flexGrow: 1, fontSize: 20, color: "red" }}>
                        Location Not Set
                    </Text>
                )}
                <FAB
                    icon="plus"
                    onPress={() =>
                        navigation.replace("Add", {
                            longitude: myCoords.longitude,
                            latitude: myCoords.latitude,
                        })
                    }
                />
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({});

function Card({
    title,
    content,
    latitude,
    longitude,
    trashFunc,
    currLat,
    currLong,
}) {
    const calculatedDistance = getPreciseDistance(
        { latitude: currLat, longitude: currLong },
        { latitude: latitude, longitude: longitude }
    );
    return (
        <View
            style={{
                elevation: 4,
                backgroundColor: "white",
                padding: 15,
                marginBottom: 15,
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        flexGrow: 1,
                    }}
                >
                    {title}
                </Text>
                <TouchableOpacity onPress={trashFunc}>
                    <Text
                        style={{
                            padding: 5,
                            backgroundColor: "red",
                            color: "white",
                        }}
                    >
                        TRASH
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    height: 5,
                }}
            />
            <View
                style={{
                    height: 1,
                    backgroundColor: "gray",
                }}
            />
            <View
                style={{
                    height: 5,
                }}
            />
            <Text
                style={{
                    fontSize: 16,
                }}
                numberOfLines={3}
            >
                {content}
            </Text>
            <View
                style={{
                    height: 5,
                }}
            />
            <Text>Distance from you: {calculatedDistance} km</Text>
        </View>
    );
}
