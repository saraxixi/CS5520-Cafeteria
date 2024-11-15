import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from "react-native";
import { auth } from "../firebase/FirebaseSetup";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const userStats = {
    ordersCount: 12,
    favoritesCount: 8,
    totalSpent: 149.99
  };

  const menuItems = [
    {
      icon: "settings",
      title: "Account Settings",
      onPress: () => navigation.navigate("EditProfile")
    },
    {
      icon: "credit-card",
      title: "Payment Methods",
      onPress: () => Alert.alert("Payments", "Payment methods coming soon")
    },
    {
      icon: "map-pin",
      title: "Delivery Addresses",
      onPress: () => Alert.alert("Addresses", "Address management coming soon")
    },
    {
      icon: "bell",
      title: "Notifications",
      onPress: () => Alert.alert("Notifications", "Notification settings coming soon")
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      onPress: () => Alert.alert("Support", "Support center coming soon")
    },
    {
      icon: "info",
      title: "About Us",
      onPress: () => Alert.alert("About", "About page coming soon")
    }
  ];

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="coffee" size={40} color="#4A2B29" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/app_images/avatar.png')}
            style={styles.avatar}
            defaultSource={require('../assets/app_images/avatar.png')}
          />
          <TouchableOpacity style={styles.editButton } onPress={() => navigation.navigate("EditProfile")}>
            <Feather name="edit-2" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Member since {new Date().getFullYear()}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.ordersCount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statNumber}>{userStats.favoritesCount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
          <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>${userStats.totalSpent}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
          <Text style={styles.statLabel}>Journal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Feather name={item.icon} size={20} color="#4A2B29" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4A2B29",
  },
  header: {
    backgroundColor: "#4A2B29",
    padding: 20,
    alignItems: "center",
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#666',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  email: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  memberSince: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#EEEEEE",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A2B29",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});