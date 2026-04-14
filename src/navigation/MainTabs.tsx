import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { BuildIdeasScreen } from '../screens/BuildIdeasScreen';
import { EnchantingScreen } from '../screens/EnchantingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SeedMapScreen } from '../screens/SeedMapScreen';
import { SkinScreen } from '../screens/SkinScreen';
import { useDeviceClass } from '../responsive';
import { font, palette } from '../theme';

type TabParamList = {
  Builds: undefined;
  Calculadora: undefined;
  Encantamientos: undefined;
  Inicio: undefined;
  Seed: undefined;
  Skin: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const tablet = deviceClass === 'tablet';

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: palette.appBackground },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabel: ({ focused }) => {
          const meta = getTabMeta(route.name);
          return (
            <Text
              numberOfLines={2}
              style={{
                color: focused ? palette.primary : palette.muted,
                fontFamily: font.body,
                fontSize: compact ? 8 : tablet ? 9 : 10,
                fontWeight: '700',
                lineHeight: compact ? 10 : 12,
                marginTop: 1,
                textAlign: 'center',
              }}
            >
              {meta.label}
            </Text>
          );
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          paddingHorizontal: compact ? 1 : 2,
        },
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          height: compact ? 74 : tablet ? 76 : 80,
          paddingBottom: compact ? 9 : 10,
          paddingTop: compact ? 6 : 8,
        },
        tabBarIcon: () => {
          const meta = getTabMeta(route.name);
          return (
            <Text
              style={{
                fontSize: compact ? 16 : tablet ? 18 : 19,
                lineHeight: compact ? 18 : 20,
                textAlign: 'center',
              }}
            >
              {meta.emoji}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen component={HomeScreen} name="Inicio" options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen component={CalculatorScreen} name="Calculadora" options={{ tabBarLabel: 'Calculadora' }} />
      <Tab.Screen component={EnchantingScreen} name="Encantamientos" options={{ tabBarLabel: 'Encantamientos' }} />
      <Tab.Screen component={BuildIdeasScreen} name="Builds" options={{ tabBarLabel: 'Proyectos' }} />
      <Tab.Screen component={SeedMapScreen} name="Seed" options={{ tabBarLabel: 'Seed' }} />
      <Tab.Screen component={SkinScreen} name="Skin" options={{ tabBarLabel: 'Skins' }} />
    </Tab.Navigator>
  );
}

function getTabMeta(routeName: keyof TabParamList): { emoji: string; label: string } {
  switch (routeName) {
    case 'Builds':
      return { emoji: '🏗️', label: 'Proyectos' };
    case 'Calculadora':
      return { emoji: '🧮', label: 'Calculadora' };
    case 'Encantamientos':
      return { emoji: '✨', label: 'Encantamientos' };
    case 'Seed':
      return { emoji: '🗺️', label: 'Seed' };
    case 'Skin':
      return { emoji: '👕', label: 'Skins' };
    case 'Inicio':
    default:
      return { emoji: '⛏️', label: 'Inicio' };
  }
}
