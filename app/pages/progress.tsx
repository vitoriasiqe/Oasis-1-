import React, { useEffect, useState, useCallback } from "react";
import { useFonts } from "expo-font";
import StyleOfIndex from "../../../assets/style/home";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from "react-native";

import ActivityCalendar from "../../../components/ActivityCalendar";
import DayActivityDetails, { DetailedActivity } from "../../../components/DayActivityDetails";

const coursesInProgress = [

  { id: "1", title: "Algebra Descomplicada", progress: "50%", image: require("../../../assets/images/progress/algebracurso.jpg") },
  { id: "2", title: "Como Criar um Currículo Eficaz", progress: "30%", image: require("../../../assets/images/progress/curriculo.jpeg") },
  { id: "3", title: "Redação para o ENEM - Guia prático", progress: "75%", image: require("../../../assets/images/progress/redacao.jpg") },
  { id: "4", title: "Fundamentos da Inteligência Artificial", progress: "20%", image: require("../../../assets/images/progress/ia.jpg") },
];

const API_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";
const USER_ID = "1";

export default function ProgressScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_Regular: require("../../../assets/fonts/poppins/Poppins-Regular.ttf"),
    Poppins_Bold: require("../../../assets/fonts/poppins/Poppins-Bold.ttf"),
    Poppins_SemiBold: require("../../../assets/fonts/poppins/Poppins-SemiBold.ttf"),
  });

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().toISOString().substring(0, 7));
  const [markedDatesData, setMarkedDatesData] = useState({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayActivities, setDayActivities] = useState<DetailedActivity[] | null>(null);

  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorCalendar, setErrorCalendar] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const fetchActivityCalendarData = useCallback(async (month: string) => {
    setIsLoadingCalendar(true);
    setErrorCalendar(null);
    setMarkedDatesData({});
    try {
      const response = await fetch(`${API_BASE_URL}/user/activity-calendar?month=${month}&userId=${USER_ID}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro HTTP: ${response.status}` }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setMarkedDatesData(data);
    } catch (err: any) {
      setErrorCalendar(err.message || "Falha ao buscar dados do calendário.");
      console.error("fetchActivityCalendarData error:", err);
    } finally {
      setIsLoadingCalendar(false);
    }
  }, []);

  const fetchDayActivities = useCallback(async (date: string) => {
    setIsLoadingDetails(true);
    setErrorDetails(null);
    setDayActivities(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/activities-by-date?date=${date}&userId=${USER_ID}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro HTTP: ${response.status}` }));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setDayActivities(data);
    } catch (err: any) {
      setErrorDetails(err.message || "Falha ao buscar atividades do dia.");
      console.error("fetchDayActivities error:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      fetchActivityCalendarData(currentCalendarMonth);
    }
  }, [currentCalendarMonth, fetchActivityCalendarData, fontsLoaded]);

  useEffect(() => {
    if (selectedDate && fontsLoaded) {
      fetchDayActivities(selectedDate);
    } else if (!selectedDate) {
      setDayActivities(null);
      setErrorDetails(null);
    }
  }, [selectedDate, fetchDayActivities, fontsLoaded]);

  const handleMonthChange = useCallback((newMonthString: string) => {
    setCurrentCalendarMonth(newMonthString);
    setSelectedDate(null);
    setDayActivities(null);
    setErrorDetails(null);
  }, []);

  const handleDayPress = useCallback((dateString: string) => {
    setSelectedDate((prevDate) => (prevDate === dateString ? null : dateString));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1261D7" />
        <Text style={{ fontFamily: "Poppins_Regular", marginTop: 10 }}>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require("../../../assets/images/forma001.png")}
          style={StyleOfIndex.forma001Back}
          resizeMode="contain"
        />
        <ImageBackground
          source={require("../../../assets/images/forma004.png")}
          style={StyleOfIndex.forma002Back}
          resizeMode="contain"
        />
        <Text style={styles.title}>Meu Progresso e Atividades</Text>
        <View style={styles.imageContainer}>
          <Image source={require("../../../assets/images/progress.png")} style={styles.headerImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.calendarSection}>
        <Text style={styles.sectionTitle}>Calendário de Atividades</Text>
        {isLoadingCalendar && <ActivityIndicator size="large" color="#1261D7" style={styles.loadingIndicator} />}
        {errorCalendar && !isLoadingCalendar && <Text style={styles.errorText}>Erro ao carregar calendário: {errorCalendar}</Text>}
        {!isLoadingCalendar && !errorCalendar && (
          <ActivityCalendar current={currentCalendarMonth} markedDates={markedDatesData} onDayPress={handleDayPress} onMonthChange={handleMonthChange} />
        )}
      </View>

      {selectedDate && (
        <View style={styles.detailsSection}>
          {isLoadingDetails && <ActivityIndicator size="large" color="#1261D7" style={styles.loadingIndicator} />}

          {!isLoadingDetails && errorDetails && <Text style={styles.errorText}>Erro ao carregar detalhes: {errorDetails}</Text>}

          {!isLoadingDetails && !errorDetails && dayActivities && dayActivities.length > 0 && (
            <DayActivityDetails selectedDate={selectedDate} activities={dayActivities} />
          )}

          {!isLoadingDetails && !errorDetails && dayActivities && dayActivities.length === 0 && (
            <View style={styles.noActivityContainer}>
              <Text style={styles.noActivityText}>Nenhuma atividade registrada para {selectedDate}.</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.courseListSection}>
        <Text style={styles.sectionTitle}>Seus cursos em andamento</Text>
        <View style={styles.courseList}>
          <View style={styles.rowWrapper}>
            {coursesInProgress.map((item) => (
              <TouchableOpacity key={item.id} style={styles.courseCard} activeOpacity={0.7} onPress={() => console.log(`Curso clicado: ${item.title}`)}>
                <Image source={item.image} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{item.title}</Text>
                  <Text style={styles.courseProgress}>Progresso: {item.progress}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === "android" ? 25 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_Bold",
    color: "#1261D7",
    textAlign: "center",
    marginTop: 10,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  headerImage: {
    width: 500,
    height: 350,
  },
  calendarSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailsSection: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_Bold",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 5,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Poppins_Regular",
    paddingHorizontal: 10,
  },
  noActivityContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginTop: 5,
  },
  noActivityText: {
    fontSize: 14,
    fontFamily: "Poppins_Regular",
    color: "#777",
    textAlign: "center",
  },
  courseListSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  courseList: {
    paddingBottom: 20,
  },
  rowWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  courseCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courseImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  courseInfo: {
    alignItems: "center",
  },
  courseTitle: {
    fontSize: 15,
    fontFamily: "Poppins_SemiBold",
    textAlign: "center",
    color: "#444",
  },
  courseProgress: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontFamily: "Poppins_Regular",
  },
});
