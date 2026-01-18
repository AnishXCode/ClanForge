import { Slot, Tabs, useNavigation, useRouter } from 'expo-router'
import { StyleSheet, useColorScheme, View, TouchableOpacity } from 'react-native'
import { Colours } from '../../constants/colours'

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import UserOnly from '../../components/auth/userOnly';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedLogo from '../../components/ThemedLogo';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import useNotifications from '../../hooks/useNotifications';

const NavLayout = () => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light
    const router = useRouter()

    const insets = useSafeAreaInsets()

    const { unreadCount } = useNotifications()

    const handleClick = (ref) => {
      router.replace(`/(navigation)/${ref}`)
    }

    const handleBack = () => {
      router.replace('/(dashboard)/dashboard')
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
    <View style={{backgroundColor: theme.background}}>
    <ThemedButton onPress={() => {handleBack()}} style={styles.back}>
      <Ionicons  name='arrow-back' size={20} style={{ marginRight: 10, color: '#000' }}/>
      <ThemedText button={true} style={styles.backText}>Back To Dashboard</ThemedText>
    </ThemedButton>
    </View>
    <Slot />
    </UserOnly>
  )
}

export default NavLayout

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
    back: {
      display: 'flex',
      flexDirection: 'row',
      width: '46%',
      marginHorizontal: 20,
      padding: 10
    },
    backText: {
      fontWeight: 600,
      fontSize: 15
    }
})
