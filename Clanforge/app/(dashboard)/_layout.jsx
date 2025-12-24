import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colours } from '../../constants/colours'

import { Ionicons } from '@expo/vector-icons';

const DashboardLayout = () => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

  return (
    <Tabs 
        screenOptions={{ headerShown: false, tabBarStyle: {
                backgroundColor: theme.navBackground,
                paddingTop: 10,
                height: 90
        },
    tabBarActiveTintColor: theme.iconColourFocused,
    tabBarInactiveTintColor: theme.iconColour
}}
    >
    <Tabs.Screen name='profile' options={{ title: '', tabBarIcon: ({ focused }) => (
        <Ionicons 
        size={24}
        name= {focused ? 'person' : 'person-outline' }
        color={focused ? theme.iconColourFocused : theme.iconColour}
        />
    )}} />   
    <Tabs.Screen name='dashboard' options={{ title: '' , tabBarIcon: ({ focused }) => (
        <Ionicons 
        size={24}
        name= {focused ? 'home' : 'home-outline' }
        color={focused ? theme.iconColourFocused : theme.iconColour}
        />
    )}}
    
    />   
    <Tabs.Screen name='leaderboard' options={{ title: '' , tabBarIcon: ({ focused }) => (
        <Ionicons 
        size={24}
        name= {focused ? 'bar-chart' : 'bar-chart-outline' }
        color={focused ? theme.iconColourFocused : theme.iconColour}
        />
    )}} />   
    </Tabs>
  )
}

export default DashboardLayout
