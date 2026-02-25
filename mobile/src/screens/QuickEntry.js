import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const QuickEntry = () => {
  const [intent, setIntent] = useState(null); // 'solution' or 'problem'
  const [summary, setSummary] = useState('');
  const [suggestedCases, setSuggestedCases] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Bağlantısı (Buradaki IP'yi kendi ipconfig çıktınla güncelle!)
  const API_URL = 'http://192.168.1.66:8000/cases'; 

  const handleSummaryChange = (text) => {
    setSummary(text);
    const lowerText = text.toLowerCase();
    
    // Basit öneri mekanizması (Backend'den çekmek için geliştirilebilir)
    if (lowerText.length >= 3 && lowerText.includes('wincc')) {
      setSuggestedCases([
        { id: 1, title: 'WinCC Runtime Tag Connectivity Issue', author: 'Ahmet Y.' },
        { id: 2, title: 'WinCC OA User Management Bug', author: 'Mehmet K.' }
      ]);
    } else {
      setSuggestedCases([]);
    }
  };

  const handleSave = async () => {
    console.log("İstek atılan adres:", API_URL);
    if (!intent || !summary) {
      Alert.alert("Hata", "Lütfen bir niyet seçin ve özet yazın.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: summary,
          intent: intent,
          system_tag: summary.toLowerCase().includes('wincc') ? 'SCADA' : 'PLC',
          author_name: "Mehmet" // İleride Login sisteminden gelecek
        }),
      });

      if (response.ok) {
        Alert.alert("Başarılı", "Vaka sisteme kaydedildi! 🚀");
        // Formu temizle
        setSummary('');
        setIntent(null);
        setSuggestedCases([]);
      } else {
        Alert.alert("Hata", "Sunucu hatası oluştu.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bağlantı kurulamadı. Backend çalışıyor mu?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* 1. Niyet Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bugün Ne Yapıyoruz?</Text>
          <View style={styles.intentRow}>
            <TouchableOpacity 
              style={[styles.intentCard, intent === 'solution' && styles.solutionActive]} 
              onPress={() => setIntent('solution')}>
              <View style={[styles.iconCircle, {backgroundColor: '#E8F5E9'}]}>
                <Text style={{fontSize: 20}}>✅</Text>
              </View>
              <Text style={styles.intentText}>Çözümüm Var</Text>
              <Text style={styles.intentSubText}>Hafızaya ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.intentCard, intent === 'problem' && styles.problemActive]} 
              onPress={() => setIntent('problem')}>
              <View style={[styles.iconCircle, {backgroundColor: '#FFF8E1'}]}>
                <Text style={{fontSize: 20}}>❓</Text>
              </View>
              <Text style={styles.intentText}>Sorunum Var</Text>
              <Text style={styles.intentSubText}>Destek iste</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Hızlı Özet Girişi */}
        <View style={styles.section}>
          <Text style={styles.label}>Vaka Özeti</Text>
          <TextInput 
            style={styles.input}
            placeholder="Örn: S7-1500 Haberleşme Hatası..."
            value={summary}
            onChangeText={handleSummaryChange}
            placeholderTextColor="#999"
          />
          <Text style={styles.inputHint}>Kısa ve öz (4-5 kelime)</Text>
        </View>

        {/* 3. Akıllı Öneriler Bölümü */}
        {suggestedCases.length > 0 && (
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionTitle}>💡 Benzer Çözümler Bulundu</Text>
            {suggestedCases.map(item => (
              <TouchableOpacity key={item.id} style={styles.caseCard} activeOpacity={0.7}>
                <View style={styles.caseCardContent}>
                  <Text style={styles.caseTitle}>{item.title}</Text>
                  <Text style={styles.caseAuthor}>👨‍🔧 {item.author}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 4. Alt Buton Bölümü */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity 
            style={[styles.nextBtn, (!intent || isSubmitting) && styles.disabledBtn]} 
            onPress={handleSave}
            disabled={!intent || isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>
              {isSubmitting ? 'Kaydediliyor...' : (intent === 'solution' ? 'Çözümü Kaydet' : 'Yardım İste')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>Sistem: {summary.toLowerCase().includes('wincc') ? 'SCADA' : 'PLC'}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  intentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intentCard: { 
    flex: 0.48, 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 16, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2 
  },
  solutionActive: { borderColor: '#4CAF50', backgroundColor: '#F1F8E9' },
  problemActive: { borderColor: '#FFA000', backgroundColor: '#FFF8E1' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  intentText: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  intentSubText: { fontSize: 11, color: '#777', marginTop: 2 },
  label: { fontSize: 15, fontWeight: '700', color: '#333' },
  input: { 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 8, 
    fontSize: 16, 
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  inputHint: { fontSize: 12, color: '#999', marginTop: 6, marginLeft: 4 },
  suggestionBox: { marginTop: 20, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 16 },
  suggestionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1565C0', marginBottom: 12 },
  caseCard: { 
    backgroundColor: '#FFF', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 8, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  caseCardContent: { flex: 1 },
  caseTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  caseAuthor: { fontSize: 11, color: '#666', marginTop: 4 },
  arrow: { fontSize: 24, color: '#BBDEFB', fontWeight: 'bold' },
  nextBtn: { backgroundColor: '#1A237E', padding: 18, borderRadius: 14, marginTop: 30, alignItems: 'center', elevation: 4 },
  disabledBtn: { backgroundColor: '#BDBDBD', elevation: 0 },
  nextBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footerNote: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 15 }
});

export default QuickEntry;