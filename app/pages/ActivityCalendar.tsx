import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração da localidade pt-br para o calendário
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

export interface MarkedDateCustomStyles {
  customStyles: {
    container: object;
    text: object;
  };
}

export interface ActivityCalendarProps {
  markedDates: { [date: string]: MarkedDateCustomStyles };
  onDayPress?: (dateString: string) => void;
  current: string; // YYYY-MM (ex: "2025-06")
  onMonthChange?: (month: string) => void;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  markedDates,
  onDayPress,
  current,
  onMonthChange,
}) => {
  const handleDayPress = (day: any) => {
    if (onDayPress) onDayPress(day.dateString);
  };

  const handleMonthChange = (monthInfo: any) => {
    const newMonthString = monthInfo.dateString.substring(0, 7);
    if (onMonthChange) onMonthChange(newMonthString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={current}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        firstDay={1}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#1261D7',
          selectedDayBackgroundColor: '#1261D7',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#1261D7',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#1261D7',
          selectedDotColor: '#ffffff',
          arrowColor: '#1261D7',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#1261D7',
          indicatorColor: 'blue',
          textDayFontFamily: 'Poppins_Regular',
          textMonthFontFamily: 'Poppins_Bold',
          textDayHeaderFontFamily: 'Poppins_Bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendarStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarStyle: {
    borderRadius: 10,
  },
});

export default ActivityCalendar;
