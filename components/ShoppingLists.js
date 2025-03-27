import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform, 
  Alert
} from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, onSnapshot, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

{
  /* useEffect() is a hook that allows you to perform side effects in your function components. 
  It is similar to componentDidMount, componentDidUpdate, and componentWillUnmount in React classes. 
  useEffect() is called after the first render and after every update. 
  The second argument to useEffect() is an array of dependencies. 
  If any of the dependencies change, the effect is re-run. 
  If you want to run the effect only once, you can pass an empty array. 
  If you want to run the effect only when a specific value changes, you can pass an array with that value. 
  In this case, the effect will run only when the lists variable changes.*/
}

const ShoppingLists = ({ db , route }) => {

  {
    /* Extract the db variable to the ShoppingLists component */
  }
  // userID will be used in the future to filter shopping lists based on the user who created them.
  const { userID } = route.params;

  const [lists, setLists] = useState([]);
  //these three states are for the 3 TextInput fields
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

  // When a new shopping list is added to Firestore, newListRef will contain a reference to the newly created document.
  // If the write operation is successful, newListRef.id will be a truthy value, allowing us to confirm success.
  // We use Alert from react-native to notify the user whether the operation was successful or not.

  const addShoppingList = async (newList) => {
    const newListRef = await addDoc(collection(db, "shoppinglists"), newList);
    if (newListRef.id) {
      setLists([newList, ...lists]); //adds the new list to the existing lists (wont work on chatapp or games)

      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert("Unable to add. Please try later");
    }
  };

// This useEffect hook sets up a real-time listener on the "shoppinglists" collection in Firestore.
// The onSnapshot function listens for changes and updates the state whenever documents are added, modified, or removed.
// It iterates through the snapshot, extracts document data along with the document ID, and updates the state with the new list of shopping lists.
// This ensures the UI always displays the latest data from Firestore.

// Cleanup: The function returned at the end unsubscribes from the Firestore listener when the component unmounts.
// This prevents memory leaks and unnecessary database connections.

useEffect(() => {
  const q = query(collection(db, "shoppinglists"), where("uid", "==", userID));
  const unsubShoppinglists = onSnapshot(q, async (documentsSnapshot) => {
    let newLists = [];
    documentsSnapshot.forEach(doc => {
      newLists.push({ id: doc.id, ...doc.data() })
    });
    //safety measure to prevent app from crashing if AsyncStorage fails to store the data 
    try { 
      await AsyncStorage.setItem('shopping_lists', JSON.stringify(newLists));
    } catch (error) {
      console.log(error.message);
    }
    setLists(newLists);
  });

  // Clean up code
  return () => {
    if (unsubShoppinglists) unsubShoppinglists();
  }
}, []);


  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>
              {item.name}: {item.items.join(", ")}
            </Text>
            {/*join() converts an array into a string "item1, item2" */}
          </View>
        )}
      />
      <View style={styles.listForm}>
        <TextInput
          style={styles.listName}
          placeholder="List Name"
          value={listName}
          onChangeText={setListName}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #1"
          value={item1}
          onChangeText={setItem1}
        />
        <TextInput
          style={styles.item}
          placeholder="Item #2"
          value={item2}
          onChangeText={setItem2}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            {
              /*creates new object out of the 3 states, then calls addShoppingList fn*/
            }
            const newList = {
              uid: userID,
              name: listName,
              items: [item1, item2],
            };
            addShoppingList(newList);
            {
              /*clears the 3 states after the new list is added*/
            }
            setListName("");
            setItem1("");
            setItem2("");
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1,
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC",
  },
  listName: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ShoppingLists;
