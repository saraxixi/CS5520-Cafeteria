import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, database } from './firebase/FirebaseSetup';
import { Feather } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { deleteFromDB } from './firebase/FirebaseHelper';

import Home from './screens/Home';
import Cart from './screens/Cart';
import Favorite from './screens/Favorite';
import History from './screens/History';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Journal from './screens/Journal';
import AddJournal from './screens/AddJournal';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import JournalDetail from './screens/JournalDetail';
import Payment from './screens/Payment';
import { AntDesign } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      style={styles.logoutButton}
    >
      <Feather name="log-out" size={24} color="#4A2B29" />
    </TouchableOpacity>
  );

  const AddButton = ({navigation}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddJournal')}
      style={styles.logoutButton}
    >
      <Feather name="plus" size={24} color="#4A2B29" />
    </TouchableOpacity>
  );

  const deleteButton = (deleteFunction) => (
    <TouchableOpacity
      onPress={deleteFunction}
      style={styles.logoutButton}
    >
      <Feather name="trash-2" size={24} color="#4A2B29" />
    </TouchableOpacity>
  );
  
  const handleDeleteJournal = async (journalId, navigation) => {
    Alert.alert(
      "Delete Journal",
      "Are you sure you want to delete this journal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteJournal(journalId, navigation)
        }
      ]
    );
  }

  const deleteJournal = async (journalId, navigation) => {
    try {
      await deleteFromDB(journalId, 'journals');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting journal:', error);
      Alert.alert('Error', 'Failed to delete journal. Please try again.');
    }
  };

  function HomeStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerRight: () => <LogoutButton />,
        headerRightContainerStyle: styles.headerRightContainer,
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen 
          name="HomeScreen" 
          component={Home} 
          options={{ title: "Home" }}
        />
      </Stack.Navigator>
    );
  }

  function HistoryStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerRight: () => <LogoutButton />,
        headerRightContainerStyle: styles.headerRightContainer,
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen 
          name="HistoryScreen" 
          component={History}
          options={{ title: "History" }}
        />
      </Stack.Navigator>
    );
  }

  function FavoriteStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerRight: () => <LogoutButton />,
        headerRightContainerStyle: styles.headerRightContainer,
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen 
          name="FavoriteScreen" 
          component={Favorite}
          options={{ title: "Favorites" }}
        />
      </Stack.Navigator>
    );
  }

  function CartStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerRight: () => <LogoutButton />,
        headerRightContainerStyle: styles.headerRightContainer,
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen 
          name="CartScreen" 
          component={Cart}
          options={{ title: "Cart" }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ title: "Payment" }}
        />
      </Stack.Navigator>
    );
  }

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  function ProfileStack() {
    return (
      <Stack.Navigator screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
      }}>
        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{
            title: "Profile",
            headerRight: () => <LogoutButton />,
            headerRightContainerStyle: styles.headerRightContainer,
          }}
        />
        <Stack.Screen
          name="Journal"
          component={Journal}
          options={({ navigation }) => ({
            title: "Journal",
            headerRight: () => <AddButton navigation={navigation}/>,
            headerRightContainerStyle: styles.headerRightContainer,
          })}
        />
        <Stack.Screen
          name="AddJournal"
          component={AddJournal}
          options={{
            title: "Add Journal",
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: "Edit Profile",
          }}
        />
        <Stack.Screen
          name="JournalDetail"
          component={JournalDetail}
          options={({ route, navigation }) => ({
            title: "Journal Detail",
            headerRight: () => deleteButton(() => handleDeleteJournal(route.params.journalId, navigation)),
          })}
        />
      </Stack.Navigator>
    );
  }

  function MainApp() {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'clockcircleo';
          } else if (route.name === 'Favorite') {
            iconName = 'hearto';
          } else if (route.name === 'Cart') {
            iconName = 'shoppingcart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A2B29',
        tabBarInactiveTintColor: 'gray',
        headerStyle: styles.header,
        headerTintColor: '#4A2B29',
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          if (routeName === 'JournalDetail') {
            return { display: 'none' };
          }
          return {};
        })(route),
      })}>
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="History" component={HistoryStack} options={{ headerShown: false }} />
        <Tab.Screen name="Favorite" component={FavoriteStack} options={{ headerShown: false }} />
        <Tab.Screen name="Cart" component={CartStack} options={{ headerShown: false }} />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{ headerShown: false}}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <MainApp /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRightContainer: {
    marginRight: 16,
  },
  logoutButton: {
    padding: 8,
  },
});