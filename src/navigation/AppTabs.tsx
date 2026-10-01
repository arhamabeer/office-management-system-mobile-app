import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import LeavesScreen from '../screens/LeavesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import PayslipsScreen from '../screens/PayslipsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../theme/theme';

const Tab = createBottomTabNavigator();

/** Employee bottom-tab shell. Attendance/Leaves/Payslips arrive in M2–M4. */
export default function AppTabs() {
  const t = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarStyle: { backgroundColor: t.colors.surface, borderTopColor: t.colors.border },
        headerStyle: { backgroundColor: t.colors.surface },
        headerTitleStyle: { color: t.colors.text },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Leaves" component={LeavesScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Payslips" component={PayslipsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
