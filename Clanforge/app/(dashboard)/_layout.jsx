import { Tabs, useRouter } from 'expo-router'
import { StyleSheet, useColorScheme, View, TouchableOpacity } from 'react-native'
import { Colours } from '../../constants/colours'

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import UserOnly from '../../components/auth/userOnly';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedLogo from '../../components/ThemedLogo';
import ThemedText from '../../components/ThemedText';
import useNotifications from '../../hooks/useNotifications';

const DashboardLayout = () => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light
    const router = useRouter()

    const { unreadCount } = useNotifications()

    const insets = useSafeAreaInsets()

    const handleClick = (ref) => {
      router.push(`/(navigation)/${ref}`)
    }

  return (
    <UserOnly>
        <View style={{ backgroundColor: theme.background, paddingTop: insets.top}}>
        <View style={styles.headerContainer}>
            <ThemedLogo style={styles.logo} header={true}/>
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => {handleClick("notifications")}}>
                  <Ionicons name="notifications" size={26} color={theme.text} style={styles.icon} />
                  <View style={[styles.badge, {borderColor: theme.border}]}>
                    <ThemedText style={styles.badgeText}>{!unreadCount ? 0 : unreadCount}</ThemedText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {handleClick("addfriends")}} style={styles.friendIconWrapper}>
                  <FontAwesome5 name="user-friends" size={22} color={theme.text} style={styles.icon} />
                  {/* <View style={[styles.badge, {borderColor: theme.border}]}>
                    <ThemedText style={styles.badgeText}>1</ThemedText>
                  </View> */}
                </TouchableOpacity>
            </View>
        </View>
    </View>

    <Tabs 
        screenOptions={{ headerShown: false, tabBarStyle: {
                backgroundColor: theme.navBackground,
                paddingTop: 10,
                height: 90
        },
    tabBarActiveTintColor: theme.iconColourFocused,
    tabBarInactiveTintColor: theme.iconColour
    }} >
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
    </UserOnly>
  )
}

export default DashboardLayout

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
      marginLeft: 20,
    },
    friendIconWrapper: {
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -5,
      right: -8,
      backgroundColor: Colours.warning, 
      borderRadius: 10,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
    },
    badgeText: {
      color: 'white',
      fontSize: 9,
      fontWeight: 'bold',
    },
})
