import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DailyForecastDay } from '@/types/weather';
import { TemperatureUnit } from '@/store/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getWeatherInfo } from '@/utils/weatherCodes';
import { formatDayOfWeek, formatShortDate, formatTemperature } from '@/utils/formatters';

export interface DailyForecastListProps {
  days: DailyForecastDay[];
  unit: TemperatureUnit;
}

export function DailyForecastList({ days, unit }: DailyForecastListProps) {
  const { colors } = useThemeColors();

  if (!days || days.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>7-Day Forecast</Text>

      <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {days.map((day, index) => {
          const condition = getWeatherInfo(day.weatherCode);
          const isLast = index === days.length - 1;

          return (
            <View key={day.date}>
              <View style={styles.dayRow}>
                <View style={styles.dayDateContainer}>
                  <Text style={[styles.dayName, { color: colors.textPrimary }]}>
                    {formatDayOfWeek(day.date)}
                  </Text>
                  <Text style={[styles.dateSubtitle, { color: colors.textSecondary }]}>
                    {formatShortDate(day.date)}
                  </Text>
                </View>

                <View style={styles.conditionContainer}>
                  <Ionicons name={condition.iconName} size={22} color={condition.iconColor} />
                  {day.precipitationProbability > 0 && (
                    <View style={styles.rainBadge}>
                      <Ionicons name="water" size={11} color="#38bdf8" />
                      <Text style={styles.rainChance}>{day.precipitationProbability}%</Text>
                    </View>
                  )}
                </View>

                <View style={styles.temperaturesContainer}>
                  <Text style={[styles.maxTemp, { color: colors.textPrimary }]}>
                    {formatTemperature(day.temperatureMax, unit)}
                  </Text>
                  <Text style={[styles.minTemp, { color: colors.textSecondary }]}>
                    {formatTemperature(day.temperatureMin, unit)}
                  </Text>
                </View>
              </View>
              {!isLast && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayDateContainer: {
    width: 90,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rainChance: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
  },
  temperaturesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  maxTemp: {
    fontSize: 16,
    fontWeight: '700',
  },
  minTemp: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
  },
});
