// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import react navigation (and install)
//npm install @react-navigation/native @react-navigation/native-stack
//expo install react-native-screens react-native-safe-area-context
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import the screens
import ShoppingLists from "./components/ShoppingLists";

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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ShoppingLists">
        <Stack.Screen name="ShoppingLists">
          {/* Pass the db variable to the ShoppingLists component via reacts "passing addiitonal props docs"*/}
          {(props) => <ShoppingLists db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
