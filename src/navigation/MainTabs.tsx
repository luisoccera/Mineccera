import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
        tabBarLabelStyle: {
          fontFamily: font.body,
          fontSize: compact ? 8 : tablet ? 10 : 11,
          fontWeight: '700',
          lineHeight: compact ? 10 : 13,
          textAlign: 'center',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          paddingHorizontal: compact ? 0 : 2,
        },
        tabBarStyle: {
          borderTopColor: palette.border,
          height: compact ? 64 : tablet ? 68 : 72,
          paddingBottom: compact ? 7 : 9,
          paddingTop: compact ? 6 : 8,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          const iconSize = compact ? 19 : tablet ? 21 : size;
          return <MaterialCommunityIcons color={color} name={iconName} size={iconSize} />;
        },
      })}
    >
      <Tab.Screen component={HomeScreen} name="Inicio" options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen component={CalculatorScreen} name="Calculadora" options={{ tabBarLabel: 'Calcula' }} />
      <Tab.Screen component={EnchantingScreen} name="Encantamientos" options={{ tabBarLabel: 'Encanta' }} />
      <Tab.Screen component={BuildIdeasScreen} name="Builds" options={{ tabBarLabel: 'Proyectos' }} />
      <Tab.Screen component={SeedMapScreen} name="Seed" options={{ tabBarLabel: 'Seed' }} />
      <Tab.Screen component={SkinScreen} name="Skin" options={{ tabBarLabel: 'Skins' }} />
    </Tab.Navigator>
  );
}

function getIconName(routeName: keyof TabParamList): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (routeName) {
    case 'Builds':
      return 'home-search-outline';
    case 'Calculadora':
      return 'calculator-variant-outline';
    case 'Encantamientos':
      return 'anvil';
    case 'Seed':
      return 'map-search-outline';
    case 'Skin':
      return 'account-box-outline';
    case 'Inicio':
    default:
      return 'pickaxe';
  }
}
