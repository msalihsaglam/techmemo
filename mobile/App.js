import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// EKRANLARI IMPORT EDİYORUZ
import HomeScreen from './src/screens/HomeScreen'; // Yeni eklediğimiz akış sayfası
import QuickEntry from './src/screens/QuickEntry';

const Tab = createBottomTabNavigator();

// Henüz yapmadığımız Profil sayfası için geçici yer tutucu
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profil & Puanlar</Text>
    <Text style={{ color: '#666' }}>Başarı rozetlerin burada sergilenecek.</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#1A237E' }, // Siemens laciverti tadında profesyonel header
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Ana Sayfa') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Yeni Vaka') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1A237E',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60, paddingBottom: 10 }, // Menü çubuğunu biraz daha konforlu yaptık
        })}
      >
        <Tab.Screen 
          name="Ana Sayfa" 
          component={HomeScreen} 
          options={{ title: 'TechMemo Akışı' }} 
        />
        <Tab.Screen 
          name="Yeni Vaka" 
          component={QuickEntry} 
          options={{ title: 'Hızlı Vaka Girişi' }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{ title: 'Mühendis Profili' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}