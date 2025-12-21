import { StyleSheet, Text, View, Image} from 'react-native'
import { Link } from 'expo-router'

import Logo from '../assets/clanforge.png'

const index = () => {
  return (
    <View style={styles.page} > 
    <Image style={styles.logo} source={Logo} />
    <Text>index</Text>
    <Link href="/login" style={styles.link}>Login</Link>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    logo: {
        margin: 20,
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#fff'
    },
    link: {
      color: '#373F46',
      
    }
})