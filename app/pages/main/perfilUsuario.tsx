import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Pressable } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link } from "expo-router";

SplashScreen.preventAutoHideAsync();

const UserDashboard = () => {
  const [fontsLoaded] = useFonts({
    "Poppins_Regular": require("../../../assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins_Bold": require("../../../assets/fonts/poppins/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#1261D7" style={styles.loading} />;
  }

  const screenWidth = Dimensions.get("window").width;
  const data = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [{ data: [2, 3, 5, 1, 4, 2, 6] }],
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable>
          <Link href={'../'}>
            <Image style={styles.backIcon} source={require('@/assets/images/Back.png')} />
          </Link>
        </Pressable>
        <Text style={styles.headerTitle}>Página Inicial</Text>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Image source={{ uri: "" }} style={styles.profilePic} />
          <Text style={styles.userName}>Olá, Estudante!</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <ProgressBar progress={0.6} color="#1261D7" style={styles.progressBar} />
        </View>

     {/* Gráfico */}
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Tempo de Estudo (Horas)</Text>
  <BarChart
    data={data}
    width={screenWidth * 0.9}
    height={220}
    yAxisLabel="" // Se você não quiser label no eixo Y, tudo bem
    yAxisSuffix="h"  // Adicionando o sufixo "h" para horas
    chartConfig={{
      backgroundGradientFrom: "#1261D7",
      backgroundGradientTo: "#1261D7",
      decimalPlaces: 0,
      barRadius: 10,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: () => "#FFF",
    }}
    style={{ borderRadius: 20 }}
  />
</View>


        {/* Metas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metas da Semana</Text>
          <Text style={styles.sectionText}>- Revisar 3 capítulos de Matemática</Text>
          <Text style={styles.sectionText}>- Resolver 10 questões de Física</Text>
          <Text style={styles.sectionText}>- Fazer 2 redações</Text>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="person-circle-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="document-text-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Ver Relatórios</Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#1261D7", borderBottomLeftRadius: 20,borderBottomRightRadius: 20},
  backIcon: { width: 30, height: 30 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, color: "#FFF", fontFamily: "Poppins_Bold" },
  profileSection: { alignItems: "center", marginVertical: 20 },
  profilePic: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 22, fontFamily: "Poppins_Bold", marginTop: 10, textAlign: "center" },
  statsCard: { padding: 20, borderRadius: 20, marginBottom: 20, alignItems: "center" },
  progressBar: { height: 8, borderRadius: 5, marginVertical: 10, width: "100%" },
  chartContainer: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, marginBottom: 20 },
  chartTitle: { fontSize: 16, textAlign: "center", marginBottom: 10, color: "#1261D7", fontFamily: "Poppins_Bold" },
  section: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, textAlign: "center", color: "#1261D7", fontFamily: "Poppins_Bold" },
  sectionText: { color: "#1261D7", fontFamily: "Poppins_Regular", fontSize: 16, textAlign: "center" },
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1261D7", padding: 15, borderRadius: 20, marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 10, fontFamily: "Poppins_Bold" },
});

export default UserDashboard;
