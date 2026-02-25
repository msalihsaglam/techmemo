import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';

const HomeScreen = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // API'den verileri çekme fonksiyonu
  const fetchCases = async () => {
    try {
      // DİKKAT: 'localhost' yerine bilgisayarının IP adresini yazmalısın!
      const response = await fetch('http://192.168.1.66:8000/cases'); 
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCases();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A237E" />
        <Text>Vakalar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cases}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: item.status === 'resolved' ? '#E8F5E9' : '#FFF3E0' }]}>
                <Text style={[styles.badgeText, { color: item.status === 'resolved' ? '#2E7D32' : '#EF6C00' }]}>
                  {item.status === 'resolved' ? '✅ ÇÖZÜLDÜ' : '❓ YARDIM LAZIM'}
                </Text>
              </View>
              <Text style={styles.points}>+{item.points} XP</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.systemTag}>#{item.system}</Text>
              <Text style={styles.author}>👤 {item.author}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

// Stiller aynı kalabilir, sadece .center ekleyelim
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 15, marginHorizontal: 15, elevation: 3, marginTop: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  points: { fontSize: 12, fontWeight: 'bold', color: '#1A237E' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  systemTag: { fontSize: 12, color: '#1A237E', fontWeight: 'bold' },
  author: { fontSize: 12, color: '#777' }
});

export default HomeScreen;