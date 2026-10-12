import { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface WeatherCodeInfo {
  label: string;
  iconName: IoniconsName;
  iconColor: string;
}

export function getWeatherInfo(code: number): WeatherCodeInfo {
  switch (code) {
    case 0:
      return { label: 'Clear sky', iconName: 'sunny', iconColor: '#f59e0b' };
    case 1:
      return {
        label: 'Mainly clear',
        iconName: 'sunny-outline',
        iconColor: '#fbbf24',
      };
    case 2:
      return {
        label: 'Partly cloudy',
        iconName: 'partly-sunny',
        iconColor: '#38bdf8',
      };
    case 3:
      return { label: 'Overcast', iconName: 'cloudy', iconColor: '#94a3b8' };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        iconName: 'cloud-outline',
        iconColor: '#64748b',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        iconName: 'rainy-outline',
        iconColor: '#38bdf8',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'snow-outline',
        iconColor: '#7dd3fc',
      };
    case 61:
      return {
        label: 'Slight rain',
        iconName: 'rainy-outline',
        iconColor: '#38bdf8',
      };
    case 63:
      return {
        label: 'Moderate rain',
        iconName: 'rainy',
        iconColor: '#0284c7',
      };
    case 65:
      return { label: 'Heavy rain', iconName: 'rainy', iconColor: '#0369a1' };
    case 66:
    case 67:
      return {
        label: 'Freezing rain',
        iconName: 'snow-outline',
        iconColor: '#bae6fd',
      };
    case 71:
      return {
        label: 'Slight snow',
        iconName: 'snow-outline',
        iconColor: '#e0f2fe',
      };
    case 73:
      return {
        label: 'Moderate snow',
        iconName: 'snow',
        iconColor: '#e0f2fe',
      };
    case 75:
    case 77:
      return { label: 'Heavy snow', iconName: 'snow', iconColor: '#bae6fd' };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain showers',
        iconName: 'rainy',
        iconColor: '#38bdf8',
      };
    case 85:
    case 86:
      return {
        label: 'Snow showers',
        iconName: 'snow',
        iconColor: '#bae6fd',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        iconName: 'thunderstorm',
        iconColor: '#c084fc',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with hail',
        iconName: 'thunderstorm',
        iconColor: '#a855f7',
      };
    default:
      return {
        label: 'Variable',
        iconName: 'partly-sunny-outline',
        iconColor: '#38bdf8',
      };
  }
}
