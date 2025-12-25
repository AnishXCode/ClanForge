import { Keyboard ,StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { useState } from 'react'
import { Link } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import Spacer from '../../components/Spacer'
import { useUser } from '../../contexts/useUser'
import { Colours } from '../../constants/colours'

const signup = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null);

  const { signup } = useUser()

  const handleSubmit = async () => {
    setError(null)
    try{
      await signup(email, password, username)
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ThemedView style={ styles.page }>
      <ThemedLogo style={styles.logo}/>
      <Spacer />
      <ThemedText title={true} style={styles.title} >SignUp</ThemedText>
      <Spacer height={20} />

      <ThemedTextInput 
          style = {{ width: '85%', marginBottom: 20 }}
          placeholder='UserName'        
          onChangeText={setUsername}
          value={username}
      />

      <ThemedTextInput 
          style = {{ width: '85%', marginBottom: 20 }}
          placeholder='Email' 
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
      />

      <ThemedTextInput 
          style = {{ width: '85%', marginBottom: 20 }}
          placeholder='Password'        
          onChangeText={setPassword}
          value={password}
          secureTextEntry
      />

      {error && 
        <Text style={styles.error}>{error}</Text>    
      }

      <ThemedButton onPress={handleSubmit} style={styles.btn} >
        <ThemedText style={{ fontWeight: 600, fontSize: 18}} title={true}>Register</ThemedText>
      </ThemedButton>
      <Link href={'/login'} style={styles.link}>
      <ThemedText style = {styles.register}>Login Instead</ThemedText>
      </Link>
    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default signup

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 700
  },
  text: {
    fontSize: 20
  },
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
   width: '85%',
   justifyContent: 'center',
   alignItems: 'center'
  },
  error: {
   color: Colours.warning,
   padding: 10,
   marginTop: 10,
   backgroundColor: '#f5c1c8',
   borderColor: Colours.warning,
   borderWidth: 1,
   borderRadius: 6,
   marginHorizontal: 10,
   width: '90%'
  }
})