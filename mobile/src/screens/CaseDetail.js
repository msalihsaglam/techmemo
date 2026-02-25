import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CaseDetail = ({ route }) => {
  // HomeScreen'den gelen veriyi alıyoruz
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Üst Kart: Durum ve Puan */}
      <View style={styles.headerCard}>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'resolved' ? '#E8F5E9' : '#FFF3E0' }]}>
          <Text style={[styles.statusText, { color: item.status === 'resolved' ? '#2E7D32' : '#EF6C00' }]}>
            {item.status === 'resolved' ? 'ÇÖZÜLDÜ' : 'YARDIM BEKLİYOR'}
          </Text>
        </View>
        <Text style={styles.caseId}>ID: {item.id.slice(0, 8)}...</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {/* Teknik Bilgi Satırı */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="hardware-chip-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{item.system}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{item.author}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="trophy-outline" size={20} color="#FFD700" />
          <Text style={styles.infoText}>{item.points} XP</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Açıklama Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>
          {item.description || "Bu vaka için henüz detaylı bir açıklama girilmemiş. Mühendis kısa özetle hızlı giriş yapmış."}
        </Text>
      </View>

      {/* Aksiyon Butonları */}
      {item.status !== 'resolved' && (
        <TouchableOpacity style={styles.solveBtn}>
          <Text style={styles.solveBtnText}>Çözüm Önerisinde Bulun</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontWeight: '800', fontSize: 12 },
  caseId: { color: '#999', fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { fontSize: 14, color: '#444', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  solveBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  solveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default CaseDetail;