import { StyleSheet, useColorScheme, View, TouchableOpacity } from 'react-native'
import { Colours } from '../../constants/colours'

import { Ionicons } from '@expo/vector-icons';
import UserOnly from '../../components/auth/userOnly';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../../components/ThemedText';
import { useRouter, Slot } from 'expo-router';

const GameLayout = () => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light
    const router = useRouter();

    const insets = useSafeAreaInsets()

    const handleBackButton = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(dashboard)/dashboard');
      }
    }

  return (
    <UserOnly>
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top}}>
        <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackButton}>
                  <View style={[styles.badge, {borderColor: theme.border}]}>
                    <Ionicons name="arrow-back" size={20} color={'white'} style={styles.icon} />
                    <ThemedText style={styles.badgeText}>Back</ThemedText>
                  </View>
                </TouchableOpacity>
        </View>

        <Slot />
        
      </View>
    </UserOnly>
  )
}

export default GameLayout

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
      marginRight: 5,
      
    },
    badge: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      backgroundColor: Colours.warning, 
      borderRadius: 6,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
    },
    badgeText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
})
