import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack eklendi
import { Ionicons } from '@expo/vector-icons';

// EKRANLARI IMPORT EDİYORUZ
import HomeScreen from './src/screens/HomeScreen';
import QuickEntry from './src/screens/QuickEntry';
import CaseDetail from './src/screens/CaseDetail'; // Yeni oluşturduğumuz detay sayfası

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- ANA SAYFA İÇİN STACK YAPISI ---
// Bu yapı sayesinde listeden detay sayfasına gidince Tab Bar gizlenmez veya üstte navigasyon oluşur
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1A237E' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="Feed" 
        component={HomeScreen} 
        options={{ title: 'TechMemo Akışı' }} 
      />
      <Stack.Screen 
        name="CaseDetail" 
        component={CaseDetail} 
        options={{ title: 'Vaka Detayı' }} 
      />
    </Stack.Navigator>
  );
}

// Profil sayfası için geçici yer tutucu
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
    <Ionicons name="construct-outline" size={64} color="#1A237E" />
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Profil & Puanlar</Text>
    <Text style={{ color: '#666' }}>Mühendis rütben yakında burada!</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#1A237E' },
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
          tabBarStyle: { height: 60, paddingBottom: 10 },
        })}
      >
        <Tab.Screen 
          name="Ana Sayfa" 
          component={HomeStack} // HomeScreen yerine HomeStack'i koyduk
          options={{ headerShown: false }} // Header zaten HomeStack içinde var
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