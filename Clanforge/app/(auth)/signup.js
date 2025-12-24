import { StyleSheet, Text } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'

const signup = () => {

    const handleSubmit = () => {
    alert('Working on SignUp')
  }
  return (
    <ThemedView style={ styles.page }>
      <ThemedLogo style={styles.logo}/>
      <Spacer />
      <ThemedText title={true} style={styles.title} >SignUp Now!</ThemedText>
      <Spacer height={100} />
      <ThemedButton onPress={handleSubmit} style={styles.btn} >
        <Text style={{ color: '#1E293B', fontWeight: 600}} >SignUp</Text>
      </ThemedButton>
      <Link href={'/login'} style={styles.link}>
      <ThemedText style = {styles.register}>Login Instead</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default signup

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
  title: {
    
  }
})