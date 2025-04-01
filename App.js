// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
//import react navigation (and install)
//npm install @react-navigation/native @react-navigation/native-stack
//expo install react-native-screens react-native-safe-area-context
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import the screens
import ShoppingLists from "./components/ShoppingLists";
import Welcome from "./components/Welcome";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBL-gVrtU60SYcEPLsGoZxGogVoHnD0tKw",
    authDomain: "shopping-list-demo-4fbb5.firebaseapp.com",
    projectId: "shopping-list-demo-4fbb5",
    storageBucket: "shopping-list-demo-4fbb5.firebasestorage.app",
    messagingSenderId: "1093338877072",
    appId: "1:1093338877072:web:e6e59dda3e1c11f05e5c15",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service (db variable)
  const db = getFirestore(app);

  //new state that represents the connection status
  const connectionStatus = useNetInfo();

  //display an alert if the connection is lost
  //dep array [connectionStatus.isConnected] means alert will only be displayed when the connection status changes
  // If condition was if(!connectionStatus.isConnected), the app would assume no connection on startup,
  // since null is falsy and useNetInfo() initially sets connectionStatus to null.
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ShoppingLists">
          {/* Pass the db variable to the ShoppingLists component via reacts "passing addiitonal props docs"*/}
          {/*The isConnected prop is passed to the ShoppingLists component to enable conditional rendering based on the connection status. */}
          {(props) => (
            <ShoppingLists
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
