import { StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'

const index = () => {
  return (
    <ThemedView style={styles.page} > 
    <ThemedLogo style={styles.logo} />
    <Spacer height={50} />
    <ThemedText title={true} style={styles.welcome}>Welcome To ClanForge</ThemedText>
    <Link href="/login" style={styles.link}><ThemedText>Login</ThemedText></Link>
    <Link href="/signup" style={styles.link}><ThemedText>SignUp</ThemedText></Link>
    <Spacer height={200} />
    </ThemedView>
  )
}

export default index;

const styles = StyleSheet.create({
    logo: {
        margin: 20,
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    welcome: {
      margin: 20
    },
    link: {
      marginVertical: 10,
      borderBottomWidth: 1
    }

})