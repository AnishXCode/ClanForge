import { StyleSheet, Text } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'

const login = () => {

  const handleSubmit = () => {
    alert('Working on Login')
  }
  return (
    <ThemedView style={ styles.page }>
      <ThemedLogo style={styles.logo}/>
      <Spacer />
      <ThemedText title={true} style={styles.title} >SignIn</ThemedText>
      <Spacer height={100} />
      <ThemedButton onPress={handleSubmit} style={styles.btn} >
        <Text style={{ color: '#1E293B', fontWeight: 600}} >Login</Text>
      </ThemedButton>
      <ThemedText  style={styles.title} >Donot have an accout?</ThemedText>
      <Link href={'/signup'} style={styles.link}>
      <ThemedText style = {styles.register}>SignUp</ThemedText>
      </Link>

      <Link href={'/dashboard'} style={styles.link}>
      <ThemedText style = {styles.register}>Dashboard</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default login

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  logo: {
     margin: 20,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1
  },
  btn: {
    
  }
})